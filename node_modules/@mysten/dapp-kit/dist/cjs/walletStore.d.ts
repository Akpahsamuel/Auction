import type { Wallet, WalletAccount, WalletWithRequiredFeatures } from '@mysten/wallet-standard';
import type { StateStorage } from 'zustand/middleware';
type WalletConnectionStatus = 'disconnected' | 'connecting' | 'connected';
export type WalletActions = {
    setAccountSwitched: (selectedAccount: WalletAccount) => void;
    setConnectionStatus: (connectionStatus: WalletConnectionStatus) => void;
    setWalletConnected: (wallet: WalletWithRequiredFeatures, connectedAccounts: readonly WalletAccount[], selectedAccount: WalletAccount | null, supportedIntents?: string[]) => void;
    updateWalletAccounts: (accounts: readonly WalletAccount[]) => void;
    setWalletDisconnected: () => void;
    setWalletRegistered: (updatedWallets: WalletWithRequiredFeatures[]) => void;
    setWalletUnregistered: (updatedWallets: WalletWithRequiredFeatures[], unregisteredWallet: Wallet) => void;
};
export type WalletStore = ReturnType<typeof createWalletStore>;
export type StoreState = {
    autoConnectEnabled: boolean;
    wallets: WalletWithRequiredFeatures[];
    accounts: readonly WalletAccount[];
    currentWallet: WalletWithRequiredFeatures | null;
    currentAccount: WalletAccount | null;
    lastConnectedAccountAddress: string | null;
    lastConnectedWalletName: string | null;
    connectionStatus: WalletConnectionStatus;
    supportedIntents: string[];
} & WalletActions;
type WalletConfiguration = {
    autoConnectEnabled: boolean;
    wallets: WalletWithRequiredFeatures[];
    storage: StateStorage;
    storageKey: string;
};
export declare function createWalletStore({ wallets, storage, storageKey, autoConnectEnabled, }: WalletConfiguration): Omit<import("zustand").StoreApi<StoreState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware.js").PersistOptions<StoreState, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: StoreState) => void) => () => void;
        onFinishHydration: (fn: (state: StoreState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware.js").PersistOptions<StoreState, unknown>>;
    };
};
export {};
