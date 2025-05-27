import type { SuiClientOptions } from '@mysten/sui/client';
export type NetworkConfig<T extends object = object> = SuiClientOptions & {
    variables?: T;
};
export declare function createNetworkConfig<const T extends Record<string, Config>, Config extends NetworkConfig<Variables> = T[keyof T], Variables extends object = NonNullable<Config['variables']>>(networkConfig: T): {
    networkConfig: T;
    useNetworkConfig: () => Config;
    useNetworkVariables: () => Variables;
    useNetworkVariable: <K extends keyof Variables>(name: K) => Variables[K];
};
