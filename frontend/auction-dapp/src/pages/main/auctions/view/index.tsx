import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuctionHook } from "../../../../hooks/use-create-auction";
import { useBidHook } from "../../../../hooks/use-bid";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Clock, Trophy, Gavel, AlertCircle, Coins, User, Calendar, Hash, X, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import { formatMistAsSui } from "../../../../utils/currency";

const Index = () => {
  const { id } = useParams();
  const [auctionData, setAuctionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const { getAuctionDetailById } = useAuctionHook();
  const { placeBid, claimNft, claimNftAfterCreatorClaim, claimCreatorProceeds, cancelAuction } = useBidHook();
  const currentAccount = useCurrentAccount();

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Reloading page...");
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  useEffect(() => {
    const fetchAuctionDetail = async () => {
      if (id) {
        setLoading(true);
        const data = await getAuctionDetailById(id);
        setAuctionData(data);
        setLoading(false);
      }
    };

    fetchAuctionDetail();
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    if (!auctionData?.data?.content?.fields?.end_time) return;

    const endTime = parseInt(auctionData.data.content.fields.end_time);
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionData]);

  const handlePlaceBid = async () => {
    if (!bidAmount || !auctionData || !id) {
      toast.error("Missing required data for placing bid");
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    // Validate minimum bid
    const minimumBid = parseFloat(getMinimumBid());
    if (bidValue < minimumBid) {
      toast.error(`Bid must be at least ${minimumBid} SUI`);
      return;
    }

    // Check if user has enough balance (rough estimate)
    if (bidValue > 1000) { // Simple sanity check
      const confirmed = window.confirm(`You are about to bid ${bidValue} SUI. Are you sure?`);
      if (!confirmed) return;
    }

    setIsPlacingBid(true);
    try {
      const nftType = extractNftType(auctionData);
      if (!nftType) {
        throw new Error("Could not determine NFT type for bidding");
      }
      
      await placeBid(id, bidValue, nftType);
      setBidAmount("");
      
      // Reload page after successful bid
      toast.success(`Bid of ${bidValue} SUI placed successfully!`);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to place bid:", error);
      toast.error(`Failed to place bid: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleClaimNft = async () => {
    console.log("🚀 === STARTING NFT CLAIM PROCESS ===");
    
    // Step 1: Comprehensive validation
    const validation = validateClaimConditions();
    
    if (!validation.canClaim) {
      console.log("❌ Claim validation failed:", validation.reason);
      toast.error(`Cannot claim NFT: ${validation.reason}`);
      return;
    }

    console.log("✅ Claim validation passed:", validation.reason);
    console.log("🎯 Will use method:", validation.method);

    setIsClaiming(true);
    
    try {
      // Step 2: Extract NFT type
      const nftType = extractNftType(auctionData);
      if (!nftType) {
        throw new Error("Could not determine NFT type for claiming");
      }
      
      console.log("🏷️ NFT Type extracted:", nftType);
      
      // Step 3: Execute the appropriate claim function
      console.log(`🔄 Executing ${validation.method}...`);
      
      let result;
      if (validation.method === "claimNftAfterCreatorClaim") {
        result = await claimNftAfterCreatorClaim(id!, nftType);
      } else {
        result = await claimNft(id!, nftType);
      }
      
      // Step 4: Success handling
      console.log("🎉 NFT claim transaction completed successfully!", result);
      console.log("🔗 Transaction result:", result);
      
      // Toast already shown in the hook, so don't duplicate
      // Wait a bit then reload page to see updated state
      setTimeout(() => {
        console.log("🔄 Reloading page to reflect changes...");
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("💥 Failed to claim NFT:", error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      // Check for specific error patterns - only show toast if not already shown by hook
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("User rejected") || errorMessage.includes("rejected")) {
        console.log("🚫 User rejected the transaction");
        // Don't show error toast for user rejections
      } else if (errorMessage.includes("EAuctionStillActive") || errorMessage.includes("4")) {
        console.error("🚨 EAuctionStillActive error detected - wrong claim method used");
        // Error already handled in hook
      } else if (!errorMessage.includes("Failed to claim NFT")) {
        // Only show error if it wasn't already handled by the hook
        toast.error(`Unexpected error: ${errorMessage}`);
      }
      
    } finally {
      setIsClaiming(false);
      console.log("🏁 === NFT CLAIM PROCESS COMPLETED ===");
    }
  };

  const handleClaimCreatorProceeds = async () => {
    if (!auctionData || !id) {
      toast.error("Missing auction data for claiming proceeds");
      return;
    }

    if (!isCurrentUserCreator()) {
      toast.error("Only the auction creator can claim proceeds");
      return;
    }

    if (!isAuctionEnded()) {
      toast.error("Cannot claim proceeds: auction has not ended yet");
      return;
    }

    setIsClaiming(true);
    try {
      const nftType = extractNftType(auctionData);
      if (!nftType) {
        throw new Error("Could not determine NFT type for claiming proceeds");
      }
      
      await claimCreatorProceeds(id, nftType);
      
      // Reload page after successful claim
      toast.success("Proceeds claimed successfully!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to claim proceeds:", error);
      toast.error(`Failed to claim proceeds: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleCancelAuction = async () => {
    if (!auctionData || !id) return;

    // Confirm cancellation
    const confirmed = window.confirm(
      "Are you sure you want to cancel this auction? This action cannot be undone and your NFT will be returned to you."
    );
    
    if (!confirmed) return;

    setIsCanceling(true);
    try {
      const nftType = extractNftType(auctionData);
      await cancelAuction(id, nftType);
      
      toast.success("Auction cancelled successfully!");
      
      // Note: After successful cancellation, the auction object is destroyed,
      // so we redirect the user after a short delay to show the success message
      setTimeout(() => {
        window.location.href = '/auctions'; // Redirect to auctions list
      }, 2000);
    } catch (error) {
      console.error("Failed to cancel auction:", error);
      toast.error(`Failed to cancel auction: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsCanceling(false);
    }
  };

  const extractNftType = (auction: any) => {
    if (!auction?.data?.type) {
      return "";
    }
    
    const typeString = auction.data.type;
    
    // Handle generic auction types like: 0x...::auction_house::Auction<0x...::nft::NFT>
    const match = typeString.match(/<(.+)>/);
    if (match && match[1]) {
      return match[1].trim();
    }
    
    return "";
  };

  // Helper function to extract NFT image URL from auction data
  const getNftImageUrl = () => {
    if (!auctionData?.data?.content?.fields) return "";
    const auction = auctionData.data.content.fields;
    return auction.nft?.fields?.nft?.fields?.image_url || "";
  };

  // Helper function to extract NFT name from auction data
  const getNftName = () => {
    if (!auctionData?.data?.content?.fields) return "Digital Collectible";
    const auction = auctionData.data.content.fields;
    return auction.nft?.fields?.nft?.fields?.name || "Digital Collectible";
  };

  // Helper function to extract NFT description from auction data
  const getNftDescription = () => {
    if (!auctionData?.data?.content?.fields) return "";
    const auction = auctionData.data.content.fields;
    return auction.nft?.fields?.nft?.fields?.description || "";
  };

  const formatSui = (mist: string | number) => {
    return formatMistAsSui(mist, 4);
  };

  // NEW: More robust auction end detection
  const isAuctionTimeEnded = () => {
    if (!auctionData?.data?.content?.fields) return false;
    const fields = auctionData.data.content.fields;
    const endTime = parseInt(fields.end_time);
    const currentTime = Date.now();
    const timeEnded = currentTime >= endTime;
    
    console.log("🕐 Time check:", {
      currentTime,
      endTime,
      timeDifference: currentTime - endTime,
      isEnded: timeEnded
    });
    
    return timeEnded;
  };

  // Enhanced auction ended check
  const isAuctionEnded = () => {
    if (!auctionData?.data?.content?.fields) return false;
    const fields = auctionData.data.content.fields;
    const endTime = parseInt(fields.end_time);
    return Date.now() > endTime;
  };

  const isCurrentUserCreator = () => {
    if (!currentAccount?.address || !auctionData?.data?.content?.fields) return false;
    const fields = auctionData.data.content.fields;
    return currentAccount.address === fields.creator;
  };

  const isCurrentUserWinner = () => {
    if (!currentAccount?.address || !auctionData?.data?.content?.fields) return false;
    const fields = auctionData.data.content.fields;
    
    // For active auctions, check highest_bidder
    if (fields.highest_bidder) {
      return currentAccount.address === fields.highest_bidder;
    }
    
    return false;
  };

  const getCurrentBid = () => {
    if (!auctionData?.data?.content?.fields) return "0";
    const fields = auctionData.data.content.fields;
    
    // For active auctions, use current_bid or starting_bid
    if (fields.bid_count > 0) {
      return fields.current_bid;
    } else {
      return fields.starting_bid;
    }
  };

  const getMinimumBid = () => {
    if (!auctionData?.data?.content?.fields) {
      return "1";
    }
    
    const currentBidMist = getCurrentBid();
    const currentBidSui = parseFloat(formatSui(currentBidMist));
    
    // Add minimum increment (0.001 SUI) and round up to next whole SUI
    const minimumBidSui = Math.ceil(currentBidSui + 0.001);
    
    return minimumBidSui.toString();
  };

  const canCancelAuction = () => {
    if (!currentAccount?.address || !auctionData?.data?.content?.fields) return false;
    const auction = auctionData.data.content.fields;
    const userIsCreator = currentAccount.address === auction.creator;
    // Convert bid_count to number to handle different data types from blockchain
    const bidCount = Number(auction.bid_count) || 0;
    const noBids = bidCount === 0;
    const notEnded = !isAuctionEnded();
    
    return userIsCreator && noBids && notEnded;
  };

  // Helper function to check if creator has already claimed proceeds
  const isCreatorAlreadyClaimed = () => {
    if (!auctionData?.data?.content?.fields) return false;
    const auction = auctionData.data.content.fields;
    
    // Move enums in Sui are represented with type and variant fields
    const status = auction.status;
    
    console.log("Checking auction status:", status, "Type:", typeof status);
    
    // Handle multiple possible representations of the Claimed enum
    // In Move: Active = 0, Ended = 1, Claimed = 2
    
    if (typeof status === 'number') {
      // Direct numeric representation
      return status === 2; // Claimed = 2
    } else if (typeof status === 'string') {
      return status === "Claimed" || status === "2";
    } else if (typeof status === 'object' && status !== null) {
      // Check for Sui enum format: { "type": "...", "variant": "Claimed", "fields": {} }
      if (status.variant === "Claimed") {
        return true;
      }
      // Check for alternative object representation like { "Claimed": null } or { "Claimed": {} }
      if (status.hasOwnProperty('Claimed') || status.Claimed !== undefined) {
        return true;
      }
      // Check for numeric enum representation in object form
      if (status.type === 2 || status.value === 2) {
        return true;
      }
      // Handle BCS serialized format
      if (status.$kind === "Claimed" || status.kind === "Claimed") {
        return true;
      }
    }
    
    return false;
  };

  // NEW: More robust auction status detection
  const getAuctionStatus = () => {
    if (!auctionData?.data?.content?.fields) return "Unknown";
    const status = auctionData.data.content.fields.status;
    
    console.log("Raw auction status object:", status);
    
    // Handle numeric enum (most common in Sui)
    if (typeof status === 'number') {
      if (status === 0) return "Active";
      if (status === 1) return "Ended"; 
      if (status === 2) return "Claimed";
      return `Unknown(${status})`;
    }
    
    // Handle string representation
    if (typeof status === 'string') {
      return status;
    }
    
    // Handle object representations (various formats)
    if (typeof status === 'object' && status !== null) {
      // Sui Move enum format with variant field
      if (status.variant) {
        return status.variant;
      }
      
      // Object with direct enum key
      if (status.hasOwnProperty('Active')) return "Active";
      if (status.hasOwnProperty('Ended')) return "Ended";
      if (status.hasOwnProperty('Claimed')) return "Claimed";
      
      // BCS serialized format
      if (status.$kind) return status.$kind;
      if (status.kind) return status.kind;
      
      // Fallback: JSON representation for debugging
      console.log("Unrecognized status object format:", JSON.stringify(status));
      return `Object(${JSON.stringify(status)})`;
    }
    
    return "Unknown";
  };

  // NEW: Check if auction is in Claimed status (creator has claimed proceeds)
  const isAuctionInClaimedStatus = () => {
    const status = getAuctionStatus();
    return status === "Claimed";
  };

  // Helper function to get auction status as string for debugging
  const getAuctionStatusString = () => {
    // Redirect to the new robust function
    return getAuctionStatus();
  };

  // Helper function to get claim button text and explanation
  const getClaimInfo = () => {
    if (!auctionData?.data?.content?.fields) return { text: "Claim NFT", explanation: "" };
    
    const isInClaimedStatus = isAuctionInClaimedStatus();
    
    if (isInClaimedStatus) {
      return {
        text: "Claim NFT",
        explanation: "Creator has already claimed proceeds. You can now claim your NFT."
      };
    } else {
      return {
        text: "Claim NFT & Pay Creator",
        explanation: "This will transfer the NFT to you and pay the creator (minus 1% fee)."
      };
    }
  };

  // Simple debug function to help troubleshoot issues
  const handleDebugAuction = () => {
    console.log("=== AUCTION DEBUG INFO ===");
    console.log("Auction ID:", id);
    console.log("Full auction data:", auctionData);
    console.log("Auction fields:", auctionData?.data?.content?.fields);
    console.log("Auction status (raw):", auctionData?.data?.content?.fields?.status);
    console.log("Auction status (parsed):", getAuctionStatus());
    console.log("Is in Claimed status:", isAuctionInClaimedStatus());
    console.log("Creator claimed check (legacy):", isCreatorAlreadyClaimed());
    console.log("User address:", currentAccount?.address);
    console.log("User is creator:", isCurrentUserCreator());
    console.log("User is winner:", isCurrentUserWinner());
    console.log("Auction ended:", isAuctionEnded());
    console.log("Can cancel:", canCancelAuction());
    console.log("NFT Type:", extractNftType(auctionData));
    console.log("Current time:", Date.now());
    console.log("Auction end time:", auctionData?.data?.content?.fields?.end_time);
    console.log("Bid count:", auctionData?.data?.content?.fields?.bid_count);
    console.log("Current bid:", auctionData?.data?.content?.fields?.current_bid);
    console.log("Highest bidder:", auctionData?.data?.content?.fields?.highest_bidder);
    console.log("Claim function to use:", isAuctionInClaimedStatus() ? "claimNftAfterCreatorClaim" : "claimNft");
    console.log("========================");
  };

  const handleViewOnBlockchain = () => {
    // Open SuiScan (Sui blockchain explorer) for the auction object
    const explorerUrl = `https://suiscan.xyz/devnet/object/${id}`;
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };

  // NEW: Comprehensive diagnostic function to understand auction status format
  const handleAuctionStatusDiagnostic = () => {
    if (!auctionData?.data?.content?.fields) {
      console.log("❌ No auction data available");
      return;
    }

    const auction = auctionData.data.content.fields;
    const status = auction.status;

    console.log("🔍 === COMPREHENSIVE AUCTION STATUS DIAGNOSTIC ===");
    console.log("📊 Raw status value:", status);
    console.log("📊 Status type:", typeof status);
    console.log("📊 Status constructor:", status?.constructor?.name);
    console.log("📊 Status as JSON:", JSON.stringify(status, null, 2));
    
    if (typeof status === 'object' && status !== null) {
      console.log("📊 Object keys:", Object.keys(status));
      console.log("📊 Object entries:", Object.entries(status));
      
      // Check all possible enum representations
      console.log("🔎 Checking enum representations:");
      console.log("  - status.variant:", status.variant);
      console.log("  - status.$kind:", status.$kind);
      console.log("  - status.kind:", status.kind);
      console.log("  - status.type:", status.type);
      console.log("  - status.value:", status.value);
      console.log("  - status.Active:", status.Active);
      console.log("  - status.Ended:", status.Ended);
      console.log("  - status.Claimed:", status.Claimed);
      
      // Check for numeric properties
      for (const [key, value] of Object.entries(status)) {
        console.log(`  - status['${key}']:`, value, `(type: ${typeof value})`);
      }
    }
    
    console.log("✅ Parsed status:", getAuctionStatus());
    console.log("✅ Is in Claimed status:", isAuctionInClaimedStatus());
    console.log("✅ Legacy creator claimed check:", isCreatorAlreadyClaimed());
    console.log("✅ Which function would be used:", isAuctionInClaimedStatus() ? "claimNftAfterCreatorClaim" : "claimNft");
    console.log("=================================");
    
    // Also show in UI for easier access
    toast.info(`Status: ${getAuctionStatus()} | Type: ${typeof status} | Function: ${isAuctionInClaimedStatus() ? "claimNftAfterCreatorClaim" : "claimNft"}`);
  };

  // NEW: Comprehensive claim validation
  const validateClaimConditions = () => {
    console.log("🔍 === COMPREHENSIVE CLAIM VALIDATION ===");
    
    if (!auctionData || !id) {
      console.log("❌ Missing auction data or ID");
      return { canClaim: false, reason: "Missing auction data" };
    }

    if (!currentAccount?.address) {
      console.log("❌ No wallet connected");
      return { canClaim: false, reason: "No wallet connected" };
    }

    const auction = auctionData.data.content.fields;
    const currentTime = Date.now();
    const endTime = parseInt(auction.end_time);
    const bidCount = Number(auction.bid_count) || 0;
    const userAddress = currentAccount.address;
    const auctionStatus = getAuctionStatus();

    console.log("📊 Validation data:", {
      auctionId: id,
      userAddress,
      creator: auction.creator,
      highestBidder: auction.highest_bidder,
      currentTime,
      endTime,
      timeDifference: currentTime - endTime,
      bidCount,
      auctionStatus,
      isTimeEnded: currentTime >= endTime,
      isUserWinner: userAddress === auction.highest_bidder,
      isUserCreator: userAddress === auction.creator
    });

    // Check if auction has ended
    if (currentTime < endTime) {
      console.log("❌ Auction has not ended yet");
      return { canClaim: false, reason: "Auction has not ended yet" };
    }

    // Check if there are bids
    if (bidCount === 0) {
      console.log("ℹ️ No bids placed on this auction");
      if (userAddress === auction.creator) {
        return { canClaim: true, reason: "Creator can claim back NFT (no bids)", method: "claimNft" };
      } else {
        return { canClaim: false, reason: "No bids and you are not the creator" };
      }
    }

    // Check if user is the winner
    if (userAddress !== auction.highest_bidder) {
      console.log("❌ User is not the highest bidder");
      return { canClaim: false, reason: "You are not the highest bidder" };
    }

    // Determine which claim method to use based on auction status
    if (auctionStatus === "Claimed") {
      console.log("✅ Can claim using claimNftAfterCreatorClaim");
      return { canClaim: true, reason: "Creator has claimed proceeds", method: "claimNftAfterCreatorClaim" };
    } else {
      console.log("✅ Can claim using claimNft");
      return { canClaim: true, reason: "Standard claim (pay creator)", method: "claimNft" };
    }
  };

  // NEW: Test claim conditions (for debugging)
  const handleTestClaimConditions = () => {
    console.log("🧪 === TESTING CLAIM CONDITIONS ===");
    
    const validation = validateClaimConditions();
    
    console.log("Test results:", validation);
    
    // Show results in toast for easy viewing
    if (validation.canClaim) {
      toast.success(`✅ Can claim! Method: ${validation.method}. Reason: ${validation.reason}`);
    } else {
      toast.error(`❌ Cannot claim. Reason: ${validation.reason}`);
    }
    
    // Also test individual conditions
    console.log("🔍 Individual condition tests:");
    console.log("- Auction ended:", isAuctionEnded());
    console.log("- User is winner:", isCurrentUserWinner());
    console.log("- User is creator:", isCurrentUserCreator());
    console.log("- Auction status:", getAuctionStatus());
    console.log("- In claimed status:", isAuctionInClaimedStatus());
    
    return validation;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Gavel className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (!auctionData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Auction Not Found</h2>
          <p className="text-gray-600 mb-6">The auction you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const auction = auctionData.data.content.fields;
  const auctionEnded = isAuctionEnded();
  const userIsCreator = isCurrentUserCreator();
  const userIsWinner = isCurrentUserWinner();
  const canCancel = canCancelAuction();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header with status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Auctions
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={handleDebugAuction}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Debug Info
              </button>
              <button
                onClick={handleAuctionStatusDiagnostic}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              >
                Status Diagnostic
              </button>
              <button
                onClick={handleTestClaimConditions}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                Test Claim
              </button>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {auction.title || "Untitled NFT"}
          </h1>
          <p className="text-gray-600 text-lg">
            {auction.description || "No description available"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - NFT Image and Details */}
          <div className="space-y-6">
            {/* NFT Image */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {getNftImageUrl() ? (
                  <div className="w-full h-full">
                    <img 
                      src={getNftImageUrl()} 
                      alt={getNftName()}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center text-center p-8">
                      <div>
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">NFT</span>
                        </div>
                        <p className="text-gray-600 font-medium">{getNftName()}</p>
                        <p className="text-sm text-gray-500 mt-1">Unique blockchain asset</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">NFT</span>
                    </div>
                    <p className="text-gray-600 font-medium">Digital Collectible</p>
                    <p className="text-sm text-gray-500 mt-1">Unique blockchain asset</p>
                  </div>
                )}
              </div>
            </div>

            {/* NFT Technical Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Hash className="h-6 w-6 text-indigo-500 mr-2" />
                NFT Details
              </h3>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">NFT ID</label>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-sm font-mono text-gray-900 break-all">{auction.nft_id}</p>
                    </div>
                  </div>
                  
                  {/* NFT Name */}
                  {getNftName() !== "Digital Collectible" && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">NFT Name</label>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-sm text-gray-900">{getNftName()}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* NFT Description */}
                  {getNftDescription() && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">NFT Description</label>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-sm text-gray-900">{getNftDescription()}</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Creator</label>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-sm font-mono text-gray-900 break-all">{auction.creator}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">NFT Type</label>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-sm font-mono text-gray-900 break-all">{extractNftType(auctionData)}</p>
                    </div>
                  </div>
                  
                  {/* Blockchain Explorer Button */}
                  <div className="mt-6">
                    <button 
                      onClick={handleViewOnBlockchain}
                      className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                      title="View auction details on Sui blockchain explorer"
                    >
                      <ExternalLink size={16} />
                      <span>View on Blockchain Explorer</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Explore this auction's blockchain data on SuiScan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Auction Info and Bidding */}
          <div className="space-y-6">
            {/* Auction Status and Time */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Current Auction</h2>
                {auctionEnded ? (
                  <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
                    <Clock className="h-4 w-4 mr-1" />
                    Ended
                  </div>
                ) : (
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                    <Clock className="h-4 w-4 mr-1" />
                    Active
                  </div>
                )}
              </div>

              {/* Time Display */}
              {!auctionEnded && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{timeLeft.days}</p>
                      <p className="text-sm text-gray-600">Days</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{timeLeft.hours}</p>
                      <p className="text-sm text-gray-600">Hours</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-pink-600">{timeLeft.minutes}</p>
                      <p className="text-sm text-gray-600">Minutes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">{timeLeft.seconds}</p>
                      <p className="text-sm text-gray-600">Seconds</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Start and End Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Start Time</p>
                  <p className="text-sm text-gray-900">
                    {new Date(parseInt(auction.start_time)).toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">End Time</p>
                  <p className="text-sm text-gray-900">
                    {new Date(parseInt(auction.end_time)).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Bid Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Current Bid</p>
                  <p className="text-3xl font-bold text-gray-900">{formatSui(getCurrentBid())} SUI</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Min. Increment</p>
                  <p className="text-xl font-semibold text-gray-700">0.1 SUI</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{auction.bid_count || 0}</p>
                  <p className="text-sm text-gray-600">Total Bids</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">142</p>
                  <p className="text-sm text-gray-600">Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-pink-600">24</p>
                  <p className="text-sm text-gray-600">Favorites</p>
                </div>
              </div>

              {/* Winner/Bidder Information */}
              {auction.highest_bidder && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">Leading Bidder:</span>
                    <span className="text-sm font-mono text-yellow-900 ml-2">
                      {auction.highest_bidder.slice(0, 6)}...{auction.highest_bidder.slice(-4)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bidding Interface - Only for active auctions */}
            {!auctionEnded && !userIsCreator && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Place Your Bid</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                      Bid Amount (SUI)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="bidAmount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Minimum: ${getMinimumBid()} SUI`}
                        step="0.1"
                        min={getMinimumBid()}
                        disabled={auctionEnded || userIsCreator}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <img src="/src/assets/icons/sui-icon.png" alt="SUI" className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Current minimum bid: {getMinimumBid()} SUI
                    </p>
                  </div>

                  <button
                    onClick={handlePlaceBid}
                    disabled={!bidAmount || isPlacingBid || auctionEnded || userIsCreator}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  >
                    {isPlacingBid ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Placing Bid...
                      </div>
                    ) : auctionEnded ? (
                      "Auction Ended"
                    ) : userIsCreator ? (
                      "Cannot Bid on Own Auction"
                    ) : (
                      "Place Bid"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Auction Ended Notice - Show for ended auctions */}
            {auctionEnded && !userIsCreator && !userIsWinner && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="text-center py-8">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Auction Has Ended</h3>
                  <p className="text-gray-600 mb-4">This auction concluded at {new Date(parseInt(auction.end_time)).toLocaleString()}</p>
                  {auction.highest_bidder ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-700">
                        <strong>Winner:</strong> {auction.highest_bidder.slice(0, 8)}...{auction.highest_bidder.slice(-8)}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        <strong>Final Bid:</strong> {formatSui(getCurrentBid())} SUI
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600">No bids were placed on this auction</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons for Creator/Winner */}
            {(userIsCreator || (auctionEnded && userIsWinner)) && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {userIsCreator ? "Creator Actions" : "Winner Actions"}
                </h3>
                
                {/* Creator Actions */}
                {userIsCreator && (
                  <div className="space-y-4">
                    {auctionEnded && auction.bid_count > 0 && !isAuctionInClaimedStatus() && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <Coins className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-medium text-green-800">Claim Proceeds Available</span>
                        </div>
                        <p className="text-sm text-green-700 mb-3">
                          Your auction has ended with bids. You can claim the proceeds (minus 1% fee).
                        </p>
                        <button
                          onClick={handleClaimCreatorProceeds}
                          disabled={isClaiming}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isClaiming ? "Claiming..." : "Claim Proceeds"}
                        </button>
                      </div>
                    )}
                    
                    {isAuctionInClaimedStatus() && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-800">Proceeds Claimed</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          You have successfully claimed the auction proceeds.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Winner Actions */}
                {auctionEnded && userIsWinner && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Trophy className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="font-medium text-yellow-800">Congratulations! You Won</span>
                      </div>
                      
                      <div className="bg-white/60 rounded-lg p-3 mb-4">
                        <div className="text-sm text-gray-700">
                          <div className="flex justify-between mb-1">
                            <span>Winning Bid:</span>
                            <span className="font-medium">{formatSui(getCurrentBid())} SUI</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span>Status:</span>
                            <span className={`font-medium ${isAuctionInClaimedStatus() ? 'text-green-600' : 'text-orange-600'}`}>
                              {isAuctionInClaimedStatus() ? 'Creator Paid' : 'Pending Payment'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Auction Status:</span>
                            <span className="font-medium text-blue-600">
                              {getAuctionStatus()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-yellow-700 mb-3">
                        {getClaimInfo().explanation}
                      </p>
                      
                      <button
                        onClick={handleClaimNft}
                        disabled={isClaiming}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {isClaiming ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Claiming...
                          </div>
                        ) : (
                          getClaimInfo().text
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Cancellation Option */}
                {canCancel && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <X className="h-5 w-5 text-red-600 mr-2" />
                        <span className="font-medium text-red-800">Cancel Auction</span>
                      </div>
                      <p className="text-sm text-red-700 mb-3">
                        No bids have been placed yet. You can cancel this auction and get your NFT back.
                      </p>
                      <button
                        onClick={handleCancelAuction}
                        disabled={isCanceling}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCanceling ? "Canceling..." : "Cancel Auction"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
