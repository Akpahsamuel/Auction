// src/components/SuiClientProvider.tsx
import { getFullnodeUrl, isSuiClient, SuiClient } from "@mysten/sui/client";
import { createContext, useMemo, useState } from "react";
import { jsx } from "react/jsx-runtime";
var SuiClientContext = createContext(null);
var DEFAULT_NETWORKS = {
  localnet: { url: getFullnodeUrl("localnet") }
};
var DEFAULT_CREATE_CLIENT = function createClient(_name, config) {
  if (isSuiClient(config)) {
    return config;
  }
  return new SuiClient(config);
};
function SuiClientProvider(props) {
  const { onNetworkChange, network, children } = props;
  const networks = props.networks ?? DEFAULT_NETWORKS;
  const createClient2 = props.createClient ?? DEFAULT_CREATE_CLIENT;
  const [selectedNetwork, setSelectedNetwork] = useState(
    props.network ?? props.defaultNetwork ?? Object.keys(networks)[0]
  );
  const currentNetwork = props.network ?? selectedNetwork;
  const client = useMemo(() => {
    return createClient2(currentNetwork, networks[currentNetwork]);
  }, [createClient2, currentNetwork, networks]);
  const ctx = useMemo(() => {
    return {
      client,
      networks,
      network: currentNetwork,
      config: networks[currentNetwork] instanceof SuiClient ? null : networks[currentNetwork],
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
  return /* @__PURE__ */ jsx(SuiClientContext.Provider, { value: ctx, children });
}
export {
  SuiClientContext,
  SuiClientProvider
};
//# sourceMappingURL=SuiClientProvider.js.map
