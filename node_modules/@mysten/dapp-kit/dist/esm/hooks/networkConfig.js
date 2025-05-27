// src/hooks/useSuiClient.ts
import { useContext } from "react";

// src/components/SuiClientProvider.tsx
import { getFullnodeUrl, isSuiClient, SuiClient } from "@mysten/sui/client";
import { createContext, useMemo, useState } from "react";
import { jsx } from "react/jsx-runtime";
var SuiClientContext = createContext(null);
var DEFAULT_NETWORKS = {
  localnet: { url: getFullnodeUrl("localnet") }
};

// src/hooks/useSuiClient.ts
function useSuiClientContext() {
  const suiClient = useContext(SuiClientContext);
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
export {
  createNetworkConfig
};
//# sourceMappingURL=networkConfig.js.map
