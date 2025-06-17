import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useCallback, useEffect, useState } from "react";
import { DEVNET_PACKAGE_ID, SYSTEM_CLOCK_ID } from "../contants";

export interface AdminCapInfo {
  capObjectId: string;
  grantedBy: string;
  grantedTime: number;
  isDeployer: boolean;
  isActive: boolean;
}

export interface AdminRegistryStats {
  deployer: string;
  totalAdminCount: number;
  activeAdminCount: number;
}

export function useAdminManagement() {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const [adminRegistry] = useState<SuiObjectData | null>(null);
  const [userAdminCap, setUserAdminCap] = useState<SuiObjectData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Find the admin registry object by querying shared objects
  const fetchAdminRegistry = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Query for AdminCapCreated events to find the registry
      const response = await client.queryEvents({
        query: { 
          MoveEventType: `${DEVNET_PACKAGE_ID}::admin::AdminCapCreated`
        },
        limit: 50,
        order: "ascending"
      });

      // Extract registry ID from events and get the object
      if (response.data.length > 0) {
        // Look for registry object ID in the event data
        // For now, we'll need a fallback approach since we can't directly query by type
        console.log("Found admin events:", response.data);
        
        // Alternative: If you know the registry object ID, you can use it directly
        // For demo purposes, we'll handle this differently in the actual implementation
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
          StructType: `${DEVNET_PACKAGE_ID}::admin::AuctionHouseCap`,
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
            target: `${DEVNET_PACKAGE_ID}::admin::is_active_admin`,
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
            target: `${DEVNET_PACKAGE_ID}::admin::get_all_active_admins`,
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
            target: `${DEVNET_PACKAGE_ID}::admin::get_admin_registry_stats`,
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

  // Create admin capability transaction
  const createAdminCapTransaction = useCallback(async (recipientAddress: string): Promise<Transaction> => {
    if (!userAdminCap?.objectId || !adminRegistry?.objectId) {
      throw new Error("Admin capability or registry not found");
    }

    const tx = new Transaction();

    tx.moveCall({
      target: `${DEVNET_PACKAGE_ID}::admin::create_admin_cap`,
      arguments: [
        tx.object(userAdminCap.objectId),
        tx.object(adminRegistry.objectId),
        tx.pure.address(recipientAddress),
        tx.object(SYSTEM_CLOCK_ID), // Clock object
      ],
    });

    return tx;
  }, [userAdminCap, adminRegistry]);

  // Revoke admin capability transaction
  const revokeAdminCapTransaction = useCallback(async (targetAddress: string): Promise<Transaction> => {
    if (!userAdminCap?.objectId || !adminRegistry?.objectId) {
      throw new Error("Admin capability or registry not found");
    }

    const tx = new Transaction();

    tx.moveCall({
      target: `${DEVNET_PACKAGE_ID}::admin::revoke_admin_cap`,
      arguments: [
        tx.object(userAdminCap.objectId),
        tx.object(adminRegistry.objectId),
        tx.pure.address(targetAddress),
        tx.object(SYSTEM_CLOCK_ID), // Clock object
      ],
    });

    return tx;
  }, [userAdminCap, adminRegistry]);

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
    // State
    adminRegistry,
    userAdminCap,
    isAdmin,
    isLoading,

    // Functions
    fetchAdminRegistry,
    checkUserAdminStatus,
    checkIfActiveAdmin,
    getActiveAdmins,
    getAdminRegistryStats,
    createAdminCapTransaction,
    revokeAdminCapTransaction,
  };
} 