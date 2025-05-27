import type { SuiSignPersonalMessageInput, SuiSignPersonalMessageOutput } from '@mysten/wallet-standard';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { WalletFeatureNotSupportedError, WalletNoAccountSelectedError, WalletNotConnectedError } from '../..//errors/walletErrors.js';
import type { PartialBy } from '../../types/utilityTypes.js';
type UseSignPersonalMessageArgs = PartialBy<SuiSignPersonalMessageInput, 'account' | 'chain'>;
type UseSignPersonalMessageResult = SuiSignPersonalMessageOutput;
type UseSignPersonalMessageError = WalletFeatureNotSupportedError | WalletNoAccountSelectedError | WalletNotConnectedError | Error;
type UseSignPersonalMessageMutationOptions = Omit<UseMutationOptions<UseSignPersonalMessageResult, UseSignPersonalMessageError, UseSignPersonalMessageArgs, unknown>, 'mutationFn'>;
/**
 * Mutation hook for prompting the user to sign a message.
 */
export declare function useSignPersonalMessage({ mutationKey, ...mutationOptions }?: UseSignPersonalMessageMutationOptions): UseMutationResult<UseSignPersonalMessageResult, UseSignPersonalMessageError, UseSignPersonalMessageArgs>;
export {};
