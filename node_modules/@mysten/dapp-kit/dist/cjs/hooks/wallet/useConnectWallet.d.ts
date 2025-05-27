import type { StandardConnectInput, StandardConnectOutput, WalletWithRequiredFeatures } from '@mysten/wallet-standard';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
type ConnectWalletArgs = {
    /** The wallet to connect to. */
    wallet: WalletWithRequiredFeatures;
    /** An optional account address to connect to. Defaults to the first authorized account. */
    accountAddress?: string;
} & StandardConnectInput;
type ConnectWalletResult = StandardConnectOutput;
type UseConnectWalletMutationOptions = Omit<UseMutationOptions<ConnectWalletResult, Error, ConnectWalletArgs, unknown>, 'mutationFn'>;
/**
 * Mutation hook for establishing a connection to a specific wallet.
 */
export declare function useConnectWallet({ mutationKey, ...mutationOptions }?: UseConnectWalletMutationOptions): UseMutationResult<ConnectWalletResult, Error, ConnectWalletArgs, unknown>;
export {};
