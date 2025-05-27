import { SuiClient } from '@mysten/sui/client';
import type { NetworkConfig } from '../hooks/networkConfig.js';
type NetworkConfigs<T extends NetworkConfig | SuiClient = NetworkConfig | SuiClient> = Record<string, T>;
export interface SuiClientProviderContext {
    client: SuiClient;
    networks: NetworkConfigs;
    network: string;
    config: NetworkConfig | null;
    selectNetwork: (network: string) => void;
}
export declare const SuiClientContext: import("react").Context<SuiClientProviderContext | null>;
export type SuiClientProviderProps<T extends NetworkConfigs> = {
    createClient?: (name: keyof T, config: T[keyof T]) => SuiClient;
    children: React.ReactNode;
    networks?: T;
    onNetworkChange?: (network: keyof T & string) => void;
} & ({
    defaultNetwork?: keyof T & string;
    network?: never;
} | {
    defaultNetwork?: never;
    network?: keyof T & string;
});
export declare function SuiClientProvider<T extends NetworkConfigs>(props: SuiClientProviderProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
