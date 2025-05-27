import type { Wallet, WalletWithFeatures, WalletWithRequiredFeatures } from '@mysten/wallet-standard';
export declare function getRegisteredWallets<AdditionalFeatures extends Wallet['features']>(preferredWallets: string[], walletFilter?: (wallet: WalletWithRequiredFeatures) => boolean): WalletWithFeatures<import("@mysten/wallet-standard").StandardConnectFeature & import("@mysten/wallet-standard").StandardEventsFeature & AdditionalFeatures>[];
export declare function getWalletUniqueIdentifier(wallet?: Wallet): string | undefined;
