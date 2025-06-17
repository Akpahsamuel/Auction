import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuctionHook } from "../../../../hooks/use-create-auction";
import { useBidHook } from "../../../../hooks/use-bid";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Clock, Trophy, Gavel, AlertCircle, CheckCircle2, Timer, Coins, User, Calendar, Hash } from "lucide-react";
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
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const { getAuctionDetailById } = useAuctionHook();
  const { placeBid, claimNft, claimCreatorProceeds, cancelAuction } = useBidHook();
  const currentAccount = useCurrentAccount();

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
      
      console.log("Placing bid:", {
        auctionId: id,
        bidAmount: bidValue,
        nftType,
        minimumBid
      });
      
      await placeBid(id, bidValue, nftType);
      setBidAmount("");
      
      // Refresh auction data after successful bid
      console.log("Refreshing auction data after successful bid...");
      const updatedData = await getAuctionDetailById(id);
      setAuctionData(updatedData);
      
      toast.success(`Bid of ${bidValue} SUI placed successfully!`);
    } catch (error) {
      console.error("Failed to place bid:", error);
      toast.error(`Failed to place bid: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleClaimNft = async () => {
    if (!auctionData || !id) {
      toast.error("Missing auction data for claiming NFT");
      return;
    }

    // Validate that auction has ended
    if (!isAuctionEnded()) {
      toast.error("Cannot claim NFT: auction has not ended yet");
      return;
    }

    // Validate that user is the winner
    if (!isCurrentUserWinner()) {
      toast.error("Cannot claim NFT: you are not the highest bidder");
      return;
    }

    setIsClaiming(true);
    try {
      const nftType = extractNftType(auctionData);
      if (!nftType) {
        throw new Error("Could not determine NFT type for claiming");
      }
      
      console.log("Claiming NFT:", {
        auctionId: id,
        nftType,
        isWinner: isCurrentUserWinner(),
        isEnded: isAuctionEnded()
      });
      
      await claimNft(id, nftType);
      
      // Refresh auction data after successful claim
      console.log("Refreshing auction data after successful claim...");
      const updatedData = await getAuctionDetailById(id);
      setAuctionData(updatedData);
      
      toast.success("NFT claimed successfully!");
    } catch (error) {
      console.error("Failed to claim NFT:", error);
      toast.error(`Failed to claim NFT: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClaimProceeds = async () => {
    if (!auctionData || !id) {
      toast.error("Missing auction data for claiming proceeds");
      return;
    }

    // Validate that auction has ended
    if (!isAuctionEnded()) {
      toast.error("Cannot claim proceeds: auction has not ended yet");
      return;
    }

    // Validate that user is the creator
    if (!isCurrentUserCreator()) {
      toast.error("Cannot claim proceeds: you are not the auction creator");
      return;
    }

    // Check if there are any bids
    const auction = auctionData.data.content.fields;
    if (auction.bid_count === 0) {
      toast.error("Cannot claim proceeds: no bids were placed on this auction");
      return;
    }

    setIsClaiming(true);
    try {
      const nftType = extractNftType(auctionData);
      if (!nftType) {
        throw new Error("Could not determine NFT type for claiming proceeds");
      }
      
      console.log("Claiming creator proceeds:", {
        auctionId: id,
        nftType,
        isCreator: isCurrentUserCreator(),
        isEnded: isAuctionEnded(),
        bidCount: auction.bid_count
      });
      
      await claimCreatorProceeds(id, nftType);
      
      // Refresh auction data after successful claim
      console.log("Refreshing auction data after successful proceeds claim...");
      const updatedData = await getAuctionDetailById(id);
      setAuctionData(updatedData);
      
      toast.success("Creator proceeds claimed successfully!");
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
      // Note: After successful cancellation, the auction object is destroyed,
      // so we might want to redirect the user or show a success message
      // For now, we'll try to refresh but expect it to fail gracefully
      setTimeout(() => {
        window.location.href = '/auctions'; // Redirect to auctions list
      }, 2000);
    } catch (error) {
      console.error("Failed to cancel auction:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  const extractNftType = (auction: any) => {
    if (!auction?.data?.type) {
      console.error("Auction data or type not found:", auction);
      return "";
    }
    
    const typeString = auction.data.type;
    console.log("Extracting NFT type from:", typeString);
    
    // Handle generic auction types like: 0x...::auction_house::Auction<0x...::nft::NFT>
    const match = typeString.match(/<(.+)>/);
    if (match && match[1]) {
      const nftType = match[1].trim();
      console.log("Extracted NFT type:", nftType);
      return nftType;
    }
    
    console.error("Could not extract NFT type from:", typeString);
    return "";
  };

  const formatSui = (mist: string | number) => {
    return formatMistAsSui(mist, 4);
  };

  const isAuctionEnded = () => {
    if (!auctionData?.data?.content?.fields) return false;
    const endTime = parseInt(auctionData.data.content.fields.end_time);
    return Date.now() > endTime;
  };

  const isCurrentUserCreator = () => {
    if (!currentAccount?.address || !auctionData?.data?.content?.fields) return false;
    return currentAccount.address === auctionData.data.content.fields.creator;
  };

  const isCurrentUserWinner = () => {
    if (!currentAccount?.address || !auctionData?.data?.content?.fields) return false;
    const highestBidder = auctionData.data.content.fields.highest_bidder;
    return currentAccount.address === highestBidder;
  };

  const getCurrentBid = () => {
    if (!auctionData?.data?.content?.fields) return "0";
    // Both current_bid and starting_bid are now stored in MIST units
    if (auctionData.data.content.fields.bid_count > 0) {
      return auctionData.data.content.fields.current_bid;
    } else {
      // starting_bid is already in MIST, so return it directly
      return auctionData.data.content.fields.starting_bid;
    }
  };

  const getMinimumBid = () => {
    if (!auctionData?.data?.content?.fields) {
      console.warn("Auction data not available for minimum bid calculation");
      return "1";
    }
    
    const currentBidMist = getCurrentBid();
    const currentBidSui = parseFloat(formatSui(currentBidMist));
    
    // Add minimum increment (0.001 SUI) and round up to next whole SUI
    const minimumBidSui = Math.ceil(currentBidSui + 0.001);
    
    console.log("Minimum bid calculation:", {
      currentBidMist,
      currentBidSui,
      minimumBidSui
    });
    
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
    
    // Debug logging
    console.log('canCancelAuction debug:', {
      userIsCreator,
      bidCount,
      bidCountRaw: auction.bid_count,
      bidCountType: typeof auction.bid_count,
      noBids,
      notEnded,
      result: userIsCreator && noBids && notEnded
    });
    
    return userIsCreator && noBids && notEnded;
  };

  // Simple debug function to help troubleshoot issues
  const handleDebugAuction = () => {
    if (!id || !auctionData) return;
    
    console.log("🔍 Auction Debug Information:");
    console.log("Auction ID:", id);
    console.log("Auction Data:", auctionData);
    console.log("NFT Type:", extractNftType(auctionData));
    console.log("Current User:", currentAccount?.address);
    console.log("Is Creator:", isCurrentUserCreator());
    console.log("Is Winner:", isCurrentUserWinner());
    console.log("Is Ended:", isAuctionEnded());
    console.log("Can Cancel:", canCancelAuction());
    console.log("Current Bid:", getCurrentBid());
    console.log("Minimum Bid:", getMinimumBid());
    
    toast.info("Debug information logged to console");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md mb-4">
            <Gavel className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Live Auction</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {auction.title || "Untitled Auction"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {auction.description || "No description provided"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - NFT Image and Main Info */}
          <div className="lg:col-span-1">
            {/* NFT Image Display */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <img
                  src={auction.nft?.fields?.nft?.fields?.image_url || "https://via.placeholder.com/600x600/e5e7eb/6b7280?text=NFT+Image"}
                  alt={auction.title || "NFT"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/600x600/e5e7eb/6b7280?text=NFT+Image";
                  }}
                />
              </div>
            </div>

            {/* NFT Details Card */}
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
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Auction Info and Bidding */}
          <div className="lg:col-span-1 space-y-6">
            {/* Auction Status and Timer Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${auctionEnded ? 'bg-red-100' : 'bg-green-100'}`}>
                    {auctionEnded ? (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    ) : (
                      <Clock className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Auction Status</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      auctionEnded ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {auctionEnded ? 'Ended' : 'Active'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">Ends</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(parseInt(auction.end_time)).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Countdown Timer */}
              {!auctionEnded && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center mb-4">
                    <Timer className="h-6 w-6 mr-2" />
                    <h3 className="text-lg font-semibold">Auction Ends In</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Minutes', value: timeLeft.minutes },
                      { label: 'Seconds', value: timeLeft.seconds }
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-2">
                          <div className="text-2xl md:text-3xl font-bold">{item.value.toString().padStart(2, '0')}</div>
                        </div>
                        <div className="text-sm opacity-90">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Current Bid Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Current Bid</p>
                  <p className="text-3xl font-bold text-gray-900">{formatSui(getCurrentBid())} ETH</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Min. Increment</p>
                  <p className="text-xl font-semibold text-gray-700">0.1 ETH</p>
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

            {/* Bidding Interface */}
            {!auctionEnded && !userIsCreator && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gavel className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Place Bid</h3>
                    </div>
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                      <span className="text-sm">Add to Favorites</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Your Bid (SUI)</label>
                        <span className="text-xs text-gray-500">Min: {getMinimumBid()} SUI</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={getMinimumBid()}
                          min={getMinimumBid()}
                          step="1"
                          className="w-full px-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <span className="text-xl font-bold text-gray-400">SUI</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handlePlaceBid}
                      disabled={isPlacingBid || !bidAmount}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    >
                      {isPlacingBid ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Placing Bid...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Gavel className="h-5 w-5 mr-2" />
                          Place Bid
                        </div>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>142 views</span>
                        <span>24 favorites</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Winner Panel */}
            {auctionEnded && userIsWinner && (
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Congratulations!</h3>
                  <p className="text-green-100 mt-1">You won this auction!</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <p className="text-center text-lg">
                    Winning bid: <span className="font-bold text-xl">{formatSui(getCurrentBid())} SUI</span>
                  </p>
                </div>
                
                <button
                  onClick={handleClaimNft}
                  disabled={isClaiming}
                  className="w-full bg-white text-green-600 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  {isClaiming ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-600 border-t-transparent mr-2"></div>
                      Claiming...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Claim NFT
                    </div>
                  )}
                </button>
              </div>
            )}

            {/* Creator Panel */}
            {auctionEnded && userIsCreator && auction.highest_bidder && (
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <Coins className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Auction Ended</h3>
                  <p className="text-blue-100 mt-1">Your auction was successful!</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <p className="text-center text-lg">
                    Final bid: <span className="font-bold text-xl">{formatSui(getCurrentBid())} SUI</span>
                  </p>
                </div>
                
                <button
                  onClick={handleClaimProceeds}
                  disabled={isClaiming}
                  className="w-full bg-white text-blue-600 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  {isClaiming ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mr-2"></div>
                      Claiming...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Coins className="h-5 w-5 mr-2" />
                      Claim Proceeds
                    </div>
                  )}
                </button>
                <p className="text-xs text-blue-100 text-center mt-2">
                  Available after grace period
                </p>
              </div>
            )}

            {/* Creator Control Panel */}
            {userIsCreator && !auctionEnded && (
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Your Auction</h3>
                  <p className="text-yellow-100 mt-1">You cannot bid on your own auction</p>
                </div>
                
                {canCancelAuction() && (
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Cancel Auction</h4>
                      <p className="text-sm text-yellow-100">
                        No bids have been placed yet. You can cancel this auction and get your NFT back.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleCancelAuction}
                      disabled={isCanceling}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCanceling ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Canceling...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Cancel Auction
                        </div>
                      )}
                    </button>
                  </div>
                )}
                
                {auction.bid_count > 0 && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Cannot Cancel</span>
                    </div>
                    <p className="text-sm text-yellow-100">
                      This auction cannot be canceled because bids have been placed.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Debug Panel - Development Only */}
            {true && ( // Set to false in production
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-4 mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">🔧 Development Tools</h4>
                <button
                  onClick={handleDebugAuction}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Debug Auction State
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Check browser console for debug information
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
