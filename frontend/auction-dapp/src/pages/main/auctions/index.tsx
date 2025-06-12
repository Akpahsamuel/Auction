import { useEffect, useState } from "react";
import { SuiObjectResponse } from "@mysten/sui/client";
// import { auctionData } from "../../../contexts/data";
import { AuctionCard } from "../../../components/miscellaneous/auction-card";
import { IoMdBasket } from "react-icons/io";
import { Gavel } from "lucide-react";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useAuctionHook } from "../../../hooks/use-create-auction";

const categories = ["All NFTs", "Digital Art", "Collectibles"];
const ViewAuctions = () => {
  const [activeTab, setActiveTab] = useState("All NFTs");
  const [auctions, setAuctions] = useState<SuiObjectResponse[]>([]);
  const { getAllAuctionsById } = useAuctionHook();

  const getAllAuctions = async () => {
    const response = await getAllAuctionsById();
    if (response) {
      console.log(response);
      setAuctions(response);
    }
  };

  useEffect(() => {
    getAllAuctions();
  }, []);

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
          <Link
            to={"/create"}
            className="shadow-lg shadow-gray-800/30 colored-btn"
          >
            <Gavel size={16} /> Create Auction
          </Link>
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {auctions?.map((data, index) => {
            const content = data.data?.content;
            if (!content || !("fields" in content))
              return (
                <div className="flex justify-center items-center w-full h-full">
                  <div className="py-10 max-w-[600px] flex flex-col gap-4 items-center">
                    <IoMdBasket size={160} className="text-gray-500" />
                    <p className="text-3xl font-semibold">
                      Ooops!!! Nothing is here yet!
                    </p>
                    <p className="text-gray-500 text-center">
                      There are currently no created auction yet, click on the
                      create auction button to place an item on auction!
                    </p>
                  </div>
                </div>
              );

            const fields = content.fields as any;
            console.log("content", content);
            console.log("fields", fields);
            return (
              <AuctionCard
                id={fields.id.id}
                key={index}
                title={fields.title || ""}
                current_bid={Number(fields.current_bid) / 1_000_000_000}
                start_time={new Date(Number(fields.start_time)).toString()}
                end_time={new Date(Number(fields.end_time)).toString()}
                image={fields.nft.fields.nft.fields.image_url}
                num_of_bids={Number(fields.bid_count) || 0}
                uploader={fields.creator || ""}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewAuctions;
