import type { StandardConnectFeature, StandardDisconnectFeature, StandardEventsFeature, SuiChain, SuiSignAndExecuteTransactionFeature, SuiSignPersonalMessageFeature, SuiSignTransactionBlockFeature, SuiSignTransactionFeature, Wallet } from '@mysten/wallet-standard';
import { ReadonlyWalletAccount } from '@mysten/wallet-standard';
import type { InferOutput } from 'valibot';
export declare const SLUSH_WALLET_NAME: "Slush";
declare const WalletMetadataSchema: import("valibot").ObjectSchema<{
    readonly id: import("valibot").StringSchema<"Wallet ID is required">;
    readonly walletName: import("valibot").StringSchema<"Wallet name is required">;
    readonly icon: import("valibot").StringSchema<"Icon must be a valid wallet icon format">;
    readonly enabled: import("valibot").BooleanSchema<"Enabled is required">;
}, undefined>;
type WalletMetadata = InferOutput<typeof WalletMetadataSchema>;
export declare class SlushWallet implements Wallet {
    #private;
    get name(): string;
    get id(): string;
    get icon(): `data:image/svg+xml;base64,${string}` | `data:image/webp;base64,${string}` | `data:image/png;base64,${string}` | `data:image/gif;base64,${string}`;
    get version(): "1.0.0";
    get chains(): readonly ["sui:devnet", "sui:testnet", "sui:localnet", "sui:mainnet"];
    get accounts(): ReadonlyWalletAccount[];
    get features(): StandardConnectFeature & StandardDisconnectFeature & StandardEventsFeature & SuiSignTransactionBlockFeature & SuiSignTransactionFeature & SuiSignPersonalMessageFeature & SuiSignAndExecuteTransactionFeature;
    constructor({ name, origin, metadata, }: {
        name: string;
        origin?: string;
        chain?: SuiChain;
        metadata: WalletMetadata;
    });
    updateMetadata(metadata: WalletMetadata): void;
}
export declare function registerSlushWallet(name: string, { origin, metadataApiUrl, }?: {
    origin?: string;
    metadataApiUrl?: string;
}): {
    wallet: SlushWallet;
    unregister: () => void;
} | undefined;
export {};
