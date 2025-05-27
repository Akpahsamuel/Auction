export declare const WalletContext: import("react").Context<(Omit<import("zustand").StoreApi<import("../walletStore.js").StoreState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware.js").PersistOptions<import("../walletStore.js").StoreState, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: import("../walletStore.js").StoreState) => void) => () => void;
        onFinishHydration: (fn: (state: import("../walletStore.js").StoreState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware.js").PersistOptions<import("../walletStore.js").StoreState, unknown>>;
    };
}) | null>;
