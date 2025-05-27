/**
 * Retrieves the wallet that is currently connected to the dApp, if one exists.
 */
export declare function useCurrentWallet(): {
    readonly connectionStatus: "connecting";
    readonly currentWallet: null;
    readonly isDisconnected: false;
    readonly isConnecting: true;
    readonly isConnected: false;
    readonly supportedIntents: readonly [];
} | {
    readonly connectionStatus: "disconnected";
    readonly currentWallet: null;
    readonly isDisconnected: true;
    readonly isConnecting: false;
    readonly isConnected: false;
    readonly supportedIntents: readonly [];
} | {
    readonly connectionStatus: "connected";
    readonly currentWallet: import("@mysten/wallet-standard").WalletWithRequiredFeatures;
    readonly isDisconnected: false;
    readonly isConnecting: false;
    readonly isConnected: true;
    readonly supportedIntents: string[];
};
