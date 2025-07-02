import { Eye, Gavel, X, Clock, User, TrendingUp, Calendar, ExternalLink } from "lucide-react";
import moment from "moment";
import suiIcon from "../../assets/icons/sui-icon.png";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const isCurrentUserCreator = () => {
    return currentAccount?.address === uploader;
  };

  const canCancelAuction = () => {
    const isCreator = isCurrentUserCreator();
    // Convert to number to handle different data types from blockchain
    const bidCount = Number(num_of_bids) || 0;
    const noBids = bidCount === 0;
    const notEnded = new Date() < new Date(end_time);
    
    return isCreator && noBids && notEnded;
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const endDate = new Date(end_time);
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/auctions/${id}`);
  };

  const handlePlaceBid = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/auctions/${id}#bid`);
  };

  const handleViewOnBlockchain = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Open SuiScan (Sui blockchain explorer) for the auction object
    const explorerUrl = `https://suiscan.xyz/devnet/object/${id}`;
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 relative group">
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

      {/* Status badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {isCurrentUserCreator() && (
          <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Your Auction
          </div>
        )}
      </div>

      {/* Clickable card area */}
      <div 
        className="cursor-pointer hover:scale-[1.02] transition-transform duration-300"
        onClick={handleViewDetails}
      >
        {/* Image with overlay */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt="NFT Preview"
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              (e.target as HTMLImageElement).src = "/api/placeholder/300/300";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Overlay information */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-black/40 rounded-full px-3 py-1">
                <TrendingUp size={14} />
                <span className="text-sm font-medium">{num_of_bids} bids</span>
              </div>
              <div className="flex items-center gap-1 bg-blue-500/90 rounded-full px-3 py-1">
                <Clock size={14} />
                <span className="text-sm font-medium">{getTimeRemaining()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* Creator info */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={14} />
            <span className="truncate">
              by {uploader === currentAccount?.address ? "You" : `${uploader.slice(0, 6)}...${uploader.slice(-4)}`}
            </span>
          </div>

          {/* Bid information */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Bid</p>
              <div className="flex items-center gap-2">
                <img src={suiIcon} className="w-5 h-5" alt="SUI" />
                <span className="font-bold text-lg text-gray-900">{current_bid}</span>
                <span className="text-sm text-gray-500">SUI</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Ends</p>
              <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <Calendar size={14} />
                <span>{moment(end_time).format("MMM DD, HH:mm")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 pt-0 space-y-2 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleViewDetails}
            className="cursor-pointer flex-1 bg-blue-50 text-blue-600 border border-blue-200 py-3 px-4 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
          <button 
            onClick={handlePlaceBid}
            className="cursor-pointer flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            <Gavel size={16} />
            <span>Place Bid</span>
          </button>
        </div>

        {/* Blockchain explorer link */}
        <button 
          onClick={handleViewOnBlockchain}
          className="cursor-pointer w-full bg-gray-50 text-gray-600 border border-gray-200 py-2 px-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          title="View auction on Sui blockchain explorer"
        >
          <ExternalLink size={14} />
          <span>View on Blockchain</span>
        </button>

        {/* Additional status information */}
        <div className="text-center">
          {isCurrentUserCreator() && (
            <div className="text-xs bg-purple-100 text-purple-700 py-2 px-3 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Your auction {canCancelAuction() && "• Can be cancelled"}
              </div>
            </div>
          )}
          {!isCurrentUserCreator() && (
            <div className="text-xs bg-blue-100 text-blue-700 py-2 px-3 rounded-lg">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Active auction • Place your bid now
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
