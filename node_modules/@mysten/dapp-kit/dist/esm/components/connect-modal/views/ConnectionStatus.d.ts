import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard';
type ConnectionStatusProps = {
    selectedWallet: WalletWithRequiredFeatures;
    hadConnectionError: boolean;
    onRetryConnection: (selectedWallet: WalletWithRequiredFeatures) => void;
};
export declare function ConnectionStatus({ selectedWallet, hadConnectionError, onRetryConnection, }: ConnectionStatusProps): import("react/jsx-runtime").JSX.Element;
export {};
