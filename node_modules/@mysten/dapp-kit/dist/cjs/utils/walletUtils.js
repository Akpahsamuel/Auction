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

// src/utils/walletUtils.ts
var walletUtils_exports = {};
__export(walletUtils_exports, {
  getRegisteredWallets: () => getRegisteredWallets,
  getWalletUniqueIdentifier: () => getWalletUniqueIdentifier
});
module.exports = __toCommonJS(walletUtils_exports);
var import_wallet_standard = require("@mysten/wallet-standard");
function getRegisteredWallets(preferredWallets, walletFilter) {
  const walletsApi = (0, import_wallet_standard.getWallets)();
  const wallets = walletsApi.get();
  const suiWallets = wallets.filter(
    (wallet) => (0, import_wallet_standard.isWalletWithRequiredFeatureSet)(wallet) && (!walletFilter || walletFilter(wallet))
  );
  return [
    // Preferred wallets, in order:
    ...preferredWallets.map((name) => suiWallets.find((wallet) => wallet.name === name)).filter(Boolean),
    // Wallets in default order:
    ...suiWallets.filter((wallet) => !preferredWallets.includes(wallet.name))
  ];
}
function getWalletUniqueIdentifier(wallet) {
  return wallet?.id ?? wallet?.name;
}
//# sourceMappingURL=walletUtils.js.map
