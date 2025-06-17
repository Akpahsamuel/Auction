import { Transaction } from "@mysten/sui/transactions";
import { getCurrentAuctionRegistry, getCurrentPackageId, SYSTEM_CLOCK_ID } from "../contants";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { toast } from "react-toastify";

export const useBidHook = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const placeBid = async (auctionId: string, bidAmount: number, nftType: string) => {
    try {
      // Create a new transaction for each bid
      const tx = new Transaction();

      // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
      // This allows decimal bids like 1.5 SUI = 1,500,000,000 MIST
      const bidAmountMist = Math.floor(bidAmount * 1_000_000_000);
      
      console.log(`Bidding ${bidAmount} SUI (${bidAmountMist} MIST)`);

      // Prepare move call arguments
      const auctionArg = tx.object(auctionId);
      const bidAmountMistArg = tx.pure.u64(bidAmountMist); // Pass MIST directly to contract
      const clockArg = tx.object(SYSTEM_CLOCK_ID); // System clock object

      // Split coins for the bid amount (payment in MIST)
      const [bidCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(bidAmountMist)]);

      // Call the generic place_bid function with proper type argument
      tx.moveCall({
        target: `${getCurrentPackageId()}::auction_house::place_bid`,
        typeArguments: [nftType], // Pass the NFT type
        arguments: [
          auctionArg,
          bidAmountMistArg, // bid_amount_mist in MIST units (u64)
          bidCoin,          // bid_payment in MIST
          clockArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Bid placed successfully!", result);
            toast.success(`Bid of ${bidAmount} SUI placed successfully!`);

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
      const registryArg = tx.object(getCurrentAuctionRegistry());
      const clockArg = tx.object(SYSTEM_CLOCK_ID); // System clock object

      // Call the generic claim_nft function with proper type argument
      tx.moveCall({
        target: `${getCurrentPackageId()}::auction_house::claim_nft`,
        typeArguments: [nftType], // Pass the NFT type
        arguments: [
          auctionArg,
          registryArg,
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

  const claimNftAfterCreatorClaim = async (auctionId: string, nftType: string) => {
    try {
      // Create a new transaction for claiming NFT after creator has claimed proceeds
      const tx = new Transaction();

      // Prepare move call arguments
      const auctionArg = tx.object(auctionId);
      const registryArg = tx.object(getCurrentAuctionRegistry());
      const clockArg = tx.object(SYSTEM_CLOCK_ID); // System clock object

      // Call the generic claim_nft_after_creator_claim function with proper type argument
      tx.moveCall({
        target: `${getCurrentPackageId()}::auction_house::claim_nft_after_creator_claim`,
        typeArguments: [nftType], // Pass the NFT type
        arguments: [
          auctionArg,
          registryArg,
          clockArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("NFT claimed successfully after creator claim!", result);
            toast.success("NFT claimed successfully!");

            // Log transaction details for debugging
            console.log("Transaction digest:", result.digest);
          },
          onError: (error) => {
            console.error("Failed to claim NFT after creator claim:", error);
            handleBidError(error);
          },
        },
      );
    } catch (error: any) {
      console.error("Error preparing claim NFT after creator claim transaction:", error);
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
      const registryArg = tx.object(getCurrentAuctionRegistry());
      const clockArg = tx.object(SYSTEM_CLOCK_ID); // System clock object

      // Call the generic claim_creator_proceeds function with proper type argument
      tx.moveCall({
        target: `${getCurrentPackageId()}::auction_house::claim_creator_proceeds`,
        typeArguments: [nftType], // Pass the NFT type
        arguments: [
          auctionArg,
          registryArg,
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

  const cancelAuction = async (auctionId: string, nftType: string) => {
    try {
      // Create a new transaction for canceling auction
      const tx = new Transaction();

      // Prepare move call arguments
      const auctionArg = tx.object(auctionId);
      const registryArg = tx.object(getCurrentAuctionRegistry());

      // Call the generic cancel_auction function with proper type argument
      tx.moveCall({
        target: `${getCurrentPackageId()}::auction_house::cancel_auction`,
        typeArguments: [nftType], // Pass the NFT type
        arguments: [
          auctionArg,
          registryArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Auction canceled successfully!", result);
            toast.success("Auction canceled successfully! Your NFT has been returned.");

            // Log transaction details for debugging
            console.log("Transaction digest:", result.digest);
          },
          onError: (error) => {
            console.error("Failed to cancel auction:", error);
            handleCancelError(error);
          },
        },
      );
    } catch (error: any) {
      console.error("Error preparing cancel auction transaction:", error);
      toast.error(
        `Failed to cancel auction: ${error.message || "Unknown error"}`,
      );
    }
  };

  return { placeBid, claimNft, claimNftAfterCreatorClaim, claimCreatorProceeds, cancelAuction };
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

const handleCancelError = (error: any) => {
  console.error("Cancel auction error details:", error);

  const errorMessage = error.message || error.toString();

  if (errorMessage.includes("ENotAuctionCreator")) {
    toast.error("Only the auction creator can cancel this auction.");
  } else if (errorMessage.includes("EBidTooLow")) {
    // Contract reuses this error code for "auction has bids" in cancel function
    toast.error("Cannot cancel auction: bids have already been placed.");
  } else if (errorMessage.includes("InsufficientGas")) {
    toast.error("Insufficient gas. Please add more SUI to your wallet.");
  } else if (errorMessage.includes("ObjectNotFound")) {
    toast.error("Auction not found. It may have already been canceled or completed.");
  } else {
    toast.error(`Failed to cancel auction: ${errorMessage}`);
  }
};