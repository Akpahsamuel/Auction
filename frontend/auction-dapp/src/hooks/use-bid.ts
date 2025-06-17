import { Transaction } from "@mysten/sui/transactions";
import { DEVNET_PACKAGE_ID } from "../contants";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { toast } from "react-toastify";

export const useBidHook = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const placeBid = async (auctionId: string, bidAmount: number, nftType: string) => {
    try {
      // Create a new transaction for each bid
      const tx = new Transaction();

      // Initialize Sui client for devnet
      const client = new SuiClient({ url: getFullnodeUrl("devnet") });

      // The contract only supports whole SUI amounts due to its design
      // bid_amount parameter is u64 expecting SUI units, then multiplied by MIST_PER_SUI internally
      const bidAmountSui = Math.floor(bidAmount); // Must be whole SUI
      
      if (bidAmountSui !== bidAmount) {
        toast.warning(`Bid rounded down to ${bidAmountSui} SUI (contract only supports whole SUI amounts)`);
      }

      // Convert to MIST for the payment coin (1 SUI = 1,000,000,000 MIST)
      const bidAmountMist = bidAmountSui * 1_000_000_000;

      // Prepare move call arguments
      const auctionArg = tx.object(auctionId);
      const bidAmountArg = tx.pure.u64(bidAmountSui); // Pass in SUI units (contract will multiply by MIST_PER_SUI)
      const clockArg = tx.object("0x6"); // System clock object

      // Split coins for the bid amount (this needs to be in MIST)
      const [bidCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(bidAmountMist)]);

      // Call the generic place_bid function with proper type argument
      tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::auction_house::place_bid`,
        typeArguments: [nftType], // Pass the NFT type
        arguments: [
          auctionArg,
          bidAmountArg, // bid_amount in SUI units (u64)
          bidCoin,      // bid_payment in MIST
          clockArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Bid placed successfully!", result);
            toast.success(`Bid of ${bidAmountSui} SUI placed successfully!`);

            // Log transaction details for debugging
            console.log("Transaction digest:", result.digest);
          },
          onError: (error) => {
            console.error("Failed to place bid:", error);
            handleBidError(error);
          },
        },
      );
    } catch (error: any) {
      console.error("Error preparing bid transaction:", error);
      toast.error(
        `Failed to place bid: ${error.message || "Unknown error"}`,
      );
    }
  };

  const claimNft = async (auctionId: string, nftType: string) => {
    try {
      // Create a new transaction for claiming NFT
      const tx = new Transaction();

      // Prepare move call arguments
      const auctionArg = tx.object(auctionId);
      const clockArg = tx.object("0x6"); // System clock object

      // Call the generic claim_nft function with proper type argument
      tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::auction_house::claim_nft`,
        typeArguments: [nftType], // Pass the NFT type
        arguments: [
          auctionArg,
          clockArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("NFT claimed successfully!", result);
            toast.success("NFT claimed successfully!");

            // Log transaction details for debugging
            console.log("Transaction digest:", result.digest);
          },
          onError: (error) => {
            console.error("Failed to claim NFT:", error);
            handleBidError(error);
          },
        },
      );
    } catch (error: any) {
      console.error("Error preparing claim transaction:", error);
      toast.error(
        `Failed to claim NFT: ${error.message || "Unknown error"}`,
      );
    }
  };

  const claimCreatorProceeds = async (auctionId: string, nftType: string) => {
    try {
      // Create a new transaction for claiming creator proceeds
      const tx = new Transaction();

      // Prepare move call arguments
      const auctionArg = tx.object(auctionId);
      const clockArg = tx.object("0x6"); // System clock object

      // Call the generic claim_creator_proceeds function with proper type argument
      tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::auction_house::claim_creator_proceeds`,
        typeArguments: [nftType], // Pass the NFT type
        arguments: [
          auctionArg,
          clockArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Creator proceeds claimed successfully!", result);
            toast.success("Creator proceeds claimed successfully!");

            // Log transaction details for debugging
            console.log("Transaction digest:", result.digest);
          },
          onError: (error) => {
            console.error("Failed to claim creator proceeds:", error);
            handleBidError(error);
          },
        },
      );
    } catch (error: any) {
      console.error("Error preparing claim creator proceeds transaction:", error);
      toast.error(
        `Failed to claim creator proceeds: ${error.message || "Unknown error"}`,
      );
    }
  };

  return { placeBid, claimNft, claimCreatorProceeds };
};

const handleBidError = (error: any) => {
  console.error("Bid transaction error details:", error);

  const errorMessage = error.message || error.toString();

  if (errorMessage.includes("EAuctionEnded")) {
    toast.error("This auction has already ended. You cannot place more bids.");
  } else if (errorMessage.includes("EBidTooLow")) {
    toast.error("Your bid is too low. Please increase your bid amount.");
  } else if (errorMessage.includes("ESelfBidding")) {
    toast.error("You cannot bid on your own auction.");
  } else if (errorMessage.includes("EAuctionNotEnded")) {
    toast.error("This auction has not ended yet. You cannot claim the NFT.");
  } else if (errorMessage.includes("ENotWinner")) {
    toast.error("You are not the winner of this auction.");
  } else if (errorMessage.includes("ENotCreator")) {
    toast.error("You are not the creator of this auction.");
  } else if (errorMessage.includes("EGracePeriodNotPassed")) {
    toast.error("Grace period has not passed yet. Please wait before claiming proceeds.");
  } else if (errorMessage.includes("InsufficientGas")) {
    toast.error("Insufficient gas. Please add more SUI to your wallet.");
  } else if (errorMessage.includes("InsufficientBalance")) {
    toast.error("Insufficient balance. Please add more SUI to your wallet.");
  } else {
    toast.error(`Transaction failed: ${errorMessage}`);
  }
}; 