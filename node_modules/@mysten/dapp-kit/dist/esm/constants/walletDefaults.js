// src/constants/walletDefaults.ts
import { SLUSH_WALLET_NAME } from "@mysten/slush-wallet";

// src/utils/stateStorage.ts
function createInMemoryStore() {
  const store = /* @__PURE__ */ new Map();
  return {
    getItem(key) {
      return store.get(key);
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    }
  };
}

// src/constants/walletDefaults.ts
var SUI_WALLET_NAME = "Sui Wallet";
var DEFAULT_STORAGE = typeof window !== "undefined" && window.localStorage ? localStorage : createInMemoryStore();
var DEFAULT_STORAGE_KEY = "sui-dapp-kit:wallet-connection-info";
var SIGN_FEATURES = [
  "sui:signTransaction",
  "sui:signTransactionBlock"
];
var DEFAULT_WALLET_FILTER = (wallet) => SIGN_FEATURES.some((feature) => wallet.features[feature]);
var DEFAULT_PREFERRED_WALLETS = [SUI_WALLET_NAME, SLUSH_WALLET_NAME];
export {
  DEFAULT_PREFERRED_WALLETS,
  DEFAULT_STORAGE,
  DEFAULT_STORAGE_KEY,
  DEFAULT_WALLET_FILTER,
  SUI_WALLET_NAME
};
//# sourceMappingURL=walletDefaults.js.map
