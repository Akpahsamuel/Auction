// src/walletStore.ts
import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// src/utils/walletUtils.ts
import { getWallets, isWalletWithRequiredFeatureSet } from "@mysten/wallet-standard";
function getWalletUniqueIdentifier(wallet) {
  return wallet?.id ?? wallet?.name;
}

// src/walletStore.ts
function createWalletStore({
  wallets,
  storage,
  storageKey,
  autoConnectEnabled
}) {
  return createStore()(
    persist(
      (set, get) => ({
        autoConnectEnabled,
        wallets,
        accounts: [],
        currentWallet: null,
        currentAccount: null,
        lastConnectedAccountAddress: null,
        lastConnectedWalletName: null,
        connectionStatus: "disconnected",
        supportedIntents: [],
        setConnectionStatus(connectionStatus) {
          set(() => ({
            connectionStatus
          }));
        },
        setWalletConnected(wallet, connectedAccounts, selectedAccount, supportedIntents = []) {
          set(() => ({
            accounts: connectedAccounts,
            currentWallet: wallet,
            currentAccount: selectedAccount,
            lastConnectedWalletName: getWalletUniqueIdentifier(wallet),
            lastConnectedAccountAddress: selectedAccount?.address,
            connectionStatus: "connected",
            supportedIntents
          }));
        },
        setWalletDisconnected() {
          set(() => ({
            accounts: [],
            currentWallet: null,
            currentAccount: null,
            lastConnectedWalletName: null,
            lastConnectedAccountAddress: null,
            connectionStatus: "disconnected",
            supportedIntents: []
          }));
        },
        setAccountSwitched(selectedAccount) {
          set(() => ({
            currentAccount: selectedAccount,
            lastConnectedAccountAddress: selectedAccount.address
          }));
        },
        setWalletRegistered(updatedWallets) {
          set(() => ({ wallets: updatedWallets }));
        },
        setWalletUnregistered(updatedWallets, unregisteredWallet) {
          if (unregisteredWallet === get().currentWallet) {
            set(() => ({
              wallets: updatedWallets,
              accounts: [],
              currentWallet: null,
              currentAccount: null,
              lastConnectedWalletName: null,
              lastConnectedAccountAddress: null,
              connectionStatus: "disconnected",
              supportedIntents: []
            }));
          } else {
            set(() => ({ wallets: updatedWallets }));
          }
        },
        updateWalletAccounts(accounts) {
          const currentAccount = get().currentAccount;
          set(() => ({
            accounts,
            currentAccount: currentAccount && accounts.find(({ address }) => address === currentAccount.address) || accounts[0]
          }));
        }
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => storage),
        partialize: ({ lastConnectedWalletName, lastConnectedAccountAddress }) => ({
          lastConnectedWalletName,
          lastConnectedAccountAddress
        })
      }
    )
  );
}
export {
  createWalletStore
};
//# sourceMappingURL=walletStore.js.map
