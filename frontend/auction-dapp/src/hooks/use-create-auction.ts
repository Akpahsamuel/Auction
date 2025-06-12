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

      console.log("NFT Type discovered:", nftType);
      console.log("NFT Owner:", nftObject.data.owner);

      // Convert starting bid from SUI to MIST (1 SUI = 1,000,000,000 MIST)
      const startingBidMist = Math.floor(auction.startingBid * 1);

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
      const startingBidArg = tx.pure.u64(startingBidMist);
      const durationMsArg = tx.pure.u64(auction.durationMs);
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
          startingBidArg,
          durationMsArg,
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
      const response = await client.getObject({
        id: id,
        options: {
          showContent: true,
          showType: true,
          showOwner: true,
        },
      });
      if (response) {
        console.log(response);
        return response;
      }
      return {};
    } catch (error) {
      console.error("Error fetching auctions from registry table:", error);
      return {};
    }
  };

  return { createAuction, getAllAuctionsById, getAuctionDetailById };
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
