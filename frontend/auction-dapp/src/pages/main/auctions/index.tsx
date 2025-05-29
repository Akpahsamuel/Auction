import { useState } from "react";
import { auctionData } from "../../../contexts/data";
import { AuctionCard } from "../../../components/miscellaneous/auction-card";
import { Gavel } from "lucide-react";
import { Button, DropdownMenu } from "@radix-ui/themes";

const categories = ["All NFTs", "Digital Art", "Collectibles"];
const ViewAuctions = () => {
  const [activeTab, setActiveTab] = useState("All NFTs");
  const [activeSort, setActiveSort] = useState("Price");
  return (
    <div className="container py-10 flex flex-col gap-10 md:gap-20">
      <div className="w-full flex flex-col items-start justify-start gap-8">
        <div className="w-full flex flex-col justify-between md:flex-row gap-6 md:items-center">
          <div>
            <p className=" font-semibold text-3xl">
              <span className="gradient-text">Live</span> Auctions
            </p>
            <p className="text-gray-500">
              Discover the most sought-after digital collectibles
            </p>
          </div>
          <button className="shadow-lg shadow-gray-800/30 colored-btn">
            <Gavel size={16} /> Create Auction
          </button>
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
                  Sort By: {activeSort}
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="2">
                {["Price", "Start Time", "End Time"].map((sort, index) => (
                  <DropdownMenu.Item
                    key={index}
                    className="!cursor-pointer"
                    onClick={() => setActiveSort(sort)}
                  >
                    {sort}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {auctionData.map((data, index) => (
            <AuctionCard key={index} {...data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAuctions;
