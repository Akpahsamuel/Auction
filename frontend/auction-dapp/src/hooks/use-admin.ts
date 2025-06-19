import { Transaction } from "@mysten/sui/transactions";
import { getCurrentAuctionRegistry, getCurrentPackageId, getCurrentAdminRegistry } from "../contants";
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl, SuiObjectData } from "@mysten/sui/client";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";

// Define the AdminRegistryStats interface
export interface AdminRegistryStats {
  deployer: string;
  totalAdminCount: number;
  activeAdminCount: number;
}

export const useAdminHook = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();
  const client = useSuiClient();
  const [adminRegistry, setAdminRegistry] = useState<SuiObjectData | null>(null);
  const [userAdminCap, setUserAdminCap] = useState<SuiObjectData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          StructType: `${getCurrentPackageId()}::admin::AuctionHouseCap`
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
      const adminRegistryArg = tx.object(getCurrentAdminRegistry());
      const auctionRegistryArg = tx.object(getCurrentAuctionRegistry());

      // Call the withdraw_registry_fees function from admin module
      tx.moveCall({
        target: `${getCurrentPackageId()}::admin::withdraw_registry_fees`,
        arguments: [
          auctionHouseCapArg,
          adminRegistryArg,
          auctionRegistryArg,
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
      const adminRegistryArg = tx.object(getCurrentAdminRegistry());
      const auctionRegistryArg = tx.object(getCurrentAuctionRegistry());
      const newTreasuryArg = tx.pure.address(newTreasuryAddress);

      // Call the update_treasury_address function from admin module
      tx.moveCall({
        target: `${getCurrentPackageId()}::admin::update_treasury_address`,
        arguments: [
          auctionHouseCapArg,
          adminRegistryArg,
          auctionRegistryArg,
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
      
      console.log("Fetching registry fee info from:", getCurrentAuctionRegistry());
      
      // Call the view function to get registry fee info (still in auction_house module)
      const result = await client.devInspectTransactionBlock({
        transactionBlock: (() => {
          const tx = new Transaction();
          const registryArg = tx.object(getCurrentAuctionRegistry());
          
          tx.moveCall({
            target: `${getCurrentPackageId()}::auction_house::get_registry_fee_info`,
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
        target: `${getCurrentPackageId()}::admin::create_admin_cap`,
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

  // Find the admin registry object
  const fetchAdminRegistry = useCallback(async () => {
    try {
      setIsLoading(true);
      const registryObjects = await client.getOwnedObjects({
        owner: getCurrentPackageId(),
        filter: {
          StructType: `${getCurrentPackageId()}::admin::AdminRegistry`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (registryObjects.data.length > 0) {
        setAdminRegistry(registryObjects.data[0].data || null);
      }
    } catch (error) {
      console.error("Error fetching admin registry:", error);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  // Check if current user has admin capability
  const checkUserAdminStatus = useCallback(async () => {
    if (!currentAccount?.address) {
      setIsAdmin(false);
      setUserAdminCap(null);
      return;
    }

    try {
      setIsLoading(true);
      
      // Get user's admin capabilities
      const adminCaps = await client.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${getCurrentPackageId()}::admin::AuctionHouseCap`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (adminCaps.data.length > 0) {
        setUserAdminCap(adminCaps.data[0].data || null);
        
        // Check if the admin capability is still active in the registry
        if (adminRegistry) {
          const isActiveAdmin = await checkIfActiveAdmin(currentAccount.address);
          setIsAdmin(isActiveAdmin);
        } else {
          setIsAdmin(true); // Assume active if we can't check registry
        }
      } else {
        setIsAdmin(false);
        setUserAdminCap(null);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      setUserAdminCap(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount?.address, client, adminRegistry]);

  // Check if an address has active admin capability
  const checkIfActiveAdmin = useCallback(async (address: string): Promise<boolean> => {
    if (!adminRegistry?.objectId) return false;

    try {
      const result = await client.devInspectTransactionBlock({
        transactionBlock: (() => {
          const tx = new Transaction();
          tx.moveCall({
            target: `${getCurrentPackageId()}::admin::is_active_admin`,
            arguments: [
              tx.object(adminRegistry.objectId),
              tx.pure.address(address),
            ],
          });
          return tx;
        })(),
        sender: currentAccount?.address || "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      // Check if the result indicates true (1) or false (0)
      const returnValue = result.results?.[0]?.returnValues?.[0];
      if (returnValue && returnValue[0]) {
        const boolValue = new Uint8Array(returnValue[0])[0];
        return boolValue === 1;
      }
      return false;
    } catch (error) {
      console.error("Error checking if active admin:", error);
      return false;
    }
  }, [client, adminRegistry, currentAccount?.address]);

  // Get all active admin addresses
  const getActiveAdmins = useCallback(async (): Promise<string[]> => {
    if (!adminRegistry?.objectId) return [];

    try {
      const result = await client.devInspectTransactionBlock({
        transactionBlock: (() => {
          const tx = new Transaction();
          tx.moveCall({
            target: `${getCurrentPackageId()}::admin::get_all_active_admins`,
            arguments: [tx.object(adminRegistry.objectId)],
          });
          return tx;
        })(),
        sender: currentAccount?.address || "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      const returnValue = result.results?.[0]?.returnValues?.[0];
      if (returnValue && returnValue[0]) {
        // Parse the returned vector of addresses
        const addressArray = new Uint8Array(returnValue[0]);
        const addresses: string[] = [];
        
        // Parse vector of addresses (this will need to be adjusted based on actual encoding)
        // For now, return empty array and log for debugging
        console.log("Active admins raw data:", addressArray);
        return addresses;
      }
      return [];
    } catch (error) {
      console.error("Error getting active admins:", error);
      return [];
    }
  }, [client, adminRegistry, currentAccount?.address]);

  // Get admin registry statistics
  const getAdminRegistryStats = useCallback(async (): Promise<AdminRegistryStats | null> => {
    if (!adminRegistry?.objectId) return null;

    try {
      const result = await client.devInspectTransactionBlock({
        transactionBlock: (() => {
          const tx = new Transaction();
          tx.moveCall({
            target: `${getCurrentPackageId()}::admin::get_admin_registry_stats`,
            arguments: [tx.object(adminRegistry.objectId)],
          });
          return tx;
        })(),
        sender: currentAccount?.address || "0x0000000000000000000000000000000000000000000000000000000000000000",
      });

      const returnValues = result.results?.[0]?.returnValues;
      if (returnValues && returnValues.length >= 3) {
        // Parse the returned values (deployer address, total count, active count)
        const deployerBytes = returnValues[0][0];
        const totalCountBytes = returnValues[1][0];
        const activeCountBytes = returnValues[2][0];

        const deployer = "0x" + Array.from(new Uint8Array(deployerBytes))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        const totalAdminCount = Number(new DataView(new Uint8Array(totalCountBytes).buffer).getBigUint64(0, true));
        const activeAdminCount = Number(new DataView(new Uint8Array(activeCountBytes).buffer).getBigUint64(0, true));

        return {
          deployer,
          totalAdminCount,
          activeAdminCount,
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting admin registry stats:", error);
      return null;
    }
  }, [client, adminRegistry, currentAccount?.address]);

  // Initialize data on mount and account change
  useEffect(() => {
    fetchAdminRegistry();
  }, [fetchAdminRegistry]);

  useEffect(() => {
    if (adminRegistry) {
      checkUserAdminStatus();
    }
  }, [adminRegistry, checkUserAdminStatus]);

  return { 
    checkIsAdmin, 
    withdrawRegistryFees, 
    updateTreasuryAddress, 
    getRegistryFeeInfo,
    createAdminCap,
    getUserAdminCap, // Export this for debugging purposes
    adminRegistry,
    userAdminCap,
    isAdmin,
    isLoading,
    fetchAdminRegistry,
    checkUserAdminStatus,
    checkIfActiveAdmin,
    getActiveAdmins,
    getAdminRegistryStats,
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