import { Eye, Gavel, X } from "lucide-react";
import { FiClock } from "react-icons/fi";
import moment from "moment";
import suiIcon from "../../assets/icons/sui-icon.png";
import { Link } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useBidHook } from "../../hooks/use-bid";
import { useState } from "react";

export interface AuctionCardType {
  id: string;
  title: string;
  desc?: string;
  current_bid: number;
  start_time: string;
  end_time: string;
  image: string;
  num_of_bids: number;
  uploader: string;
  nftType?: string;
  onCancelSuccess?: () => void;
}

export function AuctionCard({
  id,
  title,
  current_bid,
  start_time,
  end_time,
  image,
  num_of_bids,
  uploader,
  nftType,
  onCancelSuccess,
}: AuctionCardType) {
  const currentAccount = useCurrentAccount();
  const { cancelAuction } = useBidHook();
  const [isCanceling, setIsCanceling] = useState(false);

  const isCurrentUserCreator = () => {
    return currentAccount?.address === uploader;
  };

  const canCancelAuction = () => {
    const isCreator = isCurrentUserCreator();
    // Convert to number to handle different data types from blockchain
    const bidCount = Number(num_of_bids) || 0;
    const noBids = bidCount === 0;
    const notEnded = new Date() < new Date(end_time);
    
    console.log('AuctionCard canCancelAuction debug:', {
      isCreator,
      bidCount,
      bidCountRaw: num_of_bids,
      bidCountType: typeof num_of_bids,
      noBids,
      notEnded,
      result: isCreator && noBids && notEnded
    });
    
    return isCreator && noBids && notEnded;
  };

  const handleCancelAuction = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling

    if (!nftType) {
      alert("NFT type not available for cancellation");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this auction? This action cannot be undone and your NFT will be returned to you."
    );
    
    if (!confirmed) return;

    setIsCanceling(true);
    try {
      await cancelAuction(id, nftType);
      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (error) {
      console.error("Failed to cancel auction:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 relative">
      {/* Cancel button for creators - positioned absolutely */}
      {canCancelAuction() && (
        <button
          onClick={handleCancelAuction}
          disabled={isCanceling}
          className="absolute top-3 left-3 z-10 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Cancel Auction (No bids placed)"
        >
          {isCanceling ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <X size={16} />
          )}
        </button>
      )}

      <Link to={`/auctions/${id}`}>
        {/* Image with badge */}
        <div className="relative h-fit">
          <img
            src={image}
            alt="NFT Preview"
            className="h-64 w-full object-cover"
          />
          <div className="w-full h-full absolute top-0 bg-gradient-to-b from-transparent to-white/90 bottom-0"></div>
          <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {num_of_bids} bids
          </span>
        </div>

        {/* Content */}
        <div className="p-2 flex flex-col gap-3">
          {/* Title & Timer */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-md text-gray-800 truncate">
              {title}
            </h3>
            <span className="flex items-center text-xs text-purple-500 font-medium bg-purple-100 px-2 py-0.5 rounded-full">
              <FiClock className="mr-1" />
              {moment(start_time).format("LT")}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-3 max-w-full truncate">
            by {uploader}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500">Current Bid</p>
              <div className="flex items-center gap-1 font-semibold text-lg">
                <img src={suiIcon} className="w-5 h-5" />
                {current_bid}{" "}
                <span className="text-xs text-gray-500 font-normal"> SUI</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Ending at</p>
              <div className="text-sm text-blue-500 font-medium text-end">
                {moment(end_time).format("LT")}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="text-[#006fee] h-[40px] rounded-xl bg-[#006fee]/20 font-semibold cursor-pointer hover:opacity-80 transition-all duration-300 flex justify-center gap-1.5 items-center w-full text-[8px]">
              <Eye size={14} />{" "}
              <span className="text-[14px]">View Details</span>
            </button>
            <button className="bg-[#006fee] h-[40px] rounded-xl text-white font-semibold cursor-pointer hover:opacity-80 transition-all duration-300 flex justify-center gap-1.5 items-center w-full text-[8px] shadow-md shadow-black/20">
              <Gavel size={14} /> <span className="text-[14px]">Place Bid</span>
            </button>
          </div>

          {/* Creator status indicator */}
          {isCurrentUserCreator() && (
            <div className="text-xs text-center py-1 bg-yellow-100 text-yellow-800 rounded-md">
              Your Auction {canCancelAuction() && "• Can Cancel"}
              {/* Debug info */}
              <div className="mt-1 text-[10px] text-gray-600">
                Bids: {num_of_bids} | Ended: {new Date() >= new Date(end_time) ? 'Yes' : 'No'} | Can Cancel: {canCancelAuction() ? 'Yes' : 'No'}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
