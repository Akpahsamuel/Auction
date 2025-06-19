import { Transaction } from "@mysten/sui/transactions";
import { getCurrentAuctionRegistry, getCurrentPackageId, SYSTEM_CLOCK_ID } from "../contants";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { toast } from "react-toastify";

export const useBidHook = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const placeBid = async (auctionId: string, bidAmount: number, nftType: string) => {
    console.log("🎯 === EXECUTING placeBid ===");
    console.log("Auction ID:", auctionId);
    console.log("Bid Amount:", bidAmount, "SUI");
    console.log("NFT Type:", nftType);
    console.log("Package ID:", getCurrentPackageId());
    console.log("Clock ID:", SYSTEM_CLOCK_ID);
    
    return new Promise((resolve, reject) => {
      try {
        // Create a new transaction for each bid
        const tx = new Transaction();

        // Set gas budget for the transaction
        tx.setGasBudget(10000000); // 0.01 SUI in MIST

        // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
        // This allows decimal bids like 1.5 SUI = 1,500,000,000 MIST
        const bidAmountMist = Math.floor(bidAmount * 1_000_000_000);
        
        console.log(`Bidding ${bidAmount} SUI (${bidAmountMist} MIST)`);

        // Validate required parameters
        if (!auctionId || !nftType || bidAmountMist <= 0) {
          throw new Error("Missing required parameters: auctionId, nftType, or invalid bid amount");
        }

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

        console.log("📝 Transaction prepared successfully");
        console.log("📝 Transaction details:", {
          target: `${getCurrentPackageId()}::auction_house::place_bid`,
          typeArguments: [nftType],
          bidAmountSUI: bidAmount,
          bidAmountMist: bidAmountMist,
        });

        console.log("🚀 Calling signAndExecuteTransaction...");
        console.log("🔄 Wallet popup should appear now - waiting for user to sign...");

        // Execute transaction with proper error handling
        signAndExecuteTransaction(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("✅ placeBid SUCCESS:", result);
              console.log("📋 Transaction digest:", result.digest);
              console.log("📋 Transaction effects:", result.effects);
              
              toast.success(`Bid of ${bidAmount} SUI placed successfully!`);
              resolve(result);
            },
            onError: (error) => {
              console.error("❌ placeBid FAILED:", error);
              console.error("❌ Error type:", typeof error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
              
              // Check if this is a user rejection
              const errorMessage = error?.message || error?.toString() || '';
              if (errorMessage.includes('rejected') || errorMessage.includes('cancelled') || errorMessage.includes('User rejected')) {
                console.log("🚫 User rejected the transaction in wallet");
                toast.info("Transaction was cancelled by user");
              } else {
                console.log("💥 Transaction failed for other reason");
                handleBidError(error);
              }
              reject(error);
            },
          },
        );
      } catch (error) {
        console.error("💥 Error preparing placeBid transaction:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to place bid: ${errorMessage}`);
        reject(error);
      }
    });
  };

  const claimNft = async (auctionId: string, nftType: string) => {
    console.log("🎯 === EXECUTING claimNft ===");
    console.log("Auction ID:", auctionId);
    console.log("NFT Type:", nftType);
    console.log("Package ID:", getCurrentPackageId());
    console.log("Registry ID:", getCurrentAuctionRegistry());
    console.log("Clock ID:", SYSTEM_CLOCK_ID);
    
    return new Promise((resolve, reject) => {
      try {
        // Create a new transaction for claiming NFT
        const tx = new Transaction();

        // Set gas budget for the transaction
        tx.setGasBudget(10000000); // 0.01 SUI in MIST

        // Validate required parameters
        if (!auctionId || !nftType) {
          throw new Error("Missing required parameters: auctionId or nftType");
        }

        // Prepare move call arguments
        const auctionArg = tx.object(auctionId);
        const registryArg = tx.object(getCurrentAuctionRegistry());
        const clockArg = tx.object(SYSTEM_CLOCK_ID);

        // Call the generic claim_nft function with proper type argument
        tx.moveCall({
          target: `${getCurrentPackageId()}::auction_house::claim_nft`,
          typeArguments: [nftType],
          arguments: [
            auctionArg,
            registryArg,
            clockArg,
          ],
        });

        console.log("📝 Transaction prepared successfully");
        console.log("📝 Transaction details:", {
          target: `${getCurrentPackageId()}::auction_house::claim_nft`,
          typeArguments: [nftType],
        });

        console.log("🚀 Calling signAndExecuteTransaction...");
        console.log("🔄 Wallet popup should appear now - waiting for user to sign...");

        // Execute transaction with proper error handling
        signAndExecuteTransaction(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("✅ claimNft SUCCESS:", result);
              console.log("📋 Transaction digest:", result.digest);
              console.log("📋 Transaction effects:", result.effects);
              
              toast.success("NFT claimed successfully!");
              resolve(result);
            },
            onError: (error) => {
              console.error("❌ claimNft FAILED:", error);
              console.error("❌ Error type:", typeof error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
              
              // Check if this is a user rejection
              const errorMessage = error?.message || error?.toString() || '';
              if (errorMessage.includes('rejected') || errorMessage.includes('cancelled') || errorMessage.includes('User rejected')) {
                console.log("🚫 User rejected the transaction in wallet");
                toast.info("Transaction was cancelled by user");
              } else {
                console.log("💥 Transaction failed for other reason");
                handleBidError(error);
              }
              reject(error);
            },
          },
        );
      } catch (error) {
        console.error("💥 Error preparing claimNft transaction:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to claim NFT: ${errorMessage}`);
        reject(error);
      }
    });
  };

  const claimNftAfterCreatorClaim = async (auctionId: string, nftType: string) => {
    console.log("🎯 === EXECUTING claimNftAfterCreatorClaim ===");
    console.log("Auction ID:", auctionId);
    console.log("NFT Type:", nftType);
    console.log("Package ID:", getCurrentPackageId());
    console.log("Registry ID:", getCurrentAuctionRegistry());
    console.log("Clock ID:", SYSTEM_CLOCK_ID);
    
    return new Promise((resolve, reject) => {
      try {
        // Create a new transaction for claiming NFT after creator has claimed proceeds
        const tx = new Transaction();

        // Set gas budget for the transaction
        tx.setGasBudget(10000000); // 0.01 SUI in MIST

        // Validate required parameters
        if (!auctionId || !nftType) {
          throw new Error("Missing required parameters: auctionId or nftType");
        }

        // Prepare move call arguments
        const auctionArg = tx.object(auctionId);
        const registryArg = tx.object(getCurrentAuctionRegistry());
        const clockArg = tx.object(SYSTEM_CLOCK_ID);

        // Call the generic claim_nft_after_creator_claim function with proper type argument
        tx.moveCall({
          target: `${getCurrentPackageId()}::auction_house::claim_nft_after_creator_claim`,
          typeArguments: [nftType],
          arguments: [
            auctionArg,
            registryArg,
            clockArg,
          ],
        });

        console.log("📝 Transaction prepared successfully");
        console.log("📝 Transaction details:", {
          target: `${getCurrentPackageId()}::auction_house::claim_nft_after_creator_claim`,
          typeArguments: [nftType],
        });

        console.log("🚀 Calling signAndExecuteTransaction...");
        console.log("🔄 Wallet popup should appear now - waiting for user to sign...");

        // Execute transaction with proper error handling
        signAndExecuteTransaction(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("✅ claimNftAfterCreatorClaim SUCCESS:", result);
              console.log("📋 Transaction digest:", result.digest);
              console.log("📋 Transaction effects:", result.effects);
              
              toast.success("NFT claimed successfully!");
              resolve(result);
            },
            onError: (error) => {
              console.error("❌ claimNftAfterCreatorClaim FAILED:", error);
              console.error("❌ Error type:", typeof error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
              
              // Check if this is a user rejection
              const errorMessage = error?.message || error?.toString() || '';
              if (errorMessage.includes('rejected') || errorMessage.includes('cancelled') || errorMessage.includes('User rejected')) {
                console.log("🚫 User rejected the transaction in wallet");
                toast.info("Transaction was cancelled by user");
              } else {
                console.log("💥 Transaction failed for other reason");
                handleBidError(error);
              }
              reject(error);
            },
          },
        );
      } catch (error) {
        console.error("💥 Error preparing claimNftAfterCreatorClaim transaction:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to claim NFT: ${errorMessage}`);
        reject(error);
      }
    });
  };

  const claimCreatorProceeds = async (auctionId: string, nftType: string) => {
    console.log("🎯 === EXECUTING claimCreatorProceeds ===");
    console.log("Auction ID:", auctionId);
    console.log("NFT Type:", nftType);
    console.log("Package ID:", getCurrentPackageId());
    console.log("Registry ID:", getCurrentAuctionRegistry());
    console.log("Clock ID:", SYSTEM_CLOCK_ID);
    
    return new Promise((resolve, reject) => {
      try {
        // Create a new transaction for claiming creator proceeds
        const tx = new Transaction();

        // Set gas budget for the transaction
        tx.setGasBudget(10000000); // 0.01 SUI in MIST

        // Validate required parameters
        if (!auctionId || !nftType) {
          throw new Error("Missing required parameters: auctionId or nftType");
        }

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

        console.log("📝 Transaction prepared successfully");
        console.log("📝 Transaction details:", {
          target: `${getCurrentPackageId()}::auction_house::claim_creator_proceeds`,
          typeArguments: [nftType],
        });

        console.log("🚀 Calling signAndExecuteTransaction...");
        console.log("🔄 Wallet popup should appear now - waiting for user to sign...");

        // Execute transaction with proper error handling
        signAndExecuteTransaction(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("✅ claimCreatorProceeds SUCCESS:", result);
              console.log("📋 Transaction digest:", result.digest);
              console.log("📋 Transaction effects:", result.effects);
              
              toast.success("Creator proceeds claimed successfully!");
              resolve(result);
            },
            onError: (error) => {
              console.error("❌ claimCreatorProceeds FAILED:", error);
              console.error("❌ Error type:", typeof error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
              
              // Check if this is a user rejection
              const errorMessage = error?.message || error?.toString() || '';
              if (errorMessage.includes('rejected') || errorMessage.includes('cancelled') || errorMessage.includes('User rejected')) {
                console.log("🚫 User rejected the transaction in wallet");
                toast.info("Transaction was cancelled by user");
              } else {
                console.log("💥 Transaction failed for other reason");
                handleBidError(error);
              }
              reject(error);
            },
          },
        );
      } catch (error) {
        console.error("💥 Error preparing claimCreatorProceeds transaction:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to claim creator proceeds: ${errorMessage}`);
        reject(error);
      }
    });
  };

  const cancelAuction = async (auctionId: string, nftType: string) => {
    console.log("🎯 === EXECUTING cancelAuction ===");
    console.log("Auction ID:", auctionId);
    console.log("NFT Type:", nftType);
    console.log("Package ID:", getCurrentPackageId());
    console.log("Registry ID:", getCurrentAuctionRegistry());
    
    return new Promise((resolve, reject) => {
      try {
        // Create a new transaction for canceling auction
        const tx = new Transaction();

        // Set gas budget for the transaction
        tx.setGasBudget(10000000); // 0.01 SUI in MIST

        // Validate required parameters
        if (!auctionId || !nftType) {
          throw new Error("Missing required parameters: auctionId or nftType");
        }

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

        console.log("📝 Transaction prepared successfully");
        console.log("📝 Transaction details:", {
          target: `${getCurrentPackageId()}::auction_house::cancel_auction`,
          typeArguments: [nftType],
        });

        console.log("🚀 Calling signAndExecuteTransaction...");
        console.log("🔄 Wallet popup should appear now - waiting for user to sign...");

        // Execute transaction with proper error handling
        signAndExecuteTransaction(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("✅ cancelAuction SUCCESS:", result);
              console.log("📋 Transaction digest:", result.digest);
              console.log("📋 Transaction effects:", result.effects);
              
              toast.success("Auction canceled successfully! Your NFT has been returned.");
              resolve(result);
            },
            onError: (error) => {
              console.error("❌ cancelAuction FAILED:", error);
              console.error("❌ Error type:", typeof error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
              
              // Check if this is a user rejection
              const errorMessage = error?.message || error?.toString() || '';
              if (errorMessage.includes('rejected') || errorMessage.includes('cancelled') || errorMessage.includes('User rejected')) {
                console.log("🚫 User rejected the transaction in wallet");
                toast.info("Transaction was cancelled by user");
              } else {
                console.log("💥 Transaction failed for other reason");
                handleCancelError(error);
              }
              reject(error);
            },
          },
        );
      } catch (error) {
        console.error("💥 Error preparing cancelAuction transaction:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to cancel auction: ${errorMessage}`);
        reject(error);
      }
    });
  };

  return { placeBid, claimNft, claimNftAfterCreatorClaim, claimCreatorProceeds, cancelAuction };
};

