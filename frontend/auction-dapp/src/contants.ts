// Package IDs for different networks
export const TESTNET_PACKAGE_ID = "";
export const DEVNET_PACKAGE_ID =
  "0x26b97dade78d5b96fb54b224e621ce93efad01b43b0a49e525146caad49aa201";
export const MAINNET_PACKAGE_ID = "0x0"; // Replace with actual package ID when deploying to mainnet

// Admin capability IDs
export const TESTNET_AUCTION_HOUSE_CAP = "";
export const DEVNET_AUCTION_HOUSE_CAP =
  "0xff8a50279f04a5a23714b8819da23fe62ba1216cbbcbbbfed0ed41e3ae07270f";
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
  "0x68f2eed22fa1b44ab7d219f4b4ca53e4ae7931fbddc49b19e70b0d215a772a9b"; // Fixed devnet dashboard ID
export const MAINNET_AUCTION_REGISTRY_ID = "0x0"; // Replace with actual mainnet dashboard ID when deploying
