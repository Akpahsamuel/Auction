// Package IDs for different networks
export const TESTNET_PACKAGE_ID = "";
export const DEVNET_PACKAGE_ID =
  "0xe43e0a41bd250a5067acac85761723091b00ecb646f2620a1c90ddfa1b24a29b";
export const MAINNET_PACKAGE_ID = "0x0"; // Replace with actual package ID when deploying to mainnet

// Admin capability IDs
export const TESTNET_AUCTION_HOUSE_CAP = "";
export const DEVNET_AUCTION_HOUSE_CAP =
  "0xcdb8967d1e7f907d662e448a5c92717f8408bb400212082a8ed004f29895ae1f";
export const MAINNET_AUCTION_HOUSE_CAP = "0x234";

// Super admin capability IDs
// export const TESTNET_SUPER_ADMIN_CAP = "0xa6ab126a28499850cf3529ef21e28fad975aec1f288c9052fd3ad637bdd24726";
// export const DEVNET_SUPER_ADMIN_CAP = "0x605d0722c4c2a23473d4eead9e163ca5f395395ff1cf412bd3c9d756de9ff562";
// export const MAINNET_SUPER_ADMIN_CAP = "0x234";

// Dashboard IDs - replace with actual IDs after deploying dashboard objects
// IMPORTANT: If your proposals don't show on the dashboard, this ID might be incorrect.
// Check Sui Explorer for the actual dashboard object ID by searching for dashboard::Dashboard
export const TESTNET_AUCTION_REGISTRY_ID = ""; // Verify this matches the actual deployed dashboard ID on testnet
export const DEVNET_AUCTION_REGISTRY_ID =
  "0xa149cc15af4d7330c8e3fb726a65b1a3399613904a9ba20c7f697e7b00187a0c"; // Fixed devnet dashboard ID
export const MAINNET_AUCTION_REGISTRY_ID = "0x0"; // Replace with actual mainnet dashboard ID when deploying
