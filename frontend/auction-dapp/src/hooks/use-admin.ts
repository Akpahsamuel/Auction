import { Transaction } from "@mysten/sui/transactions";
import { DEVNET_PACKAGE_ID, DEVNET_AUCTION_REGISTRY_ID } from "../contants";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { toast } from "react-toastify";

export const useAdminHook = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  // Helper function to get user's admin capability
  const getUserAdminCap = async (): Promise<string | null> => {
    if (!currentAccount) {
      return null;
    }

    try {
      const client = new SuiClient({ url: getFullnodeUrl("devnet") });
      
      // Find the user's AuctionHouseCap objects
      const ownedObjects = await client.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${DEVNET_PACKAGE_ID}::admin::AuctionHouseCap`
        },
        options: {
          showContent: true,
          showType: true,
        }
      });

      console.log("Found AuctionHouseCap objects:", ownedObjects);
      
      if (ownedObjects.data.length > 0) {
        // Return the first admin capability found
        const adminCapId = ownedObjects.data[0].data?.objectId;
        console.log("Using admin capability:", adminCapId);
        return adminCapId || null;
      }

      console.log("No admin capabilities found for user");
      return null;
    } catch (error) {
      console.error("Error finding user's admin capability:", error);
      return null;
    }
  };

  const checkIsAdmin = async (): Promise<boolean> => {
    const adminCapId = await getUserAdminCap();
    return adminCapId !== null;
  };

  const withdrawRegistryFees = async () => {
    try {
      // First, get the user's admin capability
      const adminCapId = await getUserAdminCap();
      if (!adminCapId) {
        toast.error("You don't have admin privileges. An AuctionHouseCap is required.");
        return;
      }

      const tx = new Transaction();

      // Prepare move call arguments using the user's admin capability
      const auctionHouseCapArg = tx.object(adminCapId);
      const registryArg = tx.object(DEVNET_AUCTION_REGISTRY_ID);

      // Call the withdraw_registry_fees function from admin module
      tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::admin::withdraw_registry_fees`,
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
            toast.success("Fees withdrawn successfully!");
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
        `Failed to withdraw fees: ${error.message || "Unknown error"}`,
      );
    }
  };

  const updateTreasuryAddress = async (newTreasuryAddress: string) => {
    try {
      // First, get the user's admin capability
      const adminCapId = await getUserAdminCap();
      if (!adminCapId) {
        toast.error("You don't have admin privileges. An AuctionHouseCap is required.");
        return;
      }

      const tx = new Transaction();

      // Prepare move call arguments using the user's admin capability
      const auctionHouseCapArg = tx.object(adminCapId);
      const registryArg = tx.object(DEVNET_AUCTION_REGISTRY_ID);
      const newTreasuryArg = tx.pure.address(newTreasuryAddress);

      // Call the update_treasury_address function from admin module
      tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::admin::update_treasury_address`,
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
    console.log("=== getRegistryFeeInfo called ===");
    try {
      const client = new SuiClient({ url: getFullnodeUrl("devnet") });
      
      console.log("Fetching registry fee info from:", DEVNET_AUCTION_REGISTRY_ID);
      
      // Call the view function to get registry fee info (still in auction_house module)
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

      console.log("Raw devInspectTransactionBlock result:", result);

      if (result.results?.[0]?.returnValues) {
        const [feeBalanceBytes, treasuryAddressBytes] = result.results[0].returnValues;
        
        console.log("Raw fee balance bytes:", feeBalanceBytes);
        console.log("Fee balance bytes as array:", Array.from(new Uint8Array(feeBalanceBytes[0])));
        console.log("Raw treasury address bytes:", treasuryAddressBytes);
        
        // Use DataView for reliable u64 conversion
        const feeBalanceArray = new Uint8Array(feeBalanceBytes[0]);
        const dataView = new DataView(feeBalanceArray.buffer);
        const feeBalance = Number(dataView.getBigUint64(0, true)); // little-endian
        
        console.log("Fee balance (MIST) - DataView:", feeBalance);
        console.log("Fee balance (SUI) - DataView:", feeBalance / 1_000_000_000);
        
        // Convert address bytes to hex string
        const treasuryAddressArray = new Uint8Array(treasuryAddressBytes[0]);
        const treasuryAddress = "0x" + Array.from(treasuryAddressArray)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        console.log("Treasury address:", treasuryAddress);
        
        return {
          feeBalance: feeBalance / 1_000_000_000, // Convert MIST to SUI
          treasuryAddress,
        };
      } else {
        console.error("No return values found in inspection result");
        return { feeBalance: 0, treasuryAddress: "" };
      }
    } catch (error) {
      console.error("Error fetching registry fee info:", error);
      return { feeBalance: 0, treasuryAddress: "" };
    }
  };

  const createAdminCap = async (recipientAddress: string) => {
    try {
      // First, get the user's admin capability
      const adminCapId = await getUserAdminCap();
      if (!adminCapId) {
        toast.error("You don't have admin privileges. An AuctionHouseCap is required to create new admin capabilities.");
        return;
      }

      const tx = new Transaction();

      // Prepare move call arguments using the user's admin capability
      const auctionHouseCapArg = tx.object(adminCapId);
      const recipientArg = tx.pure.address(recipientAddress);

      // Call the create_admin_cap function from admin module
      tx.moveCall({
        target: `${DEVNET_PACKAGE_ID}::admin::create_admin_cap`,
        arguments: [
          auctionHouseCapArg,
          recipientArg,
        ],
      });

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Admin capability created successfully!", result);
            toast.success(`Admin capability created and sent to ${recipientAddress}!`);
            console.log("Transaction digest:", result.digest);
          },
          onError: (error) => {
            console.error("Failed to create admin capability:", error);
            handleAdminError(error);
          },
        },
      );
    } catch (error: any) {
      console.error("Error preparing create admin cap transaction:", error);
      toast.error(
        `Failed to create admin capability: ${error.message || "Unknown error"}`,
      );
    }
  };

  return { 
    checkIsAdmin, 
    withdrawRegistryFees, 
    updateTreasuryAddress, 
    getRegistryFeeInfo,
    createAdminCap,
    getUserAdminCap // Export this for debugging purposes
  };
};

const handleAdminError = (error: any) => {
  console.error("Admin transaction error details:", error);

  const errorMessage = error.message || error.toString();

  if (errorMessage.includes("VMVerificationOrDeserializationError")) {
    toast.error(
      "Transaction verification failed. Please ensure you have admin privileges.",
    );
  } else if (errorMessage.includes("InsufficientGas")) {
    toast.error("Insufficient gas. Please add more SUI to your wallet.");
  } else if (errorMessage.includes("ObjectNotFound")) {
    toast.error("Admin capability object not found. Please check your admin status.");
  } else if (errorMessage.includes("InvalidObjectType")) {
    toast.error("Invalid admin capability type.");
  } else if (errorMessage.includes("not owned by")) {
    toast.error("You don't have admin privileges for this action.");
  } else if (errorMessage.includes("Package object does not exist")) {
    toast.error(
      "Admin contract not found. Please ensure you're connected to the correct network.",
    );
  } else if (errorMessage.includes("Insufficient balance")) {
    toast.error("Insufficient balance to complete the transaction.");
  } else {
    toast.error(`Admin transaction failed: ${errorMessage}`);
  }
}; 