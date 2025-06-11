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
      const startingBidMist = Math.floor(auction.startingBid * 1_000_000_000);

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

  const getAllAuctionsById = async () => {
    const client = new SuiClient({ url: getFullnodeUrl("devnet") });
    try {
      const fieldsResponse = await client.getDynamicFields({
        parentId: DEVNET_AUCTION_REGISTRY_ID,
      });

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

  return { createAuction, getAllAuctionsById };
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
