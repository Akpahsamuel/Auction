import { Transaction } from "@mysten/sui/transactions";
import { Auction } from "../types";
import { DEVNET_AUCTION_REGISTRY_ID, DEVNET_PACKAGE_ID } from "../contants";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { toast } from "react-toastify";

export const useAuctionHook = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const createAuction = async (auction: Auction) => {
    try {
      // Create a new transaction for each auction creation
      const tx = new Transaction();

      // Initialize Sui client for devnet
      const client = new SuiClient({ url: getFullnodeUrl("devnet") });

      // Get the NFT object to determine its type
      const nftObject = await client.getObject({
        id: auction.nftId,
        options: {
          showType: true,
          showOwner: true,
          showContent: true,
        },
      });

      if (!nftObject.data) {
        throw new Error(`NFT object not found with ID: ${auction.nftId}`);
      }

      const nftType = nftObject.data.type;
      if (!nftType) {
        throw new Error("Could not determine NFT type from object data");
      }

      // Validate that the NFT is owned by the current user
      if (
        !nftObject.data.owner ||
        typeof nftObject.data.owner !== "object" ||
        !("AddressOwner" in nftObject.data.owner)
      ) {
        throw new Error(
          "NFT is not owned by an address or ownership cannot be determined",
        );
      }

      // Extract NFT metadata from the object content
      let nftName = auction.nftName || "Unnamed NFT";
      let nftDescription = auction.nftDescription || "No description available";
      let nftImageUrl = auction.nftImageUrl || "";
      
      // Try to extract metadata from the NFT object if available
      if (nftObject.data.content && 'fields' in nftObject.data.content) {
        const fields = nftObject.data.content.fields as any;
        
        // Common NFT metadata field names
        if (fields.name) nftName = fields.name;
        if (fields.description) nftDescription = fields.description;
        if (fields.image_url) nftImageUrl = fields.image_url;
        if (fields.url) nftImageUrl = fields.url;
        
        console.log("Extracted NFT metadata:", { nftName, nftDescription, nftImageUrl });
      }

      console.log("NFT Type discovered:", nftType);
      console.log("NFT Owner:", nftObject.data.owner);

      // Convert starting bid from SUI to MIST (1 SUI = 1,000,000,000 MIST)
      // This allows decimal starting bids like 1.5 SUI = 1,500,000,000 MIST
      const startingBidMist = Math.floor(auction.startingBid * 1_000_000_000);

      console.log(`Creating auction with starting bid: ${auction.startingBid} SUI (${startingBidMist} MIST)`);

      // Prepare move call arguments
      const registryArg = tx.object(DEVNET_AUCTION_REGISTRY_ID);
      const nftArg = tx.object(auction.nftId);
      const titleArg = tx.pure.vector(
        "u8",
        Array.from(new TextEncoder().encode(auction.title)),
      );
      const descriptionArg = tx.pure.vector(
        "u8",
        Array.from(new TextEncoder().encode(auction.description)),
      );
      const startingBidMistArg = tx.pure.u64(startingBidMist); // Pass MIST directly to contract
      const endTimeMsArg = tx.pure.u64(auction.endTimeMs);
      const nftNameArg = tx.pure.vector(
        "u8",
        Array.from(new TextEncoder().encode(nftName)),
      );
      const nftDescriptionArg = tx.pure.vector(
        "u8",
        Array.from(new TextEncoder().encode(nftDescription)),
      );
      const nftImageUrlArg = tx.pure.vector(
        "u8",
        Array.from(new TextEncoder().encode(nftImageUrl)),
      );
      const clockArg = tx.object("0x6"); // System clock object

      // Call the generic create_auction function with proper type argument
      tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::auction_house::create_auction`,
        typeArguments: [nftType], // Pass the discovered NFT type
        arguments: [
          registryArg,
          nftArg,
          titleArg,
          descriptionArg,
          startingBidMistArg, // starting_bid_mist in MIST units
          endTimeMsArg,
          nftNameArg,
          nftDescriptionArg,
          nftImageUrlArg,
          clockArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Auction created successfully!", result);
            toast.success("Auction created successfully!");

            // Log transaction details for debugging
            console.log("Transaction digest:", result.digest);
            
            // Reload page after successful auction creation
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          },
          onError: (error) => {
            console.error("Failed to create auction:", error);
            handleTransactionError(error);
          },
        },
      );
    } catch (error: any) {
      console.error("Error preparing transaction:", error);
      toast.error(
        `Failed to create auction: ${error.message || "Unknown error"}`,
      );
    }
  };

  // const verifyRegistry = async () => {
  //   const client = new SuiClient({ url: getFullnodeUrl("devnet") });
  //   try {
  //     const registryObject = await client.getObject({
  //       id: DEVNET_AUCTION_REGISTRY_ID,
  //       options: { showContent: true, showType: true, showOwner: true },
  //     });

  //     console.log(
  //       "Registry Object Data:",
  //       JSON.stringify(registryObject, null, 2),
  //     );

  //     if (
  //       registryObject.data?.content?.dataType === "moveObject" &&
  //       registryObject.data.content.fields
  //     ) {
  //       // Check if the 'auctions' field exists and its type (should be a Table ID)
  //       const auctionsField = (registryObject.data.content.fields as any)
  //         .auctions;
  //       console.log(auctionsField);
  //       if (auctionsField && typeof auctionsField === "string") {
  //         console.log("Found 'auctions' field with ID:", auctionsField);
  //         // Now, try to get dynamic fields from THIS ID, if `auctions` itself is a separate Table object
  //         // If `auctions` is an ID *of the table itself*, then your parentId should be `auctionsField`
  //         // If `auctions` is an inline field *containing* the table, then `DEVNET_AUCTION_REGISTRY_ID` is correct.
  //         // This depends on how your `AuctionRegistry` struct is defined.
  //         // Most likely, `auctions` is a Table<ID, bool> *within* the AuctionRegistry.
  //       } else {
  //         console.log("No 'auctions' field or it's not a direct ID.");
  //       }
  //     } else {
  //       console.log("Registry object content not found or not a Move object.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching registry object:", error);
  //   }
  // };

  const getAllAuctionsById = async () => {
    const client = new SuiClient({ url: getFullnodeUrl("devnet") });
    // verifyRegistry();
    try {
      const registryObjectResponse = await client.getObject({
        id: DEVNET_AUCTION_REGISTRY_ID,
        options: { showContent: true },
      });

      if (
        !registryObjectResponse.data ||
        registryObjectResponse.data.content?.dataType !== "moveObject" ||
        !registryObjectResponse.data.content.fields
      ) {
        console.error(
          "AuctionRegistry object not found or content not accessible.",
        );
        return [];
      }

      // Extract the ID of the inner table from the registry object's fields
      // This is the crucial change based on your discovery!
      const innerTableId = (registryObjectResponse.data.content.fields as any)
        .auctions.fields.id.id;

      if (!innerTableId) {
        console.error(
          'Could not find the ID of the inner "auctions" table within the registry.',
        );
        return [];
      }

      console.log("Found inner table ID:", innerTableId);

      const fieldsResponse = await client.getDynamicFields({
        parentId: innerTableId,
      });
      console.log(fieldsResponse);

      if (!fieldsResponse.data || fieldsResponse.data.length === 0) {
        console.log(fieldsResponse.data);
        console.log("No dynamic fields (auctions) found in the registry.");
        return [];
      }

      const auctionIds: string[] = [];
      for (const field of fieldsResponse.data) {
        if (typeof field.name.value === "string") {
          auctionIds.push(field.name.value);
        }
      }

      console.log("Discovered Auction IDs from registry table:", auctionIds);

      // 2. Fetch the actual Auction objects using their IDs
      if (auctionIds.length > 0) {
        const auctionObjects = await client.multiGetObjects({
          ids: auctionIds,
          options: {
            showContent: true, // To get the actual data fields of the Auction
            showType: true,
            showOwner: true,
          },
        });
        console.log("Fetched Auction Objects:", auctionObjects);
        return auctionObjects;
      }

      return [];
    } catch (error) {
      console.error("Error fetching auctions from registry table:", error);
      return [];
    }
  };

  const getAuctionDetailById = async (id: string) => {
    const client = new SuiClient({ url: getFullnodeUrl("devnet") });
    try {
      // First, try to fetch the auction as an active auction
      const response = await client.getObject({
        id: id,
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      });
      
      if (response?.data) {
        console.log("Found active auction:", response);
        return response;
      }
      
      // If not found as active auction, check if it's a completed auction
      // by looking it up in the auction histories table
      console.log("Auction not found as active, checking auction histories...");
      
      const registryObjectResponse = await client.getObject({
        id: DEVNET_AUCTION_REGISTRY_ID,
        options: { showContent: true },
      });

      if (
        !registryObjectResponse.data ||
        registryObjectResponse.data.content?.dataType !== "moveObject" ||
        !registryObjectResponse.data.content.fields
      ) {
        console.error("AuctionRegistry object not found or content not accessible.");
        return {};
      }

      // Extract the ID of the auction_histories table from the registry object's fields
      const historyTableId = (registryObjectResponse.data.content.fields as any)
        .auction_histories?.fields?.id?.id;

      if (!historyTableId) {
        console.log("No auction histories table found in registry.");
        return {};
      }

      console.log("Found auction histories table ID:", historyTableId);

      // Look for the specific auction ID in the histories table
      const fieldsResponse = await client.getDynamicFields({
        parentId: historyTableId,
      });

      if (!fieldsResponse.data || fieldsResponse.data.length === 0) {
        console.log("No auction histories found in the registry.");
        return {};
      }

      // Find the auction history entry for our specific auction ID
      let historyId = null;
      for (const field of fieldsResponse.data) {
        if (field.name.value === id) {
          // Get the actual history object ID from the field
          const historyFieldResponse = await client.getObject({
            id: field.objectId,
            options: { showContent: true },
          });
          
          if (historyFieldResponse.data?.content?.dataType === "moveObject") {
            const fieldContent = historyFieldResponse.data.content.fields as any;
            historyId = fieldContent.value;
            break;
          }
        }
      }

      if (!historyId) {
        console.log(`No auction history found for auction ID: ${id}`);
        return {};
      }

      console.log(`Found auction history ID: ${historyId} for auction: ${id}`);

      // Fetch the actual auction history object
      const historyResponse = await client.getObject({
        id: historyId,
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      });

      if (historyResponse?.data) {
        console.log("Found auction history:", historyResponse);
        // Add a flag to indicate this is historical data
        return {
          ...historyResponse,
          isHistory: true
        };
      }

      return {};
    } catch (error) {
      console.error("Error fetching auction/auction history:", error);
      return {};
    }
  };

  const getAllAuctionHistories = async () => {
    const client = new SuiClient({ url: getFullnodeUrl("devnet") });
    try {
      const registryObjectResponse = await client.getObject({
        id: DEVNET_AUCTION_REGISTRY_ID,
        options: { showContent: true },
      });

      if (
        !registryObjectResponse.data ||
        registryObjectResponse.data.content?.dataType !== "moveObject" ||
        !registryObjectResponse.data.content.fields
      ) {
        console.error(
          "AuctionRegistry object not found or content not accessible.",
        );
        return [];
      }

      // Extract the ID of the auction_histories table from the registry object's fields
      const historyTableId = (registryObjectResponse.data.content.fields as any)
        .auction_histories?.fields?.id?.id;

      if (!historyTableId) {
        console.log("No auction histories table found in registry.");
        return [];
      }

      console.log("Found auction histories table ID:", historyTableId);

      const fieldsResponse = await client.getDynamicFields({
        parentId: historyTableId,
      });

      if (!fieldsResponse.data || fieldsResponse.data.length === 0) {
        console.log("No auction histories found in the registry.");
        return [];
      }

      const historyIds: string[] = [];
      for (const field of fieldsResponse.data) {
        if (typeof field.objectId === "string") {
          historyIds.push(field.objectId);
        }
      }

      console.log("Discovered Auction History IDs:", historyIds);

      // Fetch the actual AuctionHistory objects using their IDs
      if (historyIds.length > 0) {
        const historyObjects = await client.multiGetObjects({
          ids: historyIds,
          options: {
            showContent: true,
            showType: true,
            showOwner: true,
          },
        });
        console.log("Fetched Auction History Objects:", historyObjects);
        return historyObjects;
      }

      return [];
    } catch (error) {
      console.error("Error fetching auction histories:", error);
      return [];
    }
  };

  const getAuctionHistoryById = async (id: string) => {
    const client = new SuiClient({ url: getFullnodeUrl("devnet") });
    try {
      const response = await client.getObject({
        id: id,
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      });
      if (response) {
        console.log("Auction History:", response);
        return response;
      }
      return {};
    } catch (error) {
      console.error("Error fetching auction history:", error);
      return {};
    }
  };

  return { 
    createAuction, 
    getAllAuctionsById, 
    getAuctionDetailById, 
    getAllAuctionHistories, 
    getAuctionHistoryById 
  };
};

const handleTransactionError = (error: any) => {
  console.error("Transaction error details:", error);

  const errorMessage = error.message || error.toString();

  if (errorMessage.includes("VMVerificationOrDeserializationError")) {
    toast.error(
      "Transaction verification failed. Please check that you own the NFT and try again.",
    );
  } else if (errorMessage.includes("InsufficientGas")) {
    toast.error("Insufficient gas. Please add more SUI to your wallet.");
  } else if (errorMessage.includes("ObjectNotFound")) {
    toast.error("NFT object not found. Please check the NFT ID.");
  } else if (errorMessage.includes("InvalidObjectType")) {
    toast.error("Invalid NFT type. Please ensure the object is a valid NFT.");
  } else if (errorMessage.includes("not owned by")) {
    toast.error("You don't own this NFT. You can only auction NFTs you own.");
  } else if (errorMessage.includes("Package object does not exist")) {
    toast.error(
      "Auction contract not found. Please ensure you're connected to the correct network.",
    );
  } else {
    toast.error(`Transaction failed: ${errorMessage}`);
  }
};
