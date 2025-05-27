import type { SuiReportTransactionEffectsInput } from '@mysten/wallet-standard';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { WalletFeatureNotSupportedError } from '../../errors/walletErrors.js';
import { WalletNoAccountSelectedError, WalletNotConnectedError } from '../../errors/walletErrors.js';
import type { PartialBy } from '../../types/utilityTypes.js';
type UseReportTransactionEffectsArgs = Omit<PartialBy<SuiReportTransactionEffectsInput, 'account' | 'chain'>, 'effects'> & {
    effects: string | number[];
};
type UseReportTransactionEffectsError = WalletFeatureNotSupportedError | WalletNoAccountSelectedError | WalletNotConnectedError | Error;
type UseReportTransactionEffectsMutationOptions = Omit<UseMutationOptions<void, UseReportTransactionEffectsError, UseReportTransactionEffectsArgs, unknown>, 'mutationFn'>;
/**
 * Mutation hook for prompting the user to sign a message.
 */
export declare function useReportTransactionEffects({ mutationKey, ...mutationOptions }?: UseReportTransactionEffectsMutationOptions): UseMutationResult<void, UseReportTransactionEffectsError, UseReportTransactionEffectsArgs>;
export {};
