import { Transaction } from "@mysten/sui/transactions";
import { getCurrentAuctionRegistry, getCurrentPackageId, SYSTEM_CLOCK_ID } from "../contants";
import { usePasskeyTransaction } from "./usePasskeyTransaction";
import { toast } from "react-toastify";

export const usePasskeyBidHook = () => {
  const { signAndExecuteTransaction, isAuthenticated } = usePasskeyTransaction();

  const placeBid = async (auctionId: string, bidAmount: number, nftType: string) => {
    if (!isAuthenticated) {
      toast.error('Please authenticate with passkey first');
      throw new Error('Passkey not authenticated');
    }

    console.log("🎯 === EXECUTING placeBid with Passkey ===");
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

        console.log("🚀 Calling passkey signAndExecuteTransaction...");
        console.log("🔄 Passkey authentication should appear now - waiting for user to sign...");

        // Execute transaction with passkey signing
        signAndExecuteTransaction(
          tx,
          {
            onSuccess: (result) => {
              console.log("✅ placeBid SUCCESS with Passkey:", result);
              console.log("📋 Transaction digest:", result.digest);
              console.log("📋 Transaction effects:", result.effects);
              
              toast.success(`Bid of ${bidAmount} SUI placed successfully with passkey!`);
              resolve(result);
            },
            onError: (error) => {
              console.error("❌ placeBid FAILED with Passkey:", error);
              console.error("❌ Error type:", typeof error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
              
              // Check if this is a user rejection
              const errorMessage = error?.message || error?.toString() || '';
              if (errorMessage.includes('rejected') || errorMessage.includes('cancelled') || errorMessage.includes('User rejected')) {
                console.log("🚫 User rejected the transaction in passkey");
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
        console.error("💥 Error preparing placeBid transaction with Passkey:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to place bid with passkey: ${errorMessage}`);
        reject(error);
      }
    });
  };

  const claimNft = async (auctionId: string, nftType: string) => {
    if (!isAuthenticated) {
      toast.error('Please authenticate with passkey first');
      throw new Error('Passkey not authenticated');
    }

    console.log("🎯 === EXECUTING claimNft with Passkey ===");
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

        console.log("🚀 Calling passkey signAndExecuteTransaction...");
        console.log("🔄 Passkey authentication should appear now - waiting for user to sign...");

        // Execute transaction with passkey signing
        signAndExecuteTransaction(
          tx,
          {
            onSuccess: (result) => {
              console.log("✅ claimNft SUCCESS with Passkey:", result);
              console.log("📋 Transaction digest:", result.digest);
              console.log("📋 Transaction effects:", result.effects);
              
              toast.success("NFT claimed successfully with passkey!");
              resolve(result);
            },
            onError: (error) => {
              console.error("❌ claimNft FAILED with Passkey:", error);
              console.error("❌ Error type:", typeof error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
              
              // Check if this is a user rejection
              const errorMessage = error?.message || error?.toString() || '';
              if (errorMessage.includes('rejected') || errorMessage.includes('cancelled') || errorMessage.includes('User rejected')) {
                console.log("🚫 User rejected the transaction in passkey");
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
        console.error("💥 Error preparing claimNft transaction with Passkey:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to claim NFT with passkey: ${errorMessage}`);
        reject(error);
      }
    });
  };

  const claimCreatorProceeds = async (auctionId: string, nftType: string) => {
    if (!isAuthenticated) {
      toast.error('Please authenticate with passkey first');
      throw new Error('Passkey not authenticated');
    }

    console.log("🎯 === EXECUTING claimCreatorProceeds with Passkey ===");
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

        console.log("🚀 Calling passkey signAndExecuteTransaction...");
        console.log("🔄 Passkey authentication should appear now - waiting for user to sign...");

        // Execute transaction with passkey signing
        signAndExecuteTransaction(
          tx,
          {
            onSuccess: (result) => {
              console.log("✅ claimCreatorProceeds SUCCESS with Passkey:", result);
              console.log("📋 Transaction digest:", result.digest);
              console.log("📋 Transaction effects:", result.effects);
              
              toast.success("Creator proceeds claimed successfully with passkey!");
              resolve(result);
            },
            onError: (error) => {
              console.error("❌ claimCreatorProceeds FAILED with Passkey:", error);
              console.error("❌ Error type:", typeof error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
              
              // Check if this is a user rejection
              const errorMessage = error?.message || error?.toString() || '';
              if (errorMessage.includes('rejected') || errorMessage.includes('cancelled') || errorMessage.includes('User rejected')) {
                console.log("🚫 User rejected the transaction in passkey");
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
        console.error("💥 Error preparing claimCreatorProceeds transaction with Passkey:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to claim creator proceeds with passkey: ${errorMessage}`);
        reject(error);
      }
    });
  };

  const cancelAuction = async (auctionId: string, nftType: string) => {
    if (!isAuthenticated) {
      toast.error('Please authenticate with passkey first');
      throw new Error('Passkey not authenticated');
    }

    console.log("🎯 === EXECUTING cancelAuction with Passkey ===");
    console.log("Auction ID:", auctionId);
    console.log("NFT Type:", nftType);
    console.log("Package ID:", getCurrentPackageId());
    console.log("Registry ID:", getCurrentAuctionRegistry());
    console.log("Clock ID:", SYSTEM_CLOCK_ID);
    
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

        console.log("🚀 Calling passkey signAndExecuteTransaction...");
        console.log("🔄 Passkey authentication should appear now - waiting for user to sign...");

        // Execute transaction with passkey signing
        signAndExecuteTransaction(
          tx,
          {
            onSuccess: (result) => {
              console.log("✅ cancelAuction SUCCESS with Passkey:", result);
              console.log("📋 Transaction digest:", result.digest);
              console.log("📋 Transaction effects:", result.effects);
              
              toast.success("Auction cancelled successfully with passkey!");
              resolve(result);
            },
            onError: (error) => {
              console.error("❌ cancelAuction FAILED with Passkey:", error);
              console.error("❌ Error type:", typeof error);
              console.error("❌ Error details:", JSON.stringify(error, null, 2));
              
              // Check if this is a user rejection
              const errorMessage = error?.message || error?.toString() || '';
              if (errorMessage.includes('rejected') || errorMessage.includes('cancelled') || errorMessage.includes('User rejected')) {
                console.log("🚫 User rejected the transaction in passkey");
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
        console.error("💥 Error preparing cancelAuction transaction with Passkey:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to cancel auction with passkey: ${errorMessage}`);
        reject(error);
      }
    });
  };

  const handleBidError = (error: any) => {
    console.error("💥 Bid error details:", error);
    
    // Extract error message
    let errorMessage = "Failed to place bid";
    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // Check for specific error types
    if (errorMessage.includes('insufficient balance')) {
      toast.error("Insufficient balance to place bid");
    } else if (errorMessage.includes('auction not found')) {
      toast.error("Auction not found or already ended");
    } else if (errorMessage.includes('bid too low')) {
      toast.error("Bid amount is too low");
    } else if (errorMessage.includes('already highest bidder')) {
      toast.error("You are already the highest bidder");
    } else {
      toast.error(`Bid failed: ${errorMessage}`);
    }
  };

  const handleCancelError = (error: any) => {
    console.error("💥 Cancel auction error details:", error);
    
    // Extract error message
    let errorMessage = "Failed to cancel auction";
    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // Check for specific error types
    if (errorMessage.includes('not auction creator')) {
      toast.error("Only the auction creator can cancel the auction");
    } else if (errorMessage.includes('auction already ended')) {
      toast.error("Cannot cancel an auction that has already ended");
    } else if (errorMessage.includes('bids already placed')) {
      toast.error("Cannot cancel auction with existing bids");
    } else {
      toast.error(`Cancel auction failed: ${errorMessage}`);
    }
  };

  return {
    placeBid,
    claimNft,
    claimCreatorProceeds,
    cancelAuction,
    isAuthenticated,
  };
}; 