import { Transaction } from "@mysten/sui/transactions";
import { DEVNET_PACKAGE_ID, DEVNET_AUCTION_REGISTRY_ID, DEVNET_AUCTION_HOUSE_CAP } from "../contants";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { toast } from "react-toastify";

export const useAdminHook = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const withdrawRegistryFees = async () => {
    try {
      const tx = new Transaction();

      // Prepare move call arguments
      const auctionHouseCapArg = tx.object(DEVNET_AUCTION_HOUSE_CAP);
      const registryArg = tx.object(DEVNET_AUCTION_REGISTRY_ID);

      // Call the withdraw_fees function
      tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::auction_house::withdraw_fees`,
        arguments: [
          auctionHouseCapArg,
          registryArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Registry fees withdrawn successfully!", result);
            toast.success("Registry fees withdrawn successfully!");
            console.log("Transaction digest:", result.digest);
          },
          onError: (error) => {
            console.error("Failed to withdraw registry fees:", error);
            handleAdminError(error);
          },
        },
      );
    } catch (error: any) {
      console.error("Error preparing withdraw registry fees transaction:", error);
      toast.error(
        `Failed to withdraw registry fees: ${error.message || "Unknown error"}`,
      );
    }
  };

  const withdrawCapFees = async () => {
    try {
      const tx = new Transaction();

      // Prepare move call arguments
      const auctionHouseCapArg = tx.object(DEVNET_AUCTION_HOUSE_CAP);

      // Call the withdraw_cap_fees function
      tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::auction_house::withdraw_cap_fees`,
        arguments: [
          auctionHouseCapArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Auction house cap fees withdrawn successfully!", result);
            toast.success("Auction house cap fees withdrawn successfully!");
            console.log("Transaction digest:", result.digest);
          },
          onError: (error) => {
            console.error("Failed to withdraw auction house cap fees:", error);
            handleAdminError(error);
          },
        },
      );
    } catch (error: any) {
      console.error("Error preparing withdraw cap fees transaction:", error);
      toast.error(
        `Failed to withdraw cap fees: ${error.message || "Unknown error"}`,
      );
    }
  };

  const updateTreasuryAddress = async (newTreasuryAddress: string) => {
    try {
      const tx = new Transaction();

      // Prepare move call arguments
      const auctionHouseCapArg = tx.object(DEVNET_AUCTION_HOUSE_CAP);
      const registryArg = tx.object(DEVNET_AUCTION_REGISTRY_ID);
      const newTreasuryArg = tx.pure.address(newTreasuryAddress);

      // Call the update_treasury_address function
      tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::auction_house::update_treasury_address`,
        arguments: [
          auctionHouseCapArg,
          registryArg,
          newTreasuryArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Treasury address updated successfully!", result);
            toast.success("Treasury address updated successfully!");
            console.log("Transaction digest:", result.digest);
          },
          onError: (error) => {
            console.error("Failed to update treasury address:", error);
            handleAdminError(error);
          },
        },
      );
    } catch (error: any) {
      console.error("Error preparing update treasury address transaction:", error);
      toast.error(
        `Failed to update treasury address: ${error.message || "Unknown error"}`,
      );
    }
  };

  const getRegistryFeeInfo = async () => {
    try {
      const client = new SuiClient({ url: getFullnodeUrl("devnet") });
      
      // Call the view function to get registry fee info
      const result = await client.devInspectTransactionBlock({
        transactionBlock: (() => {
          const tx = new Transaction();
          const registryArg = tx.object(DEVNET_AUCTION_REGISTRY_ID);
          
          tx.moveCall({
            target: `${DEVNET_PACKAGE_ID}::auction_house::get_registry_fee_info`,
            arguments: [registryArg],
          });
          
          return tx;
        })(),
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      if (result.results?.[0]?.returnValues) {
        const [feeBalanceBytes, treasuryAddressBytes] = result.results[0].returnValues;
        
        // Convert bytes to hex string and then to BigInt
        const feeBalanceHex = Array.from(new Uint8Array(feeBalanceBytes[0]))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        const feeBalance = BigInt("0x" + feeBalanceHex);
        
        // Convert address bytes to hex string
        const treasuryAddressHex = Array.from(new Uint8Array(treasuryAddressBytes[0]))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        const treasuryAddress = "0x" + treasuryAddressHex;
        
        return {
          feeBalance: Number(feeBalance),
          treasuryAddress,
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching registry fee info:", error);
      return null;
    }
  };

  const getAuctionHouseCapFeeBalance = async () => {
    try {
      const client = new SuiClient({ url: getFullnodeUrl("devnet") });
      
      // Call the view function to get auction house cap fee balance
      const result = await client.devInspectTransactionBlock({
        transactionBlock: (() => {
          const tx = new Transaction();
          const auctionHouseCapArg = tx.object(DEVNET_AUCTION_HOUSE_CAP);
          
          tx.moveCall({
            target: `${DEVNET_PACKAGE_ID}::auction_house::get_auction_house_fee_balance`,
            arguments: [auctionHouseCapArg],
          });
          
          return tx;
        })(),
        sender: "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      if (result.results?.[0]?.returnValues) {
        const [feeBalanceBytes] = result.results[0].returnValues;
        
        // Convert bytes to hex string and then to BigInt
        const feeBalanceHex = Array.from(new Uint8Array(feeBalanceBytes[0]))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        const feeBalance = BigInt("0x" + feeBalanceHex);
        
        return Number(feeBalance);
      }
      
      return 0;
    } catch (error) {
      console.error("Error fetching auction house cap fee balance:", error);
      return 0;
    }
  };

  return { 
    withdrawRegistryFees, 
    withdrawCapFees, 
    updateTreasuryAddress,
    getRegistryFeeInfo,
    getAuctionHouseCapFeeBalance
  };
};

const handleAdminError = (error: any) => {
  console.error("Admin transaction error details:", error);

  const errorMessage = error.message || error.toString();

  if (errorMessage.includes("ENotAuthorized")) {
    toast.error("You are not authorized to perform this admin action.");
  } else if (errorMessage.includes("InsufficientGas")) {
    toast.error("Insufficient gas. Please add more SUI to your wallet.");
  } else if (errorMessage.includes("ObjectNotFound")) {
    toast.error("Admin capability not found. You may not be an admin.");
  } else {
    toast.error(`Admin transaction failed: ${errorMessage}`);
  }
}; 