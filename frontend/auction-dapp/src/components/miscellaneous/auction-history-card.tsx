import React from "react";
import { Link } from "react-router-dom";
import { AuctionHistoryData } from "../../hooks/use-auction-history";

interface AuctionHistoryCardProps {
  historyData: AuctionHistoryData;
}

export const AuctionHistoryCard: React.FC<AuctionHistoryCardProps> = ({ historyData }) => {
  const formatAddress = (address: string) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = () => {
    const hasWinner = historyData.winner !== historyData.creator;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        hasWinner 
          ? "bg-green-100 text-green-800" 
          : "bg-gray-100 text-gray-800"
      }`}>
        {hasWinner ? "Sold" : "No Bids"}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* NFT Image */}
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={historyData.nftImageUrl || "/api/placeholder/300/300"}
          alt={historyData.nftName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/api/placeholder/300/300";
          }}
        />
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Title and Status */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
            {historyData.title}
          </h3>
          {getStatusBadge()}
        </div>

        {/* NFT Name */}
        <p className="text-sm text-gray-600 mb-3 truncate">
          {historyData.nftName}
        </p>

        {/* Auction Results */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Starting Bid:</span>
            <span className="text-sm font-medium">{historyData.startingBid.toFixed(2)} SUI</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Final Bid:</span>
            <span className="text-lg font-bold text-blue-600">
              {historyData.finalBid.toFixed(2)} SUI
            </span>
          </div>

          {historyData.totalBids > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Bids:</span>
              <span className="text-sm font-medium">{historyData.totalBids}</span>
            </div>
          )}
        </div>

        {/* Winner Info */}
        {historyData.winner !== historyData.creator && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Winner:</p>
            <p className="text-sm font-medium text-gray-900">
              {formatAddress(historyData.winner)}
            </p>
          </div>
        )}

        {/* Auction Dates */}
        <div className="space-y-1 text-xs text-gray-500 mb-4">
          <p>Started: {formatDate(historyData.startTime)}</p>
          <p>Ended: {formatDate(historyData.endTime)}</p>
          <p>Completed: {formatDate(historyData.completionTime)}</p>
        </div>

        {/* Creator Info */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500">Created by:</p>
          <p className="text-sm font-medium text-gray-700">
            {formatAddress(historyData.creator)}
          </p>
        </div>

        {/* View Details Link */}
        <Link
          to={`/auction-history/${historyData.id}`}
          className="block w-full mt-4 text-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}; 