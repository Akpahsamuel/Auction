import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { WalletNotConnectedError } from '../../errors/walletErrors.js';
type UseDisconnectWalletError = WalletNotConnectedError | Error;
type UseDisconnectWalletMutationOptions = Omit<UseMutationOptions<void, UseDisconnectWalletError, void, unknown>, 'mutationFn'>;
/**
 * Mutation hook for disconnecting from an active wallet connection, if currently connected.
 */
export declare function useDisconnectWallet({ mutationKey, ...mutationOptions }?: UseDisconnectWalletMutationOptions): UseMutationResult<void, UseDisconnectWalletError, void>;
export {};
