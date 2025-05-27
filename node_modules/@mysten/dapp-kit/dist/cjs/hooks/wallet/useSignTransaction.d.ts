import type { Transaction } from '@mysten/sui/transactions';
import type { SignedTransaction, SuiSignTransactionInput } from '@mysten/wallet-standard';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { WalletFeatureNotSupportedError, WalletNoAccountSelectedError, WalletNotConnectedError } from '../../errors/walletErrors.js';
import type { PartialBy } from '../../types/utilityTypes.js';
type UseSignTransactionArgs = PartialBy<Omit<SuiSignTransactionInput, 'transaction'>, 'account' | 'chain'> & {
    transaction: Transaction | string;
};
interface UseSignTransactionResult extends SignedTransaction {
    reportTransactionEffects: (effects: string) => void;
}
type UseSignTransactionError = WalletFeatureNotSupportedError | WalletNoAccountSelectedError | WalletNotConnectedError | Error;
type UseSignTransactionMutationOptions = Omit<UseMutationOptions<UseSignTransactionResult, UseSignTransactionError, UseSignTransactionArgs, unknown>, 'mutationFn'>;
/**
 * Mutation hook for prompting the user to sign a transaction.
 */
export declare function useSignTransaction({ mutationKey, ...mutationOptions }?: UseSignTransactionMutationOptions): UseMutationResult<UseSignTransactionResult, UseSignTransactionError, UseSignTransactionArgs>;
export {};
