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

// src/constants/walletDefaults.ts
var walletDefaults_exports = {};
__export(walletDefaults_exports, {
  DEFAULT_PREFERRED_WALLETS: () => DEFAULT_PREFERRED_WALLETS,
  DEFAULT_STORAGE: () => DEFAULT_STORAGE,
  DEFAULT_STORAGE_KEY: () => DEFAULT_STORAGE_KEY,
  DEFAULT_WALLET_FILTER: () => DEFAULT_WALLET_FILTER,
  SUI_WALLET_NAME: () => SUI_WALLET_NAME
});
module.exports = __toCommonJS(walletDefaults_exports);
var import_slush_wallet = require("@mysten/slush-wallet");

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
var DEFAULT_PREFERRED_WALLETS = [SUI_WALLET_NAME, import_slush_wallet.SLUSH_WALLET_NAME];
//# sourceMappingURL=walletDefaults.js.map
