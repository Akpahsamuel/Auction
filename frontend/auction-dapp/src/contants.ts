import { NETWORK_CONFIGS, SuiNetwork } from './hooks/use-network-selection';

// Package IDs for different networks
export const TESTNET_PACKAGE_ID = "0xb73279f99fa432eb9500a9dbdb0deb87eef699df0a259f8186658ea0fb5c47c7";
export const DEVNET_PACKAGE_ID =
  "0xece4964ca3cde5dccfe29d4029d5d5cb952b299cd82ab9b20ad7df3cb409209c";
export const MAINNET_PACKAGE_ID = "0x0"; // Replace with actual package ID when deploying to mainnet

// System object IDs (same across all networks)
export const SYSTEM_CLOCK_ID = "0x6"; // Sui system clock object
export const SUI_COIN_TYPE = "0x2::sui::SUI"; // SUI coin type

// // Admin capability IDs
export const TESTNET_ADMIN_REGISTRY = "0x3ab6dd3a49f923b3f177fd513fcff05b05112e96c7819d58e048223ac462ff68";
export const DEVNET_ADMIN_REGISTRY =
  "0x9d76585fbfe4aad06a41a4c69536d420515e8b038daa13c29bda85ecc3e07e24";
export const MAINNET_ADMIN_REGISTRY = "0x234";

// Super admin capability IDs
export const TESTNET_AUCTION_HISTORY = "";
export const DEVNET_AUCTION_HISTORY = "";
export const MAINNET_AUCTION_HISTORY = "0x234";

// Auction Registry IDs - These are the main registry objects for the auction system
// IMPORTANT: If your auctions don't show on the platform, this ID might be incorrect.
// Check Sui Explorer for the actual auction registry object ID by searching for auction_house::AuctionRegistry
export const TESTNET_AUCTION_REGISTRY_ID = "0xc0440ba4b8e60eb58ac3a195abca8c2ee55bde113ffa832b6fe563f12815e941"; // Verify this matches the actual deployed registry ID on testnet
export const DEVNET_AUCTION_REGISTRY_ID =
  "0xd09cea9f4064a4fd0a2b1d6c4c39eb570a5861498bc6b9823348fe199e298411"; // Fixed devnet registry ID
export const MAINNET_AUCTION_REGISTRY_ID = "0x0"; // Replace with actual mainnet registry ID when deploying

// Get current network from localStorage or default to testnet
const getCurrentNetwork = (): SuiNetwork => {
  const savedNetwork = localStorage.getItem('sui-auction-dapp-network');
  return (savedNetwork && savedNetwork in NETWORK_CONFIGS) ? savedNetwork as SuiNetwork : 'testnet';
};

// Get current network configuration
const getCurrentNetworkConfig = () => {
  const network = getCurrentNetwork();
  return NETWORK_CONFIGS[network];
};

// Export functions that get values from current network config
export const getCurrentPackageId = (): string => {
  return getCurrentNetworkConfig().packageId;
};

export const getCurrentAuctionRegistry = (): string => {
  return getCurrentNetworkConfig().auctionRegistry;
};

export const getCurrentAdminRegistry = (): string => {
  return getCurrentNetworkConfig().adminRegistry;
};

export const getCurrentRpcUrl = (): string => {
  return getCurrentNetworkConfig().rpcUrl;
};

export const getCurrentExplorerUrl = (): string => {
  return getCurrentNetworkConfig().explorerUrl;
};

export const getCurrentFaucetUrl = (): string | undefined => {
  return getCurrentNetworkConfig().faucetUrl;
};

// Export the network functions for backward compatibility
export { getCurrentNetwork, getCurrentNetworkConfig };
