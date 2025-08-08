import { usePasskeyAuth } from './usePasskeyAuth';
import { useBidHook } from './use-bid';
import { useAuctionHook } from './use-create-auction';
import { toast } from 'react-toastify';

export const usePasskeyAuction = () => {
  const { isAuthenticated, signPersonalMessage } = usePasskeyAuth();
  const { placeBid, claimNft, claimNftAfterCreatorClaim, claimCreatorProceeds, cancelAuction } = useBidHook();
  const { getAuctionDetailById } = useAuctionHook();

  const placeBidWithPasskey = async (auctionId: string, bidAmount: number, nftType: string) => {
    if (!isAuthenticated) {
      toast.error('Please authenticate with passkey first');
      return;
    }

    try {
      // This would need to be integrated with the actual transaction building
      // For now, we'll show a message about the integration
      toast.info('Passkey authentication ready for transaction signing');
      
      // In a real implementation, you would:
      // 1. Build the transaction
      // 2. Sign it with the passkey
      // 3. Submit the signed transaction
      
      return await placeBid(auctionId, bidAmount, nftType);
    } catch (error) {
      console.error('Passkey bid error:', error);
      toast.error('Failed to place bid with passkey');
      throw error;
    }
  };

  const claimNftWithPasskey = async (auctionId: string, nftType: string) => {
    if (!isAuthenticated) {
      toast.error('Please authenticate with passkey first');
      return;
    }

    try {
      toast.info('Passkey authentication ready for NFT claim');
      return await claimNft(auctionId, nftType);
    } catch (error) {
      console.error('Passkey claim error:', error);
      toast.error('Failed to claim NFT with passkey');
      throw error;
    }
  };

  const signMessageWithPasskey = async (message: string) => {
    if (!isAuthenticated) {
      toast.error('Please authenticate with passkey first');
      return null;
    }

    try {
      const messageBytes = new TextEncoder().encode(message);
      const signature = await signPersonalMessage(messageBytes);
      toast.success('Message signed successfully with passkey');
      return signature;
    } catch (error) {
      console.error('Passkey message signing error:', error);
      toast.error('Failed to sign message with passkey');
      throw error;
    }
  };

  return {
    isAuthenticated,
    placeBidWithPasskey,
    claimNftWithPasskey,
    signMessageWithPasskey,
    // Re-export other auction functions
    getAuctionDetailById,
    claimNftAfterCreatorClaim,
    claimCreatorProceeds,
    cancelAuction,
  };
};

export default usePasskeyAuction; 