const handleBidError = (error: any) => {
  console.error("💥 Bid transaction error details:", error);
  
  // Enhanced error logging
  console.error("Error type:", typeof error);
  console.error("Error constructor:", error?.constructor?.name);
  console.error("Error as JSON:", JSON.stringify(error, null, 2));
  
  // Try to extract more detailed error information
  let errorDetails = "";
  if (error?.cause) {
    console.error("Error cause:", error.cause);
    errorDetails += ` Cause: ${error.cause}`;
  }
  if (error?.code) {
    console.error("Error code:", error.code);
    errorDetails += ` Code: ${error.code}`;
  }
  if (error?.transaction) {
    console.error("Error transaction:", error.transaction);
  }

  const errorMessage = error.message || error.toString();
  console.error("Extracted error message:", errorMessage);

  // Enhanced error pattern matching
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
  } else if (errorMessage.includes("EAuctionStillActive") || errorMessage.includes("abort(4)") || errorMessage.includes("4")) {
    // Error code 4 = EAuctionStillActive - this is the main issue we're fixing
    console.error("🚨 EAuctionStillActive detected - possible status/method mismatch");
    toast.error("CLAIM ERROR: Wrong claiming method used for auction status. This indicates a status detection issue. Check console for details.");
  } else if (errorMessage.includes("ENotHighestBidder") || errorMessage.includes("abort(10)") || errorMessage.includes("10")) {
    toast.error("You are not the highest bidder and cannot claim this NFT.");
  } else if (errorMessage.includes("ENotAuctionCreator") || errorMessage.includes("abort(3)") || errorMessage.includes("3")) {
    toast.error("Only the auction creator can perform this action.");
  } else if (errorMessage.includes("Insufficient gas") || errorMessage.includes("InsufficientGas")) {
    toast.error("Insufficient gas to complete transaction. Please ensure you have enough SUI for gas fees.");
  } else if (errorMessage.includes("ObjectNotFound")) {
    toast.error("Auction not found. It may have been completed or cancelled.");
  } else if (errorMessage.includes("aborted") || errorMessage.includes("rejected") || errorMessage.includes("cancelled")) {
    toast.error("Transaction was cancelled or failed. Please try again.");
  } else if (errorMessage.includes("User rejected")) {
    toast.error("Transaction was rejected by user.");
  } else {
    // For debugging: show more detailed error message
    console.error("🔍 Unhandled error pattern. Full error object:", error);
    const shortMessage = errorMessage.length > 150 ? errorMessage.substring(0, 150) + "..." : errorMessage;
    toast.error(`Transaction failed: ${shortMessage}${errorDetails}`);
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