import { useState, useEffect, useCallback } from 'react';

export type SuiNetwork = 'mainnet' | 'testnet' | 'devnet' | 'localnet';

export interface NetworkConfig {
  name: string;
  displayName: string;
  rpcUrl: string;
  faucetUrl?: string;
  explorerUrl: string;
  packageId: string;
  auctionRegistry: string;
  adminRegistry: string;
}

// Network configurations with correct IDs
export const NETWORK_CONFIGS: Record<SuiNetwork, NetworkConfig> = {
  mainnet: {
    name: 'mainnet',
    displayName: 'Mainnet',
    rpcUrl: 'https://fullnode.mainnet.sui.io:443',
    explorerUrl: 'https://suiscan.xyz/mainnet',
    packageId: '0x0', // Replace with actual mainnet package ID
    auctionRegistry: '0x0', // Replace with actual mainnet auction registry
    adminRegistry: '0x0', // Replace with actual mainnet admin registry
  },
  testnet: {
    name: 'testnet',
    displayName: 'Testnet',
    rpcUrl: 'https://fullnode.testnet.sui.io:443',
    faucetUrl: 'https://faucet.testnet.sui.io/gas',
    explorerUrl: 'https://suiscan.xyz/testnet',
    packageId: '0xb73279f99fa432eb9500a9dbdb0deb87eef699df0a259f8186658ea0fb5c47c7',
    auctionRegistry: '0xc0440ba4b8e60eb58ac3a195abca8c2ee55bde113ffa832b6fe563f12815e941',
    adminRegistry: '0x3ab6dd3a49f923b3f177fd513fcff05b05112e96c7819d58e048223ac462ff68',
  },
  devnet: {
    name: 'devnet',
    displayName: 'Devnet',
    rpcUrl: 'https://fullnode.devnet.sui.io:443',
    faucetUrl: 'https://faucet.devnet.sui.io/gas',
    explorerUrl: 'https://suiscan.xyz/devnet',
    packageId: '0xece4964ca3cde5dccfe29d4029d5d5cb952b299cd82ab9b20ad7df3cb409209c',
    auctionRegistry: '0xd09cea9f4064a4fd0a2b1d6c4c39eb570a5861498bc6b9823348fe199e298411',
    adminRegistry: '0x9d76585fbfe4aad06a41a4c69536d420515e8b038daa13c29bda85ecc3e07e24',
  },
  localnet: {
    name: 'localnet',
    displayName: 'Local Network',
    rpcUrl: 'http://127.0.0.1:9000',
    faucetUrl: 'http://127.0.0.1:9123/gas',
    explorerUrl: 'http://localhost:3000', // Local explorer if available
    packageId: '0x0', // Replace with actual local package ID
    auctionRegistry: '0x0', // Replace with actual local auction registry
    adminRegistry: '0x0', // Replace with actual local admin registry
  },
};

const STORAGE_KEY = 'sui-auction-dapp-network';

export const useNetworkSelection = () => {
  // Initialize with testnet as default
  const [selectedNetwork, setSelectedNetwork] = useState<SuiNetwork>('testnet');
  const [isLoading, setIsLoading] = useState(false);

  // Load saved network from localStorage on mount
  useEffect(() => {
    const savedNetwork = localStorage.getItem(STORAGE_KEY);
    if (savedNetwork && savedNetwork in NETWORK_CONFIGS) {
      setSelectedNetwork(savedNetwork as SuiNetwork);
    }
  }, []);

  // Save network selection to localStorage
  const saveNetworkSelection = useCallback((network: SuiNetwork) => {
    localStorage.setItem(STORAGE_KEY, network);
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (network: SuiNetwork) => {
    if (network === selectedNetwork) return;
    
    setIsLoading(true);
    try {
      setSelectedNetwork(network);
      saveNetworkSelection(network);
      
      // Optional: Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trigger page reload to ensure all components use the new network
      window.location.reload();
    } catch (error) {
      console.error('Error switching network:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedNetwork, saveNetworkSelection]);

  // Get current network config
  const getCurrentNetworkConfig = useCallback((): NetworkConfig => {
    return NETWORK_CONFIGS[selectedNetwork];
  }, [selectedNetwork]);

  // Get all available networks
  const getAvailableNetworks = useCallback((): SuiNetwork[] => {
    return Object.keys(NETWORK_CONFIGS) as SuiNetwork[];
  }, []);

  // Check if network has faucet
  const hasFaucet = useCallback((network?: SuiNetwork): boolean => {
    const targetNetwork = network || selectedNetwork;
    return !!NETWORK_CONFIGS[targetNetwork].faucetUrl;
  }, [selectedNetwork]);

  // Get explorer URL for an object
  const getExplorerUrl = useCallback((objectId: string, network?: SuiNetwork): string => {
    const targetNetwork = network || selectedNetwork;
    const config = NETWORK_CONFIGS[targetNetwork];
    return `${config.explorerUrl}/object/${objectId}`;
  }, [selectedNetwork]);

  // Get transaction explorer URL
  const getTransactionExplorerUrl = useCallback((txDigest: string, network?: SuiNetwork): string => {
    const targetNetwork = network || selectedNetwork;
    const config = NETWORK_CONFIGS[targetNetwork];
    return `${config.explorerUrl}/tx/${txDigest}`;
  }, [selectedNetwork]);

  return {
    selectedNetwork,
    switchNetwork,
    getCurrentNetworkConfig,
    getAvailableNetworks,
    hasFaucet,
    getExplorerUrl,
    getTransactionExplorerUrl,
    isLoading,
    networkConfig: getCurrentNetworkConfig(),
  };
}; 