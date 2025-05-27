import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard';
export declare const SUI_WALLET_NAME = "Sui Wallet";
export declare const DEFAULT_STORAGE: import("zustand/middleware.js").StateStorage;
export declare const DEFAULT_STORAGE_KEY = "sui-dapp-kit:wallet-connection-info";
export declare const DEFAULT_WALLET_FILTER: (wallet: WalletWithRequiredFeatures) => boolean;
export declare const DEFAULT_PREFERRED_WALLETS: string[];
