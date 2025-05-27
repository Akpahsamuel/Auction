import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import type { SuiRpcMethods } from './useSuiClientQuery.js';
export type UseSuiClientMutationOptions<T extends keyof SuiRpcMethods> = Omit<UseMutationOptions<SuiRpcMethods[T]['result'], Error, SuiRpcMethods[T]['params'], unknown[]>, 'mutationFn'>;
export declare function useSuiClientMutation<T extends keyof SuiRpcMethods>(method: T, options?: UseSuiClientMutationOptions<T>): UseMutationResult<SuiRpcMethods[T]['result'], Error, SuiRpcMethods[T]['params'], unknown[]>;
