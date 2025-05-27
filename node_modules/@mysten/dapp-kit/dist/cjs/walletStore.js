"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/walletStore.ts
var walletStore_exports = {};
__export(walletStore_exports, {
  createWalletStore: () => createWalletStore
});
module.exports = __toCommonJS(walletStore_exports);
var import_zustand = require("zustand");
var import_middleware = require("zustand/middleware");

// src/utils/walletUtils.ts
var import_wallet_standard = require("@mysten/wallet-standard");
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
  return (0, import_zustand.createStore)()(
    (0, import_middleware.persist)(
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
        storage: (0, import_middleware.createJSONStorage)(() => storage),
        partialize: ({ lastConnectedWalletName, lastConnectedAccountAddress }) => ({
          lastConnectedWalletName,
          lastConnectedAccountAddress
        })
      }
    )
  );
}
//# sourceMappingURL=walletStore.js.map
