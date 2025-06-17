import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuctionHook } from "../../../../hooks/use-create-auction";
import { useBidHook } from "../../../../hooks/use-bid";
import { useCurrentAccount } from "@mysten/dapp-kit";

const Index = () => {
  const { id } = useParams();
  const [auctionData, setAuctionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const { getAuctionDetailById } = useAuctionHook();
  const { placeBid, claimNft, claimCreatorProceeds } = useBidHook();
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
    return auctionData.data.content.fields.highest_bid || auctionData.data.content.fields.starting_bid;
  };

  const getMinimumBid = () => {
    const currentBid = parseFloat(formatSui(getCurrentBid()));
    // Since contract only supports whole SUI amounts, minimum bid is next whole SUI
    return Math.ceil(currentBid + 0.001).toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (!auctionData?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Auction Not Found</h2>
          <p className="text-gray-600">The auction you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const auction = auctionData.data.content.fields;
  const auctionEnded = isAuctionEnded();
  const userIsCreator = isCurrentUserCreator();
  const userIsWinner = isCurrentUserWinner();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Auction Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {new TextDecoder().decode(new Uint8Array(auction.title))}
            </h1>
            <p className="text-gray-600">
              {new TextDecoder().decode(new Uint8Array(auction.description))}
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                auctionEnded ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {auctionEnded ? 'Ended' : 'Active'}
              </span>
              <span className="text-sm text-gray-500">
                Ends: {new Date(parseInt(auction.end_time)).toLocaleString()}
              </span>
            </div>
            
            {/* Countdown Timer */}
            {!auctionEnded && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Time Remaining:</h3>
                <div className="flex space-x-4 text-center">
                  <div className="bg-white p-2 rounded-md shadow">
                    <div className="text-2xl font-bold text-blue-600">{timeLeft.days}</div>
                    <div className="text-xs text-gray-500">Days</div>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow">
                    <div className="text-2xl font-bold text-blue-600">{timeLeft.hours}</div>
                    <div className="text-xs text-gray-500">Hours</div>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow">
                    <div className="text-2xl font-bold text-blue-600">{timeLeft.minutes}</div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow">
                    <div className="text-2xl font-bold text-blue-600">{timeLeft.seconds}</div>
                    <div className="text-xs text-gray-500">Seconds</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auction Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Auction Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Starting Bid:</span>
                    <p className="text-lg font-medium">{formatSui(auction.starting_bid)} SUI</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Current Highest Bid:</span>
                    <p className="text-2xl font-bold text-blue-600">{formatSui(getCurrentBid())} SUI</p>
                  </div>
                  {auction.highest_bidder && (
                    <div>
                      <span className="text-sm text-gray-500">Highest Bidder:</span>
                      <p className="text-sm font-mono break-all">{auction.highest_bidder}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">Total Bids:</span>
                    <p className="text-lg font-medium">{auction.bid_count || 0}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Bidding Interface */}
              <div>
                {!auctionEnded && !userIsCreator && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                          Bid Amount (SUI)
                        </label>
                        <input
                          type="number"
                          id="bidAmount"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={`Minimum: ${getMinimumBid()} SUI`}
                          min={getMinimumBid()}
                          step="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Minimum bid: {getMinimumBid()} SUI (whole numbers only)
                        </p>
                      </div>
                      <button
                        onClick={handlePlaceBid}
                        disabled={isPlacingBid || !bidAmount}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
                      </button>
                    </div>
                  </div>
                )}

                {auctionEnded && userIsWinner && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Congratulations!</h3>
                    <p className="text-green-700 mb-4">You won this auction!</p>
                    <button
                      onClick={handleClaimNft}
                      disabled={isClaiming}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClaiming ? 'Claiming...' : 'Claim NFT'}
                    </button>
                  </div>
                )}

                {auctionEnded && userIsCreator && auction.highest_bidder && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Auction Creator</h3>
                    <p className="text-blue-700 mb-4">
                      Your auction ended with a winning bid of {formatSui(getCurrentBid())} SUI
                    </p>
                    <button
                      onClick={handleClaimProceeds}
                      disabled={isClaiming}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClaiming ? 'Claiming...' : 'Claim Proceeds (After Grace Period)'}
                    </button>
                  </div>
                )}

                {userIsCreator && !auctionEnded && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">Your Auction</h3>
                    <p className="text-yellow-700">You cannot bid on your own auction.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NFT Details */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">NFT Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">NFT ID:</span>
                  <p className="text-sm font-mono break-all">{auction.nft_id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">NFT Type:</span>
                  <p className="text-sm font-mono break-all">{extractNftType(auctionData)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Creator:</span>
                  <p className="text-sm font-mono break-all">{auction.creator}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
