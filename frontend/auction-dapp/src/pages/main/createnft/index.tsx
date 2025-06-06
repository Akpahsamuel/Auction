import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import createImg from "../../../assets/images/create-auction.jpg";
import { Auction } from "../../../types";
import { useCreateAuction } from "../../../hooks/use-create-auction";
import suiIcon from "../../../assets/icons/sui-icon.png";
const auctionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startingBid: z.number().positive("Must be greater than 0"),
  nftId: z.string().min(1, "NFT ID is required"),
  endTime: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid end time",
  }),
});

type AuctionFormType = z.infer<typeof auctionSchema>;

const Index = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuctionFormType>({
    resolver: zodResolver(auctionSchema),
  });

  const { createAuction } = useCreateAuction();

  const onSubmit = async (data: AuctionFormType) => {
    const durationMs = new Date(data.endTime).getTime() - new Date().getTime();
    console.log("durationMs", durationMs);
    const auction: Auction = {
      title: data.title,
      description: data.description,
      startingBid: data.startingBid,
      nftId: data.nftId,
      durationMs: durationMs,
    };
    const result = await createAuction(auction);
    console.log("result", result);
  };

  return (
    <div className="container py-10 flex flex-col gap-10 md:gap-20">
      <div className="w-full flex flex-col items-start justify-start gap-8">
        <div className="w-full flex flex-col justify-between md:flex-row gap-6 md:items-center">
          <div>
            <p className=" font-semibold text-3xl">
              <span className="gradient-text">Create a new</span> Auction
            </p>
            <p className="text-gray-500">
              Create an action, users place bids and highest bidder gets the
              NFT!
            </p>
          </div>
        </div>
        <div className="w-full h-fit flex justify-between gap-10">
          <div className="p-5 md:p-10 rounded-xl shadow-xl w-full max-w-[600px] border border-gray-300 lg:min-w-[600px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }}
              className="w-full flex flex-col gap-6"
            >
              <div className="w-full">
                <Label.Root htmlFor="nftId">NFT ID</Label.Root>
                <input
                  id="nftId"
                  type="text"
                  {...register("nftId")}
                  className="input-style"
                />
                {errors.nftId && (
                  <p className="text-red-500 text-sm">{errors.nftId.message}</p>
                )}
              </div>

              <div className="w-full">
                <Label.Root htmlFor="title">Title</Label.Root>
                <input
                  id="title"
                  type="text"
                  {...register("title")}
                  className="input-style"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="w-full">
                <Label.Root htmlFor="description">Description</Label.Root>
                <textarea
                  id="description"
                  {...register("description")}
                  className="input-style"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Label.Root htmlFor="startingBid">
                  Starting Bid (in SUI)
                </Label.Root>
                <div className="relative">
                  <img
                    src={suiIcon}
                    className="w-6 h-6 absolute left-2 top-[20px]"
                  />
                  <input
                    id="startingBid"
                    type="number"
                    step="0.01"
                    {...register("startingBid", { valueAsNumber: true })}
                    className="input-style pl-10"
                  />
                </div>
                {errors.startingBid && (
                  <p className="text-red-500 text-sm">
                    {errors.startingBid.message}
                  </p>
                )}
              </div>
              {/* <div>
                <label className="block text-sm font-medium">Start Time</label>
                <input
                  type="datetime-local"
                  {...register("startTime", { required: true })}
                  onChange={(e) => console.log(e.target.value)}
                  className="input-style"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-xs">
                    {errors.startTime.message}
                  </p>
                )}
              </div> */}

              <div>
                <label className="block text-sm font-medium">End Time</label>
                <input
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)} // Now
                  max={"2099-12-31T23:59"} // Arbitrary future cap
                  {...register("endTime", { required: true })}
                  className="input-style"
                />
                {errors.endTime && (
                  <p className="text-red-500 text-xs">
                    {errors.endTime.message}
                  </p>
                )}
              </div>

              <button type="submit" className="colored-btn">
                Create Auction
              </button>
            </form>
          </div>

          <div
            className=" border border-white shadow-xl shadow-blue-900/20 bg-cover bg-top !h-full !w-full min-h-[400px] md:min-h-[600px] rounded-2xl flex justify-center items-center relative overflow-hidden"
            style={{ backgroundImage: `url(${createImg})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
