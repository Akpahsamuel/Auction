import type { WalletWithRequiredFeatures } from '@mysten/wallet-standard';
import type { ReactNode } from 'react';
type ControlledModalProps = {
    /** The controlled open state of the dialog. */
    open: boolean;
    /** Event handler called when the open state of the dialog changes. */
    onOpenChange: (open: boolean) => void;
    defaultOpen?: never;
};
type UncontrolledModalProps = {
    open?: never;
    onOpenChange?: never;
    /** The open state of the dialog when it is initially rendered. Use when you do not need to control its open state. */
    defaultOpen?: boolean;
};
type ConnectModalProps = {
    /** The trigger button that opens the dialog. */
    trigger: NonNullable<ReactNode>;
    /** Filter the wallets shown in the modal. */
    walletFilter?: (wallet: WalletWithRequiredFeatures) => boolean;
} & (ControlledModalProps | UncontrolledModalProps);
export declare function ConnectModal({ trigger, open, defaultOpen, onOpenChange, walletFilter, }: ConnectModalProps): import("react/jsx-runtime").JSX.Element;
export {};
