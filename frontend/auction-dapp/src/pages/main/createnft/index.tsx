import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Label from "@radix-ui/react-label";
import createImg from "../../../assets/images/create-auction.jpg";
import { Auction } from "../../../types";
import { useAuctionHook } from "../../../hooks/use-create-auction";
import suiIcon from "../../../assets/icons/sui-icon.png";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { NFTCollection } from "../../../components/NFTCollection";
import { NFTMetadata } from "../../../hooks/use-nft-collection";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Grid3X3, Edit3, Package } from "lucide-react";
import { toast } from "react-toastify";

const auctionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  startingBid: z.number()
    .min(0.001, "Minimum starting bid is 0.001 SUI")
    .max(1000000, "Starting bid cannot exceed 1,000,000 SUI")
    .refine((val) => !isNaN(val) && isFinite(val), {
      message: "Please enter a valid number"
    }),
  nftId: z.string().min(1, "NFT ID is required"),
  endTime: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid end time",
  }),
});

type AuctionFormType = z.infer<typeof auctionSchema>;

const Index = () => {
  const currentAccount = useCurrentAccount();
  const [inputMode, setInputMode] = useState<'collection' | 'manual'>('collection');
  const [selectedNFT, setSelectedNFT] = useState<NFTMetadata | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AuctionFormType>({
    resolver: zodResolver(auctionSchema),
  });

  const watchedNftId = watch("nftId");

  const onSubmit = async (data: AuctionFormType) => {
    const endTimeMs = new Date(data.endTime).getTime();
    console.log("endTimeMs", endTimeMs);
    
    // Additional validation for starting bid
    if (data.startingBid < 0.001) {
      toast.error("Starting bid must be at least 0.001 SUI");
      return;
    }
    
    if (data.startingBid > 1000000) {
      toast.error("Starting bid cannot exceed 1,000,000 SUI");
      return;
    }
    
    // Check for valid decimal precision (max 9 decimal places for SUI)
    const bidString = data.startingBid.toString();
    const decimalPlaces = bidString.includes('.') ? bidString.split('.')[1].length : 0;
    if (decimalPlaces > 9) {
      toast.error("Starting bid cannot have more than 9 decimal places");
      return;
    }
    
    console.log(`Creating auction with starting bid: ${data.startingBid} SUI`);
    
    // Use selected NFT metadata if available
    const auction: Auction = {
      title: data.title,
      description: data.description,
      startingBid: data.startingBid,
      nftId: data.nftId,
      endTimeMs: endTimeMs,
      // Include NFT metadata from collection selection
      nftName: selectedNFT?.display?.name || selectedNFT?.name,
      nftDescription: selectedNFT?.display?.description || selectedNFT?.description,
      nftImageUrl: selectedNFT?.display?.image_url || selectedNFT?.image_url || selectedNFT?.url,
    };
    const result = await createAuction(auction);
    console.log("result", result);
  };

  const { mutate: mutateSubmission, isPending } = useMutation({
    mutationFn: onSubmit,
  });

  const { createAuction } = useAuctionHook();

  // Handle NFT selection from collection
  const handleNFTSelect = (nft: NFTMetadata | null) => {
    setSelectedNFT(nft);
    if (nft) {
      setValue("nftId", nft.objectId);
      // Auto-fill title and description if they're empty
      const currentTitle = watch("title");
      const currentDescription = watch("description");
      
      if (!currentTitle && (nft.display?.name || nft.name)) {
        setValue("title", `${nft.display?.name || nft.name} Auction`);
      }
      
      if (!currentDescription && (nft.display?.description || nft.description)) {
        setValue("description", nft.display?.description || nft.description || "");
      }
    } else {
      setValue("nftId", "");
    }
  };

  // Handle manual NFT ID input
  const handleManualNFTIdChange = (value: string) => {
    setValue("nftId", value);
    // Clear selected NFT when manually typing
    if (selectedNFT && value !== selectedNFT.objectId) {
      setSelectedNFT(null);
    }
  };

  if (!currentAccount) {
    return (
      <div className="container py-10 flex flex-col gap-10 md:gap-20">
        <div className="w-full flex flex-col items-center justify-center gap-8 py-20">
          <Package className="h-20 w-20 text-gray-300" />
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Wallet Not Connected</h2>
            <p className="text-gray-600">Please connect your wallet to create an auction</p>
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
              <span className="gradient-text">Create a new</span> Auction
            </p>
            <p className="text-gray-500">
              Create an auction, users place bids and highest bidder gets the
              NFT!
            </p>
          </div>
        </div>

        {/* NFT Selection Mode Toggle */}
        <div className="w-full">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Select Your NFT</h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setInputMode('collection')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  inputMode === 'collection'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                Collection
              </button>
              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  inputMode === 'manual'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Edit3 className="h-4 w-4" />
                Manual Input
              </button>
            </div>
          </div>

          {/* NFT Collection View */}
          {inputMode === 'collection' && (
            <div className="mb-8">
              <NFTCollection
                onNFTSelect={handleNFTSelect}
                selectedNFTId={selectedNFT?.objectId}
                className="border border-gray-200 rounded-xl p-6 bg-gray-50"
              />
            </div>
          )}
        </div>

        <div className="w-full h-fit flex justify-between gap-10">
          <div className="p-5 md:p-10 rounded-xl shadow-xl w-full max-w-[600px] border border-gray-300 lg:min-w-[600px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit((data) => mutateSubmission(data))();
              }}
              className="w-full flex flex-col gap-6"
            >
              {/* Manual NFT ID Input (always visible but conditionally styled) */}
              <div className="w-full">
                <Label.Root htmlFor="nftId">
                  NFT ID
                  {inputMode === 'collection' && selectedNFT && (
                    <span className="ml-2 text-sm text-green-600 font-medium">
                      (Selected from collection)
                    </span>
                  )}
                </Label.Root>
                <input
                  id="nftId"
                  type="text"
                  {...register("nftId")}
                  onChange={(e) => handleManualNFTIdChange(e.target.value)}
                  className={`input-style ${
                    inputMode === 'collection' && selectedNFT
                      ? 'bg-green-50 border-green-200'
                      : ''
                  }`}
                  placeholder={
                    inputMode === 'collection'
                      ? "Select an NFT from your collection above or enter manually"
                      : "Enter NFT Object ID (0x...)"
                  }
                  readOnly={inputMode === 'collection' && !!selectedNFT}
                />
                {errors.nftId && (
                  <p className="text-red-500 text-sm">{errors.nftId.message}</p>
                )}
                {inputMode === 'manual' && (
                  <p className="text-xs text-gray-500 mt-1">
                    You can find the NFT Object ID in your wallet or on the Sui Explorer
                  </p>
                )}
              </div>

              <div className="w-full">
                <Label.Root htmlFor="title">Title</Label.Root>
                <input
                  id="title"
                  type="text"
                  {...register("title")}
                  className="input-style"
                  placeholder="Enter auction title"
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
                  rows={3}
                  placeholder="Describe your NFT and auction details"
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
                    step="0.001"
                    min="0.001"
                    max="1000000"
                    {...register("startingBid", { 
                      valueAsNumber: true,
                      setValueAs: (value) => {
                        // Ensure proper decimal handling and prevent scientific notation
                        const num = parseFloat(value);
                        return isNaN(num) ? 0 : Math.round(num * 1000000) / 1000000; // Round to 6 decimal places
                      }
                    })}
                    className="input-style pl-10"
                    placeholder="0.1"
                    onBlur={(e) => {
                      // Format the value on blur to ensure proper decimal display
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0.001) {
                        e.target.value = value.toFixed(Math.min(6, (value.toString().split('.')[1] || '').length));
                      }
                    }}
                  />
                </div>
                
                {/* Quick preset buttons */}
                <div className="flex gap-2 mt-2">
                  <span className="text-xs text-gray-500 self-center">Quick set:</span>
                  {[0.1, 0.5, 1, 5, 10].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setValue("startingBid", amount)}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border transition-colors"
                    >
                      {amount} SUI
                    </button>
                  ))}
                </div>
                
                {errors.startingBid && (
                  <p className="text-red-500 text-sm">
                    {errors.startingBid.message}
                  </p>
                )}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Minimum: 0.001 SUI • Maximum: 1,000,000 SUI
                  </p>
                  <p className="text-xs text-blue-600">
                    {watch("startingBid") && !isNaN(watch("startingBid")) && watch("startingBid") >= 0.001 
                      ? `≈ ${(watch("startingBid") * 1_000_000_000).toLocaleString()} MIST`
                      : ""
                    }
                  </p>
                </div>
              </div>

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
                <p className="text-xs text-gray-500 mt-1">
                  Select when the auction should end
                </p>
              </div>

              <button
                type="submit"
                className="colored-btn"
                disabled={isPending || !watchedNftId}
              >
                {isPending ? "Creating Auction..." : "Create Auction"}
              </button>

              {!watchedNftId && (
                <p className="text-sm text-gray-500 text-center">
                  {inputMode === 'collection' 
                    ? "Select an NFT from your collection to continue"
                    : "Enter an NFT ID to continue"
                  }
                </p>
              )}
            </form>
          </div>

          <div
            className="hidden border border-white shadow-xl shadow-blue-900/20 bg-cover bg-top !h-full !w-full min-h-[400px] md:min-h-[600px] rounded-2xl lg:flex justify-center items-center relative overflow-hidden"
            style={{ backgroundImage: `url(${createImg})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
