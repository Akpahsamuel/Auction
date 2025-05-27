import type { WalletWithFeatures, WalletWithRequiredFeatures } from '@mysten/wallet-standard';
import type { ReactNode } from 'react';
import type { StateStorage } from 'zustand/middleware';
import type { SlushWalletConfig } from '../hooks/wallet/useSlushWallet.js';
import type { Theme } from '../themes/themeContract.js';
export type WalletProviderProps = {
    /** A list of wallets that are sorted to the top of the wallet list, if they are available to connect to. By default, wallets are sorted by the order they are loaded in. */
    preferredWallets?: string[];
    /** A filter function to select wallets that support features required for the dApp to function. This filters the list of wallets presented to users when selecting a wallet to connect from, ensuring that only wallets that meet the dApps requirements can connect. */
    walletFilter?: (wallet: WalletWithRequiredFeatures) => boolean;
    /** Enables the development-only unsafe burner wallet, which can be useful for testing. */
    enableUnsafeBurner?: boolean;
    /** Enables automatically reconnecting to the most recently used wallet account upon mounting. */
    autoConnect?: boolean;
    /** Enables the Slush wallet */
    slushWallet?: SlushWalletConfig;
    /** Configures how the most recently connected to wallet account is stored. Set to `null` to disable persisting state entirely. Defaults to using localStorage if it is available. */
    storage?: StateStorage | null;
    /** The key to use to store the most recently connected wallet account. */
    storageKey?: string;
    /** The theme to use for styling UI components. Defaults to using the light theme. */
    theme?: Theme | null;
    children: ReactNode;
};
export type { WalletWithFeatures };
export declare function WalletProvider({ preferredWallets, walletFilter, storage, storageKey, enableUnsafeBurner, autoConnect, slushWallet, theme, children, }: WalletProviderProps): import("react/jsx-runtime.js").JSX.Element;
