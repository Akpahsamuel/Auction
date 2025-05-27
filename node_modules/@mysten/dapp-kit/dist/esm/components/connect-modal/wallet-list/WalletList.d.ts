import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard';
type WalletListProps = {
    selectedWalletName?: string;
    onPlaceholderClick: () => void;
    onSelect: (wallet: WalletWithRequiredFeatures) => void;
    wallets: WalletWithRequiredFeatures[];
};
export declare function WalletList({ selectedWalletName, onPlaceholderClick, onSelect, wallets, }: WalletListProps): import("react/jsx-runtime").JSX.Element;
export {};
