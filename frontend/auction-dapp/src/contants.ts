// Package IDs for different networks
export const TESTNET_PACKAGE_ID = "";
export const DEVNET_PACKAGE_ID = "0x506a41955ff70b2c7d1b0b38f3bf79fc97a3dc6831b46e1bd23093ac4abbcba4";
export const MAINNET_PACKAGE_ID = "0x0"; // Replace with actual package ID when deploying to mainnet

// Admin capability IDs
export const TESTNET_AUCTION_HOUSE_CAP = "";
export const DEVNET_AUCTION_HOUSE_CAP = "0x1cb5d72193c1da7469cf196c4372238b78aa368cefed048cf3c42477e01ec4ef";
export const MAINNET_AUCTION_HOUSE_CAP = "0x234";

// Super admin capability IDs
// export const TESTNET_SUPER_ADMIN_CAP = "0xa6ab126a28499850cf3529ef21e28fad975aec1f288c9052fd3ad637bdd24726";
// export const DEVNET_SUPER_ADMIN_CAP = "0x605d0722c4c2a23473d4eead9e163ca5f395395ff1cf412bd3c9d756de9ff562";
// export const MAINNET_SUPER_ADMIN_CAP = "0x234";

// Dashboard IDs - replace with actual IDs after deploying dashboard objects
// IMPORTANT: If your proposals don't show on the dashboard, this ID might be incorrect.
// Check Sui Explorer for the actual dashboard object ID by searching for dashboard::Dashboard
export const TESTNET_AUCTION_REGISTRY_ID = ""; // Verify this matches the actual deployed dashboard ID on testnet
export const DEVNET_AUCTION_REGISTRY_ID = "0xfb1f3502318d4490df3a584d2358bbd093395c643f3f1f989048753cb645f600"; // Fixed devnet dashboard ID
export const MAINNET_AUCTION_REGISTRY_ID = "0x0"; // Replace with actual mainnet dashboard ID when deploying
