import type { ReactNode } from 'react';
type WalletListItemProps = {
    name: string;
    icon: ReactNode;
    isSelected?: boolean;
    onClick: () => void;
};
export declare function WalletListItem({ name, icon, onClick, isSelected }: WalletListItemProps): import("react/jsx-runtime.js").JSX.Element;
export {};
