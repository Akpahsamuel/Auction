import type { ResolvedNameServiceNames } from '@mysten/sui/client';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
export declare function useResolveSuiNSName(address?: string | null, options?: Omit<UseQueryOptions<ResolvedNameServiceNames, Error, string | null, unknown[]>, 'queryFn' | 'queryKey' | 'select'>): UseQueryResult<string | null, Error>;
