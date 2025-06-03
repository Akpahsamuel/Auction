import { Transaction } from "@mysten/sui/transactions";
import { Auction } from "../types";
import { DEVNET_AUCTION_REGISTRY_ID, DEVNET_PACKAGE_ID } from "../contants";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { toast } from "react-toastify";
export const useCreateAuction = () => {
  const tx = new Transaction();

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const createAuction = async (auction: Auction) => {
    const registryArg = tx.object(DEVNET_AUCTION_REGISTRY_ID);
    const nftArg = tx.object(auction.nftId);
    const titleArg = tx.pure.string(auction.title);
    const descriptionArg = tx.pure.string(auction.description);
    const startingBidArg = tx.pure.u64(auction.startingBid);
    const durationMsArg = tx.pure.u64(auction.durationMs);
    const clockArg = tx.object("0x6");

    try {
      const createAuctionTx = await tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::auction_house::create_auction`,
        arguments: [
          registryArg,
          nftArg,
          titleArg,
          descriptionArg,
          startingBidArg,
          durationMsArg,
          clockArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Auction created successfully!", result);
            toast.success("Auction created successfully!");
          },
          onError: (error) => {
            console.error("Failed to create auction:", error);
            toast.error(
              `Error: ${error.message || "Failed to create auction!"}`,
            );
            alert(error.message);
          },
        },
      );
      return createAuctionTx;
    } catch (error) {
      console.log(error);
    }
  };

  return { createAuction };
};
