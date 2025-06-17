// Package IDs for different networks
export const TESTNET_PACKAGE_ID = "";
export const DEVNET_PACKAGE_ID =
  "0xece4964ca3cde5dccfe29d4029d5d5cb952b299cd82ab9b20ad7df3cb409209c";
export const MAINNET_PACKAGE_ID = "0x0"; // Replace with actual package ID when deploying to mainnet

// // Admin capability IDs
export const TESTNET_ADMIN_REGISTRYÍ = "";
export const DEVNET_ADMIN_REGISTRY =
  "0x9d76585fbfe4aad06a41a4c69536d420515e8b038daa13c29bda85ecc3e07e24";
export const MAINNET_ADMIN_REGISTRY = "0x234";

// Super admin capability IDs
// export const TESTNET_SUPER_ADMIN_CAP = "0xa6ab126a28499850cf3529ef21e28fad975aec1f288c9052fd3ad637bdd24726";
// export const DEVNET_SUPER_ADMIN_CAP = "0x605d0722c4c2a23473d4eead9e163ca5f395395ff1cf412bd3c9d756de9ff562";
// export const MAINNET_SUPER_ADMIN_CAP = "0x234";

// Dashboard IDs - replace with actual IDs after deploying dashboard objects
// IMPORTANT: If your proposals don't show on the dashboard, this ID might be incorrect.
// Check Sui Explorer for the actual dashboard object ID by searching for dashboard::Dashboard
export const TESTNET_AUCTION_REGISTRY_ID = ""; // Verify this matches the actual deployed dashboard ID on testnet
export const DEVNET_AUCTION_REGISTRY_ID =
  "0xd09cea9f4064a4fd0a2b1d6c4c39eb570a5861498bc6b9823348fe199e298411"; // Fixed devnet dashboard ID
export const MAINNET_AUCTION_REGISTRY_ID = "0x0"; // Replace with actual mainnet dashboard ID when deploying
