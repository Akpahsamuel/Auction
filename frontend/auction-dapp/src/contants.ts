// Package IDs for different networks
export const TESTNET_PACKAGE_ID = "";
export const DEVNET_PACKAGE_ID = "0xd063434affefa5670874d3ec1b98c16b1220841dcfce73b020d444c62a655395";
export const MAINNET_PACKAGE_ID = "0x0"; // Replace with actual package ID when deploying to mainnet

// Admin capability IDs
export const TESTNET_AUCTION_HOUSE_CAP = "";
export const DEVNET_AUCTION_HOUSE_CAP = "0x3ce51855862308d6179ce116b364d64c5ceee3ef56512accf7959d33a95e32e7";
export const MAINNET_AUCTION_HOUSE_CAP = "0x234";

// Super admin capability IDs
// export const TESTNET_SUPER_ADMIN_CAP = "0xa6ab126a28499850cf3529ef21e28fad975aec1f288c9052fd3ad637bdd24726";
// export const DEVNET_SUPER_ADMIN_CAP = "0x605d0722c4c2a23473d4eead9e163ca5f395395ff1cf412bd3c9d756de9ff562";
// export const MAINNET_SUPER_ADMIN_CAP = "0x234";

// Dashboard IDs - replace with actual IDs after deploying dashboard objects
// IMPORTANT: If your proposals don't show on the dashboard, this ID might be incorrect.
// Check Sui Explorer for the actual dashboard object ID by searching for dashboard::Dashboard
export const TESTNET_AUCTION_REGISTRY_ID = ""; // Verify this matches the actual deployed dashboard ID on testnet
export const DEVNET_AUCTION_REGISTRY_ID = "0xb08ab5209bb06026540435642a0e1718568abd89bd5ed2850e68ef28a728fd16"; // Fixed devnet dashboard ID
export const MAINNET_AUCTION_REGISTRY_ID = "0x0"; // Replace with actual mainnet dashboard ID when deploying
