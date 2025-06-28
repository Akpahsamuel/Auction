import { createNetworkConfig } from "@mysten/dapp-kit";
import { NETWORK_CONFIGS } from "./hooks/use-network-selection";

// Create network config from our dynamic configuration
const createDynamicNetworkConfig = () => {
  const networks: Record<string, { url: string }> = {};
  
  Object.entries(NETWORK_CONFIGS).forEach(([key, config]) => {
    networks[key] = {
      url: config.rpcUrl,
    };
  });
  
  return networks;
};

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig(createDynamicNetworkConfig());

export { useNetworkVariable, useNetworkVariables, networkConfig };
