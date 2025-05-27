import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
type ConnectButtonProps = {
    connectText?: ReactNode;
    /** Filter the wallets shown in the connect modal */
    walletFilter?: (wallet: WalletWithRequiredFeatures) => boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;
export declare function ConnectButton({ connectText, walletFilter, ...buttonProps }: ConnectButtonProps): import("react/jsx-runtime.js").JSX.Element;
export {};
