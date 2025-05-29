import { Eye, Gavel } from "lucide-react";
import { FaEthereum } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import moment from "moment";

export interface AuctionCardType {
  title: string;
  desc?: string;
  current_bid: number;
  start_time: string;
  end_time: string;
  image: string;
  num_of_bids: number;
  uploader: string;
}

export function AuctionCard({
  title,
  current_bid,
  start_time,
  end_time,
  image,
  num_of_bids,
  uploader,
}: AuctionCardType) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500">
      {/* Image with badge */}
      <div className="relative h-fit">
        <img
          src={image} // 👈 Replace with actual image path
          alt="NFT Preview"
          className="h-64 w-full object-cover"
        />
        <div className="w-full h-full absolute top-0 bg-gradient-to-b from-transparent to-white/90"></div>
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

        <p className="text-sm text-gray-500 mb-3">by {uploader}</p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Current Bid</p>
            <div className="flex items-center font-semibold text-lg">
              <FaEthereum className="text-gray-800 mr-1" />
              {current_bid}{" "}
              <span className="text-xs text-gray-500 font-normal"> ETH</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Ending In</p>
            <div className="text-sm text-blue-500 font-medium text-end">
              {moment(end_time).format("LT")}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="text-[#006fee] h-[40px] rounded-xl bg-[#006fee]/20 font-semibold cursor-pointer hover:opacity-80 transition-all duration-300 flex justify-center gap-1.5 items-center w-full text-[8px]">
            <Eye size={14} /> <span className="text-[14px]">View Details</span>
          </button>
          <button className="bg-[#006fee] h-[40px] rounded-xl text-white font-semibold cursor-pointer hover:opacity-80 transition-all duration-300 flex justify-center gap-1.5 items-center w-full text-[8px] shadow shadow-md shadow-black/20">
            <Gavel size={14} /> <span className="text-[14px]">Place Bid</span>
          </button>
        </div>
      </div>
    </div>
  );
}
