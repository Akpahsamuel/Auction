import { Transaction } from "@mysten/sui/transactions";
import { usePasskeyAuth } from './usePasskeyAuth';
import { useSuiClient } from "@mysten/dapp-kit";
import { toast } from "react-toastify";

export const usePasskeyTransaction = () => {
  const { isAuthenticated, signTransaction, address } = usePasskeyAuth();
  const client = useSuiClient();

  const signAndExecuteTransaction = async (
    transaction: Transaction,
    options?: {
      onSuccess?: (result: any) => void;
      onError?: (error: any) => void;
    }
  ) => {
    if (!isAuthenticated) {
      const error = new Error('Passkey not authenticated');
      options?.onError?.(error);
      throw error;
    }

    if (!address) {
      const error = new Error('Passkey address not available');
      options?.onError?.(error);
      throw error;
    }

    try {
      console.log("🔐 Using passkey for transaction signing...");
      console.log("📧 Sender address:", address);
      
      // Set the sender address for the transaction
      transaction.setSender(address);
      
      // Build the transaction
      const builtTx = await transaction.build({ client });
      
      // Sign the transaction with passkey
      const signature = await signTransaction(builtTx);
      
      console.log("✅ Transaction signed with passkey");
      
      // Execute the transaction
      const result = await client.executeTransactionBlock({
        transactionBlock: builtTx,
        signature: signature.signature,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });
      
      console.log("✅ Transaction executed successfully:", result);
      
      // Call success callback
      options?.onSuccess?.(result);
      
      return result;
    } catch (error) {
      console.error("❌ Passkey transaction failed:", error);
      
      // Handle specific error types
      let errorMessage = 'Transaction failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Check for user rejection
      if (errorMessage.includes('rejected') || 
          errorMessage.includes('cancelled') || 
          errorMessage.includes('User rejected') ||
          errorMessage.includes('NotAllowedError')) {
        toast.info("Transaction was cancelled by user");
      } else {
        toast.error(`Transaction failed: ${errorMessage}`);
      }
      
      // Call error callback
      options?.onError?.(error);
      throw error;
    }
  };

  return {
    signAndExecuteTransaction,
    isAuthenticated,
  };
}; 