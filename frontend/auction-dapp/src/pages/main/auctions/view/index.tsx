import { useEffect, useState } from "react";
import { useAuctionHook } from "../../../../hooks/use-create-auction";
import { useParams } from "react-router-dom";
import { MoveStruct } from "@mysten/sui/client";
import { Clock, Gavel } from "lucide-react";
import suiIcon from ".././../../../assets/icons/sui-icon.png";
import { TbMoodEmpty } from "react-icons/tb";

const Index = () => {
  const [details, setDetails] = useState<MoveStruct>();
  const [endTime, setEndTime] = useState<number | null>(null);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const { getAuctionDetailById } = useAuctionHook();
  const { id } = useParams();

  const getAuctionDetail = async () => {
    const result = await getAuctionDetailById(id as string);
    const content = result.data?.content;
    if (!content || !("fields" in content)) {
      setDetails({});
    } else {
      setDetails(content.fields);

      setEndTime(
        "end_time" in content.fields ? Number(content.fields.end_time) : null,
      );
    }
  };

  const getImageUrl = (obj: any) => {
    return obj?.nft?.fields?.nft?.fields?.image_url || "";
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;
      console.log(diff);

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setAuctionEnded(true);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      console.log(d, h, m, s);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, details]);

  useEffect(() => {
    getAuctionDetail();
  }, []);
  return (
    <div className="container py-10 flex flex-col gap-10 md:gap-20">
      <div className="flex flex-col md:flex-row justify-center items-start gap-y-6 gap-x-10 w-full">
        <div className="flex flex-col justify-center items-center gap-10 w-full">
          <div className="overflow-hidden border border-white shadow-xl shadow-blue-900/20 bg-cover bg-center h-full w-full min-h-[400px] md:min-h-[600px] rounded-2xl relative ">
            <img
              src={getImageUrl(details)}
              alt="NFT Preview"
              className="w-full object-cover"
            />
          </div>
          <div className="hidden md:flex w-full rounded-2xl shadow-xl bg-white p-5 flex-col gap-5">
            <div className="flex gap-3">
              <div className="rounded-full w-12 h-12 bg-gray-300"></div>
              <div>
                <p className="text-gray-500">Creator:</p>
                <p className="text-lg">
                  {" "}
                  {details && "creator" in details
                    ? String(details.creator)
                    : ""}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-semibold">
                {details && "title" in details ? String(details.title) : ""}
              </h3>
              <p className="text-lg text-gray-500">
                {details && "description" in details
                  ? String(details.description)
                  : ""}
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <h5 className="text-xl font-medium">Bid History</h5>
              <div className="w-full flex justify-center items-center">
                {details &&
                "bid_history" in details &&
                Array.isArray(details.bid_history) &&
                details.bid_history.length !== 0 ? (
                  <div>History Loading...</div>
                ) : (
                  <div className="w-full flex flex-col gap-2 py-5 items-center bg-gray-50 rounded-sm">
                    <TbMoodEmpty size={80} />
                    <p className="text-center">
                      Oops! No bid has been placed on this auction!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:sticky top-28 max-w-[400px] bg-white shadow-md p-5 rounded-2xl flex flex-col gap-5">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-gray-500">Current Bid:</p>
              <div className="flex items-center gap-1 font-semibold text-xl">
                <img src={suiIcon} className="w-6 h-6" />
                {details && "current_bid" in details
                  ? Number(details.current_bid) / 1000000000
                  : 0}{" "}
                <span className="text-xs text-gray-500 font-normal"> SUI</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-500">Total Bids:</p>
              <div className="flex items-center gap-1 font-semibold text-xl">
                {details && "bid_count" in details
                  ? Number(details.bid_count)
                  : 0}{" "}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg w-full flex flex-col gap-3">
            <h2 className="text-lg font-bold mb-2 flex gap-2 items-center">
              <Clock /> Auction {auctionEnded ? "Ended" : `Ends In`}
            </h2>
            <div
              className={`flex justify-between text-center mb-2 gap-2 ${auctionEnded ? "opacity-25" : ""}`}
            >
              {["days", "hours", "minutes", "seconds"].map((unit) => (
                <div key={unit} className="p-2 bg-gray-100 w-full rounded-md">
                  <div className="text-2xl font-semibold">
                    {String(timeLeft[unit as keyof typeof timeLeft]).padStart(
                      2,
                      "0",
                    )}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">{unit}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-[0.5px] w-full bg-gray-300"></div>
          <button
            disabled={auctionEnded}
            className="bg-[#006fee] h-[40px] rounded-xl text-white font-semibold cursor-pointer hover:opacity-80 transition-all duration-300 flex justify-center gap-1.5 items-center w-full text-[8px] shadow-md shadow-black/20 disabled:opacity-30"
          >
            <Gavel size={14} /> <span className="text-[14px]">Place Bid</span>
          </button>
        </div>
        <div className=" md:hidden w-full rounded-2xl shadow-xl bg-white p-5 flex-col gap-5">
          <div className="flex gap-3">
            <div className="rounded-full w-12 h-12 bg-gray-300"></div>
            <div>
              <p className="text-gray-500">Creator:</p>
              <p className="text-lg">
                {" "}
                {details && "creator" in details ? String(details.creator) : ""}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-semibold">
              {details && "title" in details ? String(details.title) : ""}
            </h3>
            <p className="text-lg text-gray-500">
              {details && "description" in details
                ? String(details.description)
                : ""}
            </p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <h5 className="text-xl font-medium">Bid History</h5>
            <div className="w-full flex justify-center items-center">
              {details &&
              "bid_history" in details &&
              Array.isArray(details.bid_history) &&
              details.bid_history.length !== 0 ? (
                <div>History Loading...</div>
              ) : (
                <div className="w-full flex flex-col gap-2 py-5 items-center bg-gray-50 rounded-sm">
                  <TbMoodEmpty size={80} />
                  <p className="text-center">
                    Oops! No bid has been placed on this auction!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
