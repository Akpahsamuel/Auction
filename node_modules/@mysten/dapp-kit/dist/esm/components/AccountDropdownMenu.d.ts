import type { WalletAccount } from '@mysten/wallet-standard';
type AccountDropdownMenuProps = {
    currentAccount: WalletAccount;
};
export declare function AccountDropdownMenu({ currentAccount }: AccountDropdownMenuProps): import("react/jsx-runtime").JSX.Element;
export declare function AccountDropdownMenuItem({ account, active, }: {
    account: WalletAccount;
    active?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export {};
