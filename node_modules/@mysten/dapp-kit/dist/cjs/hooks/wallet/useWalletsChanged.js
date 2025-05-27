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

// src/hooks/wallet/useWalletsChanged.ts
var useWalletsChanged_exports = {};
__export(useWalletsChanged_exports, {
  useWalletsChanged: () => useWalletsChanged
});
module.exports = __toCommonJS(useWalletsChanged_exports);
var import_wallet_standard2 = require("@mysten/wallet-standard");
var import_react3 = require("react");

// src/utils/walletUtils.ts
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

// src/hooks/wallet/useWalletStore.ts
var import_react2 = require("react");
var import_zustand = require("zustand");

// src/contexts/walletContext.ts
var import_react = require("react");
var WalletContext = (0, import_react.createContext)(null);

// src/hooks/wallet/useWalletStore.ts
function useWalletStore(selector) {
  const store = (0, import_react2.useContext)(WalletContext);
  if (!store) {
    throw new Error(
      "Could not find WalletContext. Ensure that you have set up the WalletProvider."
    );
  }
  return (0, import_zustand.useStore)(store, selector);
}

// src/hooks/wallet/useWalletsChanged.ts
function useWalletsChanged(preferredWallets, walletFilter) {
  const setWalletRegistered = useWalletStore((state) => state.setWalletRegistered);
  const setWalletUnregistered = useWalletStore((state) => state.setWalletUnregistered);
  (0, import_react3.useEffect)(() => {
    const walletsApi = (0, import_wallet_standard2.getWallets)();
    setWalletRegistered(getRegisteredWallets(preferredWallets, walletFilter));
    const unsubscribeFromRegister = walletsApi.on("register", () => {
      setWalletRegistered(getRegisteredWallets(preferredWallets, walletFilter));
    });
    const unsubscribeFromUnregister = walletsApi.on("unregister", (unregisteredWallet) => {
      setWalletUnregistered(
        getRegisteredWallets(preferredWallets, walletFilter),
        unregisteredWallet
      );
    });
    return () => {
      unsubscribeFromRegister();
      unsubscribeFromUnregister();
    };
  }, [preferredWallets, walletFilter, setWalletRegistered, setWalletUnregistered]);
}
//# sourceMappingURL=useWalletsChanged.js.map
