import type { Transaction } from '@mysten/sui/transactions';
import type { SuiSignAndExecuteTransactionInput, SuiSignAndExecuteTransactionOutput } from '@mysten/wallet-standard';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { WalletFeatureNotSupportedError, WalletNoAccountSelectedError, WalletNotConnectedError } from '../../errors/walletErrors.js';
import type { PartialBy } from '../../types/utilityTypes.js';
type UseSignAndExecuteTransactionArgs = PartialBy<Omit<SuiSignAndExecuteTransactionInput, 'transaction'>, 'account' | 'chain'> & {
    transaction: Transaction | string;
};
type UseSignAndExecuteTransactionResult = SuiSignAndExecuteTransactionOutput;
type UseSignAndExecuteTransactionError = WalletFeatureNotSupportedError | WalletNoAccountSelectedError | WalletNotConnectedError | Error;
type ExecuteTransactionResult = {
    digest: string;
    rawEffects?: number[];
} | {
    effects?: {
        bcs?: string;
    };
};
type UseSignAndExecuteTransactionMutationOptions<Result extends ExecuteTransactionResult> = Omit<UseMutationOptions<Result, UseSignAndExecuteTransactionError, UseSignAndExecuteTransactionArgs, unknown>, 'mutationFn'> & {
    execute?: ({ bytes, signature }: {
        bytes: string;
        signature: string;
    }) => Promise<Result>;
};
/**
 * Mutation hook for prompting the user to sign and execute a transaction.
 */
export declare function useSignAndExecuteTransaction<Result extends ExecuteTransactionResult = UseSignAndExecuteTransactionResult>({ mutationKey, execute, ...mutationOptions }?: UseSignAndExecuteTransactionMutationOptions<Result>): UseMutationResult<Result, UseSignAndExecuteTransactionError, UseSignAndExecuteTransactionArgs>;
export {};
