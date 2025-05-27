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

// src/hooks/wallet/useAccounts.ts
var useAccounts_exports = {};
__export(useAccounts_exports, {
  useAccounts: () => useAccounts
});
module.exports = __toCommonJS(useAccounts_exports);

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

// src/hooks/wallet/useAccounts.ts
function useAccounts() {
  return useWalletStore((state) => state.accounts);
}
//# sourceMappingURL=useAccounts.js.map
