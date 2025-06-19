import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuctionHistory, AuctionHistoryData, BidEntry } from "../../../hooks/use-auction-history";
import { ArrowLeft, Calendar, Gavel, Trophy, Users, Clock, ExternalLink } from "lucide-react";
import { Button } from "@radix-ui/themes";

const AuctionHistoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [historyData, setHistoryData] = useState<AuctionHistoryData | null>(null);
  const [bidHistory, setBidHistory] = useState<BidEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const { getAuctionHistoryById, getAuctionHistoryBids } = useAuctionHistory();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const history = await getAuctionHistoryById(id);
        setHistoryData(history);

        // Try to get bid history
        const bids = await getAuctionHistoryBids(id);
        setBidHistory(bids);
      } catch (error) {
        console.error("Error fetching auction history details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatAddress = (address: string) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAuctionDuration = () => {
    if (!historyData) return "";
    const duration = historyData.endTime - historyData.startTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours % 24} hour${(hours % 24) !== 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!historyData) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <p className="text-xl text-gray-600">Auction history not found</p>
          <Link
            to="/auction-history"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to Auction History
          </Link>
        </div>
      </div>
    );
  }

  const isSuccessful = historyData.winner !== historyData.creator;

  return (
    <div className="container py-10">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/auction-history"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Auction History
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - NFT Info */}
        <div className="space-y-6">
          {/* NFT Image */}
          <div className="aspect-square w-full max-w-lg mx-auto overflow-hidden rounded-lg bg-gray-100">
            <img
              src={historyData.nftImageUrl || "/api/placeholder/500/500"}
              alt={historyData.nftName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/api/placeholder/500/500";
              }}
            />
          </div>

          {/* NFT Details */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">NFT Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{historyData.nftName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Description</label>
                <p className="text-gray-700">{historyData.nftDescription}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Type</label>
                <p className="font-mono text-sm">{historyData.nftType}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">NFT ID</label>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {formatAddress(historyData.nftId)}
                  </code>
                  <Button size="1" variant="ghost">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Auction Info */}
        <div className="space-y-6">
          {/* Auction Title and Status */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold">{historyData.title}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isSuccessful 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                <Trophy className="h-4 w-4 mr-1" />
                {isSuccessful ? "Sold" : "No Bids"}
              </span>
            </div>
            <p className="text-gray-600">{historyData.description}</p>
          </div>

          {/* Price Information */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Price Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Starting Bid</label>
                <p className="text-xl font-bold">{historyData.startingBid.toFixed(2)} SUI</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Final Price</label>
                <p className="text-2xl font-bold text-blue-600">
                  {historyData.finalBid.toFixed(2)} SUI
                </p>
              </div>
            </div>
            
            {isSuccessful && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Price increase: {((historyData.finalBid - historyData.startingBid) / historyData.startingBid * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>

          {/* Bidding Statistics */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Bidding Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Gavel className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Total Bids</p>
                  <p className="text-xl font-bold">{historyData.totalBids}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Unique Bidders</p>
                  <p className="text-xl font-bold">{historyData.uniqueBidders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Auction Started</p>
                  <p className="text-sm text-gray-500">{formatDate(historyData.startTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-sm text-gray-500">{getAuctionDuration()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gavel className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Auction Ended</p>
                  <p className="text-sm text-gray-500">{formatDate(historyData.endTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">Completed</p>
                  <p className="text-sm text-gray-500">{formatDate(historyData.completionTime)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Winner/Creator Information */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Participants</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Creator</label>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {formatAddress(historyData.creator)}
                  </code>
                  <Button size="1" variant="ghost">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {isSuccessful && (
                <div>
                  <label className="text-sm text-gray-500">Winner</label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-green-100 px-2 py-1 rounded">
                      {formatAddress(historyData.winner)}
                    </code>
                    <Button size="1" variant="ghost">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bid History Section */}
          {bidHistory.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Bid History</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bidHistory.map((bid, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <code className="text-sm">{formatAddress(bid.bidder)}</code>
                      <p className="text-xs text-gray-500">{formatDate(bid.timestamp)}</p>
                    </div>
                    <p className="font-bold text-blue-600">{bid.amount.toFixed(2)} SUI</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionHistoryDetailPage; 