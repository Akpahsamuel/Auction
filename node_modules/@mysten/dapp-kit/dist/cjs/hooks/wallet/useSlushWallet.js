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

// src/hooks/wallet/useSlushWallet.ts
var useSlushWallet_exports = {};
__export(useSlushWallet_exports, {
  useSlushWallet: () => useSlushWallet
});
module.exports = __toCommonJS(useSlushWallet_exports);
var import_slush_wallet = require("@mysten/slush-wallet");
var import_react = require("react");
function useSlushWallet(config) {
  (0, import_react.useLayoutEffect)(() => {
    if (!config?.name) {
      return;
    }
    let cleanup;
    let isMounted = true;
    try {
      const result = (0, import_slush_wallet.registerSlushWallet)(config.name, {
        origin: config.origin
      });
      if (isMounted && result) {
        cleanup = result.unregister;
      } else if (result) {
        result.unregister();
      }
    } catch (error) {
      console.error("Failed to register Slush wallet:", error);
    }
    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [config?.name, config?.origin]);
}
//# sourceMappingURL=useSlushWallet.js.map
