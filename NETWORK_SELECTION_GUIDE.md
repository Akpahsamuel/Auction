# Network Selection Feature

This guide explains the new dynamic network selection feature that allows users to switch between different Sui networks without hardcoded configurations.

## Overview

The auction dApp now supports dynamic network switching with the following networks:
- **Mainnet**: Production network with real assets
- **Testnet**: Test network for development and testing  
- **Devnet**: Development network with latest features
- **Localnet**: Local development environment

## Key Components

### 1. Network Selection Hook (`useNetworkSelection`)
Located in `frontend/auction-dapp/src/hooks/use-network-selection.ts`

**Features:**
- Manages current network state
- Persists network selection in localStorage
- Provides network switching functionality
- Returns network-specific configurations (RPC URLs, package IDs, registry IDs)
- Includes helper functions for explorer URLs and faucet access

**Usage:**
```typescript
import { useNetworkSelection } from '../hooks/use-network-selection';

const { 
  selectedNetwork, 
  switchNetwork, 
  networkConfig, 
  hasFaucet,
  getExplorerUrl 
} = useNetworkSelection();
```

### 2. Network Selector Component (`NetworkSelector`)
Located in `frontend/auction-dapp/src/components/NetworkSelector.tsx`

**Features:**
- Dropdown interface for network selection
- Visual network status indicators
- Faucet links for test networks
- Responsive design (desktop and mobile)
- Loading states during network switches

**Props:**
- `className?: string` - Additional CSS classes
- `showLabel?: boolean` - Whether to show the "Network" label

### 3. Updated Constants (`contants.ts`)
The constants file now uses the dynamic network selection instead of hardcoded values:

```typescript
// Before (hardcoded)
export const CURRENT_NETWORK = 'testnet';

// After (dynamic)
export const getCurrentPackageId = (): string => {
  return getCurrentNetworkConfig().packageId;
};
```

## Network Configurations

Each network includes:
- **RPC URL**: Endpoint for blockchain interactions
- **Package ID**: Smart contract package identifier
- **Auction Registry**: Main auction system registry object
- **Admin Registry**: Admin capability registry object
- **Explorer URL**: Blockchain explorer base URL
- **Faucet URL**: Test SUI faucet (for test networks only)

### Current Network IDs

**Testnet:**
- Package: `0xb73279f99fa432eb9500a9dbdb0deb87eef699df0a259f8186658ea0fb5c47c7`
- Auction Registry: `0xc0440ba4b8e60eb58ac3a195abca8c2ee55bde113ffa832b6fe563f12815e941`
- Admin Registry: `0x3ab6dd3a49f923b3f177fd513fcff05b05112e96c7819d58e048223ac462ff68`

**Devnet:**
- Package: `0xece4964ca3cde5dccfe29d4029d5d5cb952b299cd82ab9b20ad7df3cb409209c`
- Auction Registry: `0xd09cea9f4064a4fd0a2b1d6c4c39eb570a5861498bc6b9823348fe199e298411`
- Admin Registry: `0x9d76585fbfe4aad06a41a4c69536d420515e8b038daa13c29bda85ecc3e07e24`

## User Interface

### Desktop Navigation
The network selector appears in the top navigation bar next to the wallet connect button:
- Compact dropdown showing current network
- Network status indicator with color coding
- Quick access to faucet links for test networks

### Mobile Navigation  
In the mobile menu, the network selector appears as a full-width component:
- Shows network label for clarity
- Maintains all desktop functionality
- Responsive design for touch interfaces

## Technical Implementation

### 1. Dynamic Network Configuration
The `networkConfig.ts` file now generates network configurations dynamically:

```typescript
const createDynamicNetworkConfig = () => {
  const networks: Record<string, { url: string }> = {};
  
  Object.entries(NETWORK_CONFIGS).forEach(([key, config]) => {
    networks[key] = {
      url: config.rpcUrl,
    };
  });
  
  return networks;
};
```

### 2. Persistent Network Selection
User's network choice is saved in localStorage with key `sui-auction-dapp-network`:

```typescript
const saveNetworkSelection = (network: SuiNetwork) => {
  localStorage.setItem('sui-auction-dapp-network', network);
};
```

### 3. Automatic Page Reload
When switching networks, the app automatically reloads to ensure all components use the new network configuration:

```typescript
const switchNetwork = async (network: SuiNetwork) => {
  setSelectedNetwork(network);
  saveNetworkSelection(network);
  window.location.reload(); // Ensures clean state
};
```

## Benefits

### For Users
- **Easy Network Switching**: Switch between networks without manual configuration
- **Visual Feedback**: Clear indication of current network and connection status
- **Faucet Access**: Direct links to get test SUI for development
- **Persistent Choice**: Network selection remembered across sessions

### For Developers
- **No Hardcoding**: All network configurations are centralized and dynamic
- **Easy Deployment**: Add new networks by updating configuration object
- **Type Safety**: Full TypeScript support for network configurations
- **Maintainable**: Single source of truth for network settings

## Adding New Networks

To add a new network, update the `NETWORK_CONFIGS` object in `use-network-selection.ts`:

```typescript
export const NETWORK_CONFIGS: Record<SuiNetwork, NetworkConfig> = {
  // ... existing networks
  newnetwork: {
    name: 'newnetwork',
    displayName: 'New Network',
    rpcUrl: 'https://rpc.newnetwork.sui.io:443',
    faucetUrl: 'https://faucet.newnetwork.sui.io/gas', // optional
    explorerUrl: 'https://explorer.newnetwork.sui.io',
    packageId: '0x...', // deployed package ID
    auctionRegistry: '0x...', // deployed registry ID
    adminRegistry: '0x...', // deployed admin registry ID
  },
};
```

## Migration from Hardcoded Networks

The previous implementation used hardcoded network detection based on hostname patterns. The new system:

1. **Removes hostname-based detection**
2. **Adds user control** over network selection
3. **Provides visual feedback** for current network
4. **Maintains backward compatibility** with existing function names
5. **Improves reliability** by removing environment assumptions

## Future Enhancements

Potential improvements for the network selection feature:
- **Auto-detection**: Detect network from wallet connection
- **Custom Networks**: Allow users to add custom RPC endpoints
- **Network Health**: Show network status and latency
- **Smart Switching**: Automatically switch to optimal network
- **Multi-network**: Support operations across multiple networks simultaneously 