import type { SuiClient } from '@mysten/sui/client';
import type { UndefinedInitialDataOptions, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { PartialBy } from '../types/utilityTypes.js';
export type SuiRpcMethodName = {
    [K in keyof SuiClient]: SuiClient[K] extends ((input: any) => Promise<any>) | (() => Promise<any>) ? K : never;
}[keyof SuiClient];
export type SuiRpcMethods = {
    [K in SuiRpcMethodName]: SuiClient[K] extends (input: infer P) => Promise<infer R> ? {
        name: K;
        result: R;
        params: P;
    } : SuiClient[K] extends () => Promise<infer R> ? {
        name: K;
        result: R;
        params: undefined | object;
    } : never;
};
export type UseSuiClientQueryOptions<T extends keyof SuiRpcMethods, TData> = PartialBy<Omit<UseQueryOptions<SuiRpcMethods[T]['result'], Error, TData, unknown[]>, 'queryFn'>, 'queryKey'>;
export type GetSuiClientQueryOptions<T extends keyof SuiRpcMethods> = {
    client: SuiClient;
    network: string;
    method: T;
    options?: PartialBy<Omit<UndefinedInitialDataOptions<SuiRpcMethods[T]['result']>, 'queryFn'>, 'queryKey'>;
} & (undefined extends SuiRpcMethods[T]['params'] ? {
    params?: SuiRpcMethods[T]['params'];
} : {
    params: SuiRpcMethods[T]['params'];
});
export declare function getSuiClientQuery<T extends keyof SuiRpcMethods>({ client, network, method, params, options, }: GetSuiClientQueryOptions<T>): import("@tanstack/react-query").OmitKeyof<UseQueryOptions<SuiRpcMethods[T]["result"], Error, SuiRpcMethods[T]["result"], readonly unknown[]>, "queryFn"> & {
    queryFn?: import("@tanstack/react-query").QueryFunction<SuiRpcMethods[T]["result"], readonly unknown[], never> | undefined;
} & {
    queryKey: readonly unknown[] & {
        [dataTagSymbol]: SuiRpcMethods[T]["result"];
        [dataTagErrorSymbol]: Error;
    };
};
export declare function useSuiClientQuery<T extends keyof SuiRpcMethods, TData = SuiRpcMethods[T]['result']>(...args: undefined extends SuiRpcMethods[T]['params'] ? [method: T, params?: SuiRpcMethods[T]['params'], options?: UseSuiClientQueryOptions<T, TData>] : [method: T, params: SuiRpcMethods[T]['params'], options?: UseSuiClientQueryOptions<T, TData>]): UseQueryResult<TData, Error>;
export declare function useSuiClientSuspenseQuery<T extends keyof SuiRpcMethods, TData = SuiRpcMethods[T]['result']>(...args: undefined extends SuiRpcMethods[T]['params'] ? [method: T, params?: SuiRpcMethods[T]['params'], options?: UndefinedInitialDataOptions<TData>] : [method: T, params: SuiRpcMethods[T]['params'], options?: UndefinedInitialDataOptions<TData>]): import("@tanstack/react-query").UseSuspenseQueryResult<SuiRpcMethods[T]["result"], Error>;
