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

// src/components/SuiClientProvider.tsx
var SuiClientProvider_exports = {};
__export(SuiClientProvider_exports, {
  SuiClientContext: () => SuiClientContext,
  SuiClientProvider: () => SuiClientProvider
});
module.exports = __toCommonJS(SuiClientProvider_exports);
var import_client = require("@mysten/sui/client");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var SuiClientContext = (0, import_react.createContext)(null);
var DEFAULT_NETWORKS = {
  localnet: { url: (0, import_client.getFullnodeUrl)("localnet") }
};
var DEFAULT_CREATE_CLIENT = function createClient(_name, config) {
  if ((0, import_client.isSuiClient)(config)) {
    return config;
  }
  return new import_client.SuiClient(config);
};
function SuiClientProvider(props) {
  const { onNetworkChange, network, children } = props;
  const networks = props.networks ?? DEFAULT_NETWORKS;
  const createClient2 = props.createClient ?? DEFAULT_CREATE_CLIENT;
  const [selectedNetwork, setSelectedNetwork] = (0, import_react.useState)(
    props.network ?? props.defaultNetwork ?? Object.keys(networks)[0]
  );
  const currentNetwork = props.network ?? selectedNetwork;
  const client = (0, import_react.useMemo)(() => {
    return createClient2(currentNetwork, networks[currentNetwork]);
  }, [createClient2, currentNetwork, networks]);
  const ctx = (0, import_react.useMemo)(() => {
    return {
      client,
      networks,
      network: currentNetwork,
      config: networks[currentNetwork] instanceof import_client.SuiClient ? null : networks[currentNetwork],
      selectNetwork: (newNetwork) => {
        if (currentNetwork === newNetwork) {
          return;
        }
        if (!network && newNetwork !== selectedNetwork) {
          setSelectedNetwork(newNetwork);
        }
        onNetworkChange?.(newNetwork);
      }
    };
  }, [client, networks, selectedNetwork, currentNetwork, network, onNetworkChange]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuiClientContext.Provider, { value: ctx, children });
}
//# sourceMappingURL=SuiClientProvider.js.map
