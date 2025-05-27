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

// src/hooks/networkConfig.ts
var networkConfig_exports = {};
__export(networkConfig_exports, {
  createNetworkConfig: () => createNetworkConfig
});
module.exports = __toCommonJS(networkConfig_exports);

// src/hooks/useSuiClient.ts
var import_react2 = require("react");

// src/components/SuiClientProvider.tsx
var import_client = require("@mysten/sui/client");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var SuiClientContext = (0, import_react.createContext)(null);
var DEFAULT_NETWORKS = {
  localnet: { url: (0, import_client.getFullnodeUrl)("localnet") }
};

// src/hooks/useSuiClient.ts
function useSuiClientContext() {
  const suiClient = (0, import_react2.useContext)(SuiClientContext);
  if (!suiClient) {
    throw new Error(
      "Could not find SuiClientContext. Ensure that you have set up the SuiClientProvider"
    );
  }
  return suiClient;
}

// src/hooks/networkConfig.ts
function createNetworkConfig(networkConfig) {
  function useNetworkConfig() {
    const { config } = useSuiClientContext();
    if (!config) {
      throw new Error("No network config found");
    }
    return config;
  }
  function useNetworkVariables() {
    const { variables } = useNetworkConfig();
    return variables ?? {};
  }
  function useNetworkVariable(name) {
    const variables = useNetworkVariables();
    return variables[name];
  }
  return {
    networkConfig,
    useNetworkConfig,
    useNetworkVariables,
    useNetworkVariable
  };
}
//# sourceMappingURL=networkConfig.js.map
