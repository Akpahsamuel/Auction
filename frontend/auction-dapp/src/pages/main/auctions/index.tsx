import { useEffect, useState } from "react";
import { SuiObjectResponse } from "@mysten/sui/client";
// import { auctionData } from "../../../contexts/data";
import { AuctionCard } from "../../../components/miscellaneous/auction-card";
import { IoMdBasket } from "react-icons/io";
import { Gavel, History } from "lucide-react";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useAuctionHook } from "../../../hooks/use-create-auction";
import { safeMistToSui } from "../../../utils/currency";

const categories = ["All NFTs", "Digital Art", "Collectibles"];
const auctionTabs = ["Active", "Completed"];

const ViewAuctions = () => {
  const [activeTab, setActiveTab] = useState("All NFTs");
  const [auctionTab, setAuctionTab] = useState("Active");
  const [auctions, setAuctions] = useState<SuiObjectResponse[]>([]);
  const [auctionHistories, setAuctionHistories] = useState<SuiObjectResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { getAllAuctionsById, getAllAuctionHistories } = useAuctionHook();

  const getAllAuctions = async () => {
    setLoading(true);
    try {
      const response = await getAllAuctionsById();
      if (response) {
        console.log("Active auctions:", response);
        setAuctions(response);
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllHistories = async () => {
    setLoading(true);
    try {
      const response = await getAllAuctionHistories();
      if (response) {
        console.log("Auction histories:", response);
        setAuctionHistories(response);
      }
    } catch (error) {
      console.error("Error fetching auction histories:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractNftType = (auctionData: SuiObjectResponse) => {
    if (auctionData?.data?.type) {
      const typeString = auctionData.data.type;
      const match = typeString.match(/<(.+)>/);
      return match ? match[1] : "";
    }
    return "";
  };

  const handleCancelSuccess = () => {
    // Refresh the auctions list after successful cancellation
    getAllAuctions();
  };

  useEffect(() => {
    if (auctionTab === "Active") {
      getAllAuctions();
    } else {
      getAllHistories();
    }
  }, [auctionTab]);

  const currentData = auctionTab === "Active" ? auctions : auctionHistories;
  const isHistoryView = auctionTab === "Completed";

  if (loading) {
    return (
      <div className="container py-10 flex flex-col gap-10 md:gap-20">
        <div className="w-full flex flex-col items-start justify-start gap-8">
          <div className="w-full flex flex-col justify-between md:flex-row gap-6 md:items-center">
            <div>
              <p className=" font-semibold text-3xl">
                <span className="gradient-text">{auctionTab}</span> Auctions
              </p>
              <p className="text-gray-500">
                {auctionTab === "Active" 
                  ? "Discover the most sought-after digital collectibles" 
                  : "Browse completed auction histories"}
              </p>
            </div>
            <Link
              to={"/create"}
              className="shadow-lg shadow-gray-800/30 colored-btn"
            >
              <Gavel size={16} /> Create Auction
            </Link>
          </div>
          <div className="flex justify-center items-center w-full h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 flex flex-col gap-10 md:gap-20">
      <div className="w-full flex flex-col items-start justify-start gap-8">
        <div className="w-full flex flex-col justify-between md:flex-row gap-6 md:items-center">
          <div>
            <p className=" font-semibold text-3xl">
              <span className="gradient-text">{auctionTab}</span> Auctions
            </p>
            <p className="text-gray-500">
              {auctionTab === "Active" 
                ? "Discover the most sought-after digital collectibles" 
                : "Browse completed auction histories"}
            </p>
          </div>
          <Link
            to={"/create"}
            className="shadow-lg shadow-gray-800/30 colored-btn"
          >
            <Gavel size={16} /> Create Auction
          </Link>
        </div>

        {/* Auction Status Tabs */}
        <div className="w-full flex flex-col gap-4">
          <div className="max-w-full min-w-fit inline-flex bg-gray-100 rounded-full p-1 gap-1">
            {auctionTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setAuctionTab(tab)}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/60 flex items-center gap-2
            ${
              auctionTab === tab
                ? "bg-white shadow-sm text-black"
                : "text-gray-600 hover:text-black"
            }`}
              >
                {tab === "Active" ? <Gavel size={14} /> : <History size={14} />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col-reverse md:flex-row gap-5 items-center justify-between">
          <div className="max-w-full min-w-fit inline-flex bg-gray-100 rounded-full p-1 gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 cursor-pointer hover:bg-white/60
            ${
              activeTab === category
                ? "bg-white shadow-sm text-black"
                : "text-gray-600 hover:text-black"
            }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="w-full flex justify-end items-center gap-4">
            <input
              type="text"
              placeholder="Search NFT"
              className="w-full max-w-[360px] py-3 rounded-full px-4 bg-gray-100 focus:outline focus:outline-[#006eff] text-gray-500"
            />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button
                  variant="soft"
                  size="4"
                  className="!rounded-full !text-gray-500 !bg-gray-100 !cursor-pointer !text-sm"
                >
                  Sort By
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="2">
                {["Price", "Start Time", "End Time"].map((sort, index) => (
                  <DropdownMenu.Item key={index} className="!cursor-pointer">
                    {sort}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
        
        {currentData.length === 0 ? (
          <div className="flex justify-center items-center w-full h-full">
            <div className="py-10 max-w-[600px] flex flex-col gap-4 items-center">
              <IoMdBasket size={160} className="text-gray-500" />
              <p className="text-3xl font-semibold">
                {auctionTab === "Active" 
                  ? "Ooops!!! Nothing is here yet!" 
                  : "No completed auctions yet!"}
              </p>
              <p className="text-gray-500 text-center">
                {auctionTab === "Active" 
                  ? "There are currently no active auctions yet, click on the create auction button to place an item on auction!"
                  : "No auctions have been completed yet. Once auctions end and NFTs are claimed, they'll appear here."}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentData?.map((data, index) => {
              const content = data.data?.content;
              if (!content || !("fields" in content)) return null;

              const fields = content.fields as any;
              console.log("content", content);
              console.log("fields", fields);
              
              if (isHistoryView) {
                // Handle auction history data structure
                console.log("History auction fields:", fields);
                console.log("Raw auction history data:", data);
                
                // Use the utility function to safely convert final_bid from MIST to SUI
                const finalBidSui = safeMistToSui(fields.final_bid, 0);
                
                // Validate other fields that might cause issues
                const totalBids = Number(fields.total_bids) || 0;
                const startTime = Number(fields.start_time) || Date.now();
                const endTime = Number(fields.end_time) || Date.now();
                const completionTime = Number(fields.completion_time) || Date.now();
                
                console.log("Final bid conversion:", {
                  originalValue: fields.final_bid,
                  convertedValue: finalBidSui,
                  auctionId: fields.original_auction_id,
                  totalBids,
                  title: fields.title,
                  creator: fields.creator,
                  winner: fields.winner
                });
                
                return (
                  <AuctionCard
                    id={fields.original_auction_id || fields.id?.id}
                    key={index}
                    title={fields.title || "Completed Auction"}
                    current_bid={finalBidSui}
                    start_time={new Date(startTime).toString()}
                    end_time={new Date(endTime).toString()}
                    image="/api/placeholder/300/300" // Placeholder since NFT is no longer in history
                    num_of_bids={totalBids}
                    uploader={fields.creator || "Unknown"}
                    nftType="Completed"
                    onCancelSuccess={handleCancelSuccess}
                    isCompleted={true}
                    winner={fields.winner || "Unknown"}
                    completionTime={new Date(completionTime).toString()}
                  />
                );
              } else {
                // Handle active auction data structure
                console.log("Active auction fields:", fields);
                
                // Use the utility function to safely convert current_bid from MIST to SUI
                const currentBidSui = safeMistToSui(fields.current_bid, 0);
                
                return (
                  <AuctionCard
                    id={fields.id.id}
                    key={index}
                    title={fields.title || ""}
                    current_bid={currentBidSui}
                    start_time={new Date(Number(fields.start_time)).toString()}
                    end_time={new Date(Number(fields.end_time)).toString()}
                    image={fields.nft?.fields?.nft?.fields?.image_url || "/api/placeholder/300/300"}
                    num_of_bids={Number(fields.bid_count) || 0}
                    uploader={fields.creator || ""}
                    nftType={extractNftType(data)}
                    onCancelSuccess={handleCancelSuccess}
                    isCompleted={false}
                  />
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAuctions;
