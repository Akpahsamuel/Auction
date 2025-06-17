import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuctionHook } from "../../../../hooks/use-create-auction";
import { useBidHook } from "../../../../hooks/use-bid";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Clock, Trophy, Users, Gavel, AlertCircle, CheckCircle2, Timer, Coins, User, Calendar, Hash } from "lucide-react";

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
    if (!bidAmount || !auctionData || !id) return;

    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= 0) {
      alert("Please enter a valid bid amount");
      return;
    }

    setIsPlacingBid(true);
    try {
      const nftType = extractNftType(auctionData);
      await placeBid(id, bidValue, nftType);
      setBidAmount("");
      // Refresh auction data after successful bid
      const updatedData = await getAuctionDetailById(id);
      setAuctionData(updatedData);
    } catch (error) {
      console.error("Failed to place bid:", error);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleClaimNft = async () => {
    if (!auctionData || !id) return;

    setIsClaiming(true);
    try {
      const nftType = extractNftType(auctionData);
      await claimNft(id, nftType);
      const updatedData = await getAuctionDetailById(id);
      setAuctionData(updatedData);
    } catch (error) {
      console.error("Failed to claim NFT:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClaimProceeds = async () => {
    if (!auctionData || !id) return;

    setIsClaiming(true);
    try {
      const nftType = extractNftType(auctionData);
      await claimCreatorProceeds(id, nftType);
      const updatedData = await getAuctionDetailById(id);
      setAuctionData(updatedData);
    } catch (error) {
      console.error("Failed to claim proceeds:", error);
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
    if (auction?.data?.type) {
      const typeString = auction.data.type;
      const match = typeString.match(/<(.+)>/);
      return match ? match[1] : "";
    }
    return "";
  };

  const formatSui = (mist: string | number) => {
    const mistValue = typeof mist === 'string' ? parseInt(mist) : mist;
    return (mistValue / 1_000_000_000).toFixed(4);
  };

  const formatStartingBid = (suiAmount: string | number) => {
    // starting_bid is stored in SUI units, so no conversion needed
    const suiValue = typeof suiAmount === 'string' ? parseFloat(suiAmount) : suiAmount;
    return suiValue.toFixed(4);
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
    // current_bid is stored in MIST, starting_bid is stored in SUI units
    // If there are bids, use current_bid (in MIST), otherwise convert starting_bid to MIST
    if (auctionData.data.content.fields.bid_count > 0) {
      return auctionData.data.content.fields.current_bid;
    } else {
      // Convert starting_bid from SUI to MIST for consistent display
      const startingBidSui = auctionData.data.content.fields.starting_bid;
      return (startingBidSui * 1_000_000_000).toString();
    }
  };

  const getMinimumBid = () => {
    const currentBid = parseFloat(formatSui(getCurrentBid()));
    // Since contract only supports whole SUI amounts, minimum bid is next whole SUI
    return Math.ceil(currentBid + 0.001).toString();
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Auction Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Timer Card */}
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
                    <h3 className="text-lg font-semibold">Time Remaining</h3>
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
                          <div className="text-2xl md:text-3xl font-bold">{item.value}</div>
                        </div>
                        <div className="text-sm opacity-90">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bidding Statistics Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
                Bidding Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Coins className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Starting Bid</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{formatStartingBid(auction.starting_bid)} SUI</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Trophy className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">Current Highest Bid</span>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{formatSui(getCurrentBid())} SUI</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-purple-800">Total Bids</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{auction.bid_count || 0}</p>
                  </div>

                  {auction.highest_bidder && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <User className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-yellow-800">Leading Bidder</span>
                      </div>
                      <p className="text-sm font-mono text-yellow-900 break-all">
                        {auction.highest_bidder.slice(0, 6)}...{auction.highest_bidder.slice(-4)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* NFT Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Hash className="h-6 w-6 text-indigo-500 mr-2" />
                NFT Details
              </h3>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">NFT Type</label>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-sm font-mono text-gray-900 break-all">{extractNftType(auctionData)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Action Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Bidding Interface */}
              {!auctionEnded && !userIsCreator && (
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Gavel className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Place Your Bid</h3>
                    <p className="text-gray-600 mt-1">Join the auction and make your bid</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bid Amount (SUI)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={getMinimumBid()}
                          min={getMinimumBid()}
                          step="1"
                          className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                        />
                        <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Minimum bid:</strong> {getMinimumBid()} SUI
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Only whole numbers are accepted
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handlePlaceBid}
                      disabled={isPlacingBid || !bidAmount}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
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
                  </div>
                </div>
              )}

              {/* Winner Panel */}
              {auctionEnded && userIsWinner && (
                <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-xl p-6 text-white mb-6">
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
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl shadow-xl p-6 text-white mb-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
