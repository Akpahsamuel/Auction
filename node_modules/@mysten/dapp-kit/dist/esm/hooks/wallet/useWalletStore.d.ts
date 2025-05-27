import type { StoreState } from '../../walletStore.js';
export declare function useWalletStore<T>(selector: (state: StoreState) => T): T;
