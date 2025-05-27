/**
 * An error that is instantiated when someone attempts to perform an action that requires an active wallet connection.
 */
export declare class WalletNotConnectedError extends Error {
}
/**
 * An error that is instantiated when someone attempts to perform an action that requires a selected wallet account.
 * This is more of an edge case stemming from the fact that wallets don't technically require you to authorize any
 * accounts when connecting a wallet.
 */
export declare class WalletNoAccountSelectedError extends Error {
}
/**
 * An error that is instantiated when someone attempts to perform an action that isn't supported by a wallet.
 */
export declare class WalletFeatureNotSupportedError extends Error {
}
/**
 * An error that is instantiated when a wallet account can't be found for a specific wallet.
 */
export declare class WalletAccountNotFoundError extends Error {
}
