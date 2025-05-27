import type { WalletAccount } from '@mysten/wallet-standard';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { WalletAccountNotFoundError, WalletNotConnectedError } from '../../errors/walletErrors.js';
type SwitchAccountArgs = {
    account: WalletAccount;
};
type SwitchAccountResult = void;
type UseSwitchAccountError = WalletNotConnectedError | WalletAccountNotFoundError | Error;
type UseSwitchAccountMutationOptions = Omit<UseMutationOptions<SwitchAccountResult, UseSwitchAccountError, SwitchAccountArgs, unknown>, 'mutationFn'>;
/**
 * Mutation hook for switching to a specific wallet account.
 */
export declare function useSwitchAccount({ mutationKey, ...mutationOptions }?: UseSwitchAccountMutationOptions): UseMutationResult<SwitchAccountResult, UseSwitchAccountError, SwitchAccountArgs>;
export {};
