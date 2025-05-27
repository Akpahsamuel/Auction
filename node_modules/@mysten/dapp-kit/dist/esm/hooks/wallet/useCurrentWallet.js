// src/hooks/wallet/useWalletStore.ts
import { useContext } from "react";
import { useStore } from "zustand";

// src/contexts/walletContext.ts
import { createContext } from "react";
var WalletContext = createContext(null);

// src/hooks/wallet/useWalletStore.ts
function useWalletStore(selector) {
  const store = useContext(WalletContext);
  if (!store) {
    throw new Error(
      "Could not find WalletContext. Ensure that you have set up the WalletProvider."
    );
  }
  return useStore(store, selector);
}

// src/hooks/wallet/useCurrentWallet.ts
function useCurrentWallet() {
  const currentWallet = useWalletStore((state) => state.currentWallet);
  const connectionStatus = useWalletStore((state) => state.connectionStatus);
  const supportedIntents = useWalletStore((state) => state.supportedIntents);
  switch (connectionStatus) {
    case "connecting":
      return {
        connectionStatus,
        currentWallet: null,
        isDisconnected: false,
        isConnecting: true,
        isConnected: false,
        supportedIntents: []
      };
    case "disconnected":
      return {
        connectionStatus,
        currentWallet: null,
        isDisconnected: true,
        isConnecting: false,
        isConnected: false,
        supportedIntents: []
      };
    case "connected": {
      return {
        connectionStatus,
        currentWallet,
        isDisconnected: false,
        isConnecting: false,
        isConnected: true,
        supportedIntents
      };
    }
  }
}
export {
  useCurrentWallet
};
//# sourceMappingURL=useCurrentWallet.js.map
