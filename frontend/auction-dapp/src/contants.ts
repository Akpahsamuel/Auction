// Package IDs for different networks
export const TESTNET_PACKAGE_ID = "";
export const DEVNET_PACKAGE_ID =
  "0xece4964ca3cde5dccfe29d4029d5d5cb952b299cd82ab9b20ad7df3cb409209c";
export const MAINNET_PACKAGE_ID = "0x0"; // Replace with actual package ID when deploying to mainnet

// System object IDs (same across all networks)
export const SYSTEM_CLOCK_ID = "0x6"; // Sui system clock object
export const SUI_COIN_TYPE = "0x2::sui::SUI"; // SUI coin type

// // Admin capability IDs
export const TESTNET_ADMIN_REGISTRY = "";
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
export const TESTNET_AUCTION_REGISTRY_ID = ""; // Verify this matches the actual deployed registry ID on testnet
export const DEVNET_AUCTION_REGISTRY_ID =
  "0xd09cea9f4064a4fd0a2b1d6c4c39eb570a5861498bc6b9823348fe199e298411"; // Fixed devnet registry ID
export const MAINNET_AUCTION_REGISTRY_ID = "0x0"; // Replace with actual mainnet registry ID when deploying

// Network configuration helper
export const getNetworkConfig = (network: 'testnet' | 'devnet' | 'mainnet') => {
  switch (network) {
    case 'testnet':
      return {
        packageId: TESTNET_PACKAGE_ID,
        adminRegistry: TESTNET_ADMIN_REGISTRY,
        auctionHistory: TESTNET_AUCTION_HISTORY,
        auctionRegistry: TESTNET_AUCTION_REGISTRY_ID,
      };
    case 'devnet':
      return {
        packageId: DEVNET_PACKAGE_ID,
        adminRegistry: DEVNET_ADMIN_REGISTRY,
        auctionHistory: DEVNET_AUCTION_HISTORY,
        auctionRegistry: DEVNET_AUCTION_REGISTRY_ID,
      };
    case 'mainnet':
      return {
        packageId: MAINNET_PACKAGE_ID,
        adminRegistry: MAINNET_ADMIN_REGISTRY,
        auctionHistory: MAINNET_AUCTION_HISTORY,
        auctionRegistry: MAINNET_AUCTION_REGISTRY_ID,
      };
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
};

// Environment-based network detection
export const getCurrentNetwork = (): 'testnet' | 'devnet' | 'mainnet' => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Check hostname patterns for network detection
    if (hostname.includes('testnet') || hostname.includes('test')) {
      return 'testnet';
    } else if (hostname.includes('mainnet') || hostname.includes('main') || hostname.includes('app.')) {
      return 'mainnet';
    }
  }
  
  // Default to devnet for development and unknown environments
  return 'devnet';
};

// Current network configuration
export const CURRENT_NETWORK = getCurrentNetwork();
export const CURRENT_CONFIG = getNetworkConfig(CURRENT_NETWORK);

// Helper functions for easier access to current network objects
export const getCurrentAuctionRegistry = () => CURRENT_CONFIG.auctionRegistry;
export const getCurrentPackageId = () => CURRENT_CONFIG.packageId;
export const getCurrentAdminRegistry = () => CURRENT_CONFIG.adminRegistry;
export const getCurrentAuctionHistory = () => CURRENT_CONFIG.auctionHistory;
