import { ArrowRight, CirclePlus, Gavel } from "lucide-react";
import heroImg from "../../../assets/images/hero-img.jpg";
import { AuctionCard } from "../../../components/miscellaneous/auction-card";
import { Link } from "react-router-dom";
import { NFTCollectionCard } from "../../../components/miscellaneous/nft-collection-card";
import { useEffect, useState } from "react";
import { SuiObjectResponse } from "@mysten/sui/client";
import { useAuctionHook } from "../../../hooks/use-create-auction";
import { IoMdBasket } from "react-icons/io";

export default function HomePage() {
  const [auctions, setAuctions] = useState<SuiObjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllAuctionsById } = useAuctionHook();

  const getAllAuctions = async () => {
    setLoading(true);
    try {
      const response = await getAllAuctionsById();
      if (response) {
        console.log("Fetched auctions:", response);
        setAuctions(response);
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAuctions();
  }, []);

  // Filter valid auctions for display
  const validAuctions = auctions.filter(auction => {
    const content = auction.data?.content;
    return content && "fields" in content;
  });

  return (
    <div className="container py-10 flex flex-col gap-10 md:gap-20">
      <div className="w-full flex flex-col md:flex-row items-start justify-between gap-10">
        <div className="flex flex-col items-start justify-start md:max-w-[450px] lg:max-w-[600px] gap-6 md:gap-10">
          <h1 className=" text-3xl md:text-4xl lg:text-6xl font-bold">
            Discover, Collect & Sell{" "}
            <span className="gradient-text">Extraordinary </span>
            Preditor Art & NFTs
          </h1>
          <p className="text-gray-500 text-lg">
            Explore the future of digital ownership on our secure blockchain
            marketplace. Bid, collect, and trade unique digital assets with
            ease.
          </p>
          <div className="flex justify-start items-center gap-5">
            <Link
              to={"/auctions"}
              className="shadow-lg shadow-gray-800/30 colored-btn"
            >
              <Gavel size={16} /> Explore Auctions
            </Link>
            <Link
              to={"/create"}
              className=" shadow-lg shadow-gray-800/30 shadow-btn"
            >
              <CirclePlus size={16} /> Create Auction
            </Link>
          </div>
          <div className="flex justify-start gap-6">
            {[
              { title: "Artworks", amount: "12K+" },
              { title: "Artists", amount: "3.5K+" },
              { title: "Auctions", amount: validAuctions.length.toString() },
            ].map((goal, index) => (
              <div key={index} className="flex flex-col gap-1">
                <p className="gradient-text font-bold text-xl">{goal.amount}</p>
                <p className="text-gray-500">{goal.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          className="border border-white shadow-xl shadow-blue-900/20 bg-cover bg-center h-full w-full min-h-[400px] md:min-h-[600px] rounded-2xl flex justify-center items-center relative overflow-hidden"
          style={{
            backgroundImage: `url(${heroImg})`,
          }}
        >
          <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-white/90 flex justify-end items-end">
            <div className="w-full flex flex-col md:flex-row justify-between items-start gap-3 md:items-center px-5 md:px-10 py-5">
              <div className="flex flex-col gap-2">
                <p className="text-xl font-medium text-black">
                  {validAuctions.length > 0 && validAuctions[0].data?.content && "fields" in validAuctions[0].data.content 
                    ? new TextDecoder().decode(new Uint8Array((validAuctions[0].data.content.fields as any).title))
                    : "Quantum Singularity #7"
                  }
                </p>

                <p className="text-gray-500">
                  Current bid:{" "}
                  <span className="text-gray-900 font-semibold">
                    {validAuctions.length > 0 && validAuctions[0].data?.content && "fields" in validAuctions[0].data.content
                      ? `${(Number((validAuctions[0].data.content.fields as any).current_bid) / 1_000_000_000).toFixed(4)} SUI`
                      : "4.85 SUI"
                    }
                  </span>
                </p>
              </div>
              <Link
                to={validAuctions.length > 0 && validAuctions[0].data?.content && "fields" in validAuctions[0].data.content 
                  ? `/auctions/${(validAuctions[0].data.content.fields as any).id.id}`
                  : "#"
                }
                className="shadow-lg shadow-gray-800/30 colored-btn text-sm"
              >
                <Gavel size={16} /> Place Bid
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-8">
        <div className="w-full flex flex-col justify-between md:flex-row gap-6 md:items-center">
          <div>
            <p className=" font-bold text-2xl">
              <span className="gradient-text">Live</span> Auctions
            </p>
            <p className="text-gray-500">
              Discover the most sought-after digital collectibles
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="w-full flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : validAuctions.length === 0 ? (
          <div className="w-full flex justify-center items-center py-20">
            <div className="max-w-[600px] flex flex-col gap-4 items-center text-center">
              <IoMdBasket size={160} className="text-gray-500" />
              <p className="text-3xl font-semibold">
                No auctions yet!
              </p>
              <p className="text-gray-500">
                There are currently no live auctions. Be the first to create one!
              </p>
              <Link
                to={"/create"}
                className="mt-4 shadow-lg shadow-gray-800/30 colored-btn"
              >
                <CirclePlus size={16} /> Create First Auction
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {validAuctions.slice(0, 8).map((auction, index) => {
              const content = auction.data?.content;
              if (!content || !("fields" in content)) return null;

              const fields = content.fields as any;
              console.log("Auction fields:", fields);
              
              return (
                <AuctionCard
                  id={fields.id.id}
                  key={index}
                  title={new TextDecoder().decode(new Uint8Array(fields.title)) || "Untitled NFT"}
                  current_bid={Number(fields.current_bid) / 1_000_000_000}
                  start_time={new Date(Number(fields.start_time)).toString()}
                  end_time={new Date(Number(fields.end_time)).toString()}
                  image={fields.nft?.fields?.nft?.fields?.image_url || "https://via.placeholder.com/300x300?text=NFT"}
                  num_of_bids={Number(fields.bid_count) || 0}
                  uploader={fields.creator || "Unknown"}
                />
              );
            })}
          </div>
        )}
        
        {validAuctions.length > 0 && (
          <div className="w-full mt-6 flex justify-center items-center">
            <Link
              to={"/auctions"}
              className=" shadow-lg shadow-gray-800/30 shadow-btn"
            >
              View All Auctions <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-8">
        <div className="w-full flex flex-col justify-between md:flex-row gap-6 md:items-center">
          <div>
            <p className=" font-bold text-2xl">
              Featured <span className="gradient-text">Collections</span>
            </p>
            <p className="text-gray-500">
              Curated collections from top creators
            </p>
          </div>
          <Link
            to="#"
            className="text-[#006fee] flex items-center gap-2 cursor-pointer"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <NFTCollectionCard
            title="Cybernetic Dreams"
            author="NeuralArtist"
            authorImage="https://randomuser.me/api/portraits/women/44.jpg"
            price={1.2}
            volume={245}
            growth="+12.5%"
            images={[
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXkITEKK3SCjn_c2urZf63bXQPXp0TbghRbg&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHa6jnSqW2aKYBeEZlwOlxzmz7hQTul97pA&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIv3trjKOAWT7XWfn5tOYopFd6G7Y3-deWQ&s",
              "https://t3.ftcdn.net/jpg/05/68/89/08/360_F_568890847_fIsHMTGFLAuaZQprCBmXHc0wCGSbgwQT.jpg",
            ]}
          />
          <NFTCollectionCard
            title="Quantum Artifacts"
            author="DigitalAlchemist"
            authorImage="https://randomuser.me/api/portraits/women/62.jpg"
            price={1.2}
            volume={245}
            growth="+12.5%"
            images={[
              "https://diginomica.com/sites/default/files/images/2023-11/Robot%20with%20bright%20yellow%20headphones%20and%20laptop%20on%20blue%20background%20%C2%A9%20lerbank-bbk22%20-%20Canva.com_.png",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHa6jnSqW2aKYBeEZlwOlxzmz7hQTul97pA&s",
              "https://foto.wuestenigel.com/wp-content/uploads/api2/robot-with-stethoscope-on-blue-background.jpeg",
              "https://t3.ftcdn.net/jpg/05/68/89/08/360_F_568890847_fIsHMTGFLAuaZQprCBmXHc0wCGSbgwQT.jpg",
            ]}
          />
          <NFTCollectionCard
            title="Ethereal Landscapes"
            author="VirtualDreamer"
            authorImage="https://randomuser.me/api/portraits/women/52.jpg"
            price={1.2}
            volume={245}
            growth="+12.5%"
            images={[
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtJStLRCwL7Pi5av7z55hLW3hFa_UjsgcKXA&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLFM8qcce5Tr9WSyzGpFEgucRj_tOko1irXw&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxmwhynrYh8Eviv6tloFw62PSYxlWCqc7iew&s",
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzg6YqxnmQm4hvoo288uJ-c5Ecjpk9TFessw&s",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
