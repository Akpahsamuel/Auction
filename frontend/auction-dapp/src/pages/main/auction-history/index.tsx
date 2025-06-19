import { useEffect, useState } from "react";
import { useAuctionHistory, AuctionHistoryData } from "../../../hooks/use-auction-history";
import { AuctionHistoryCard } from "../../../components/miscellaneous/auction-history-card";
import { SuiObjectData } from "@mysten/sui/client";
import { Archive, TrendingUp, Users, DollarSign } from "lucide-react";
import { Button, DropdownMenu } from "@radix-ui/themes";

const sortOptions = [
  { value: "completion_time", label: "Recently Completed" },
  { value: "final_bid", label: "Highest Price" },
  { value: "total_bids", label: "Most Bids" },
  { value: "start_time", label: "Start Date" },
];

const AuctionHistoryPage = () => {
  const [historyData, setHistoryData] = useState<AuctionHistoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("completion_time");
  const [searchTerm, setSearchTerm] = useState("");

  const { getAllAuctionHistory, error } = useAuctionHistory();

  const fetchAuctionHistory = async () => {
    setLoading(true);
    try {
      // Get all auction history objects
      const historyObjects: SuiObjectData[] = await getAllAuctionHistory();
      
      // Parse the auction history data
      const parsedHistoryData: AuctionHistoryData[] = historyObjects
        .map(obj => {
          if (!obj.content || !("fields" in obj.content)) return null;
          
          const fields = obj.content.fields as any;
          
          return {
            id: fields.id.id,
            originalAuctionId: fields.original_auction_id,
            creator: fields.creator,
            title: fields.title,
            description: fields.description,
            startingBid: Number(fields.starting_bid) / 1_000_000_000, // Convert MIST to SUI
            finalBid: Number(fields.final_bid) / 1_000_000_000, // Convert MIST to SUI
            winner: fields.winner,
            startTime: Number(fields.start_time),
            endTime: Number(fields.end_time),
            completionTime: Number(fields.completion_time),
            totalBids: Number(fields.total_bids),
            uniqueBidders: Number(fields.unique_bidders),
            nftId: fields.nft_id,
            nftType: fields.nft_type,
            nftName: fields.nft_name,
            nftDescription: fields.nft_description,
            nftImageUrl: fields.nft_image_url,
          };
        })
        .filter((item): item is AuctionHistoryData => item !== null);

      setHistoryData(parsedHistoryData);
    } catch (error) {
      console.error("Error fetching auction history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionHistory();
  }, []);

  // Sort and filter history data
  const filteredAndSortedData = historyData
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nftName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "final_bid":
          return b.finalBid - a.finalBid;
        case "total_bids":
          return b.totalBids - a.totalBids;
        case "start_time":
          return b.startTime - a.startTime;
        case "completion_time":
        default:
          return b.completionTime - a.completionTime;
      }
    });

  // Calculate statistics
  const totalVolume = historyData.reduce((sum, item) => sum + item.finalBid, 0);
  const averagePrice = historyData.length > 0 ? totalVolume / historyData.length : 0;
  const totalBids = historyData.reduce((sum, item) => sum + item.totalBids, 0);
  const successfulAuctions = historyData.filter(item => item.winner !== item.creator).length;

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="w-full flex flex-col items-start justify-start gap-8">
        <div className="w-full flex flex-col justify-between md:flex-row gap-6 md:items-center">
          <div>
            <p className="font-semibold text-3xl">
              <span className="gradient-text">Auction</span> History
            </p>
            <p className="text-gray-500">
              Browse completed auctions and past sales
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{successfulAuctions}</p>
              </div>
              <Archive className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">{totalVolume.toFixed(2)} SUI</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Price</p>
                <p className="text-2xl font-bold text-gray-900">{averagePrice.toFixed(2)} SUI</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bids</p>
                <p className="text-2xl font-bold text-gray-900">{totalBids}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="w-full flex flex-col-reverse md:flex-row gap-5 items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing {filteredAndSortedData.length} of {historyData.length} completed auctions
            </p>
          </div>
          
          <div className="w-full flex justify-end items-center gap-4">
            <input
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-[360px] py-3 rounded-full px-4 bg-gray-100 focus:outline focus:outline-[#006eff] text-gray-500"
            />
            
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button
                  variant="soft"
                  size="4"
                  className="!rounded-full !text-gray-500 !bg-gray-100 !cursor-pointer !text-sm"
                >
                  {sortOptions.find(opt => opt.value === sortBy)?.label || "Sort By"}
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="2">
                {sortOptions.map((option) => (
                  <DropdownMenu.Item
                    key={option.value}
                    className="!cursor-pointer"
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Auction History Grid */}
        {filteredAndSortedData.length === 0 ? (
          <div className="flex justify-center items-center w-full h-full">
            <div className="py-10 max-w-[600px] flex flex-col gap-4 items-center">
              <Archive size={160} className="text-gray-500" />
              <p className="text-3xl font-semibold">
                No completed auctions yet!
              </p>
              <p className="text-gray-500 text-center">
                Completed auctions will appear here once users finish claiming their NFTs or proceeds.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndSortedData.map((historyItem) => (
              <AuctionHistoryCard
                key={historyItem.id}
                historyData={historyItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionHistoryPage; 