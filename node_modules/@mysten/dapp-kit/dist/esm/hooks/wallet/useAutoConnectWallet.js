// src/hooks/wallet/useAutoConnectWallet.ts
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useState } from "react";

// src/utils/walletUtils.ts
import { getWallets, isWalletWithRequiredFeatureSet } from "@mysten/wallet-standard";
function getWalletUniqueIdentifier(wallet) {
  return wallet?.id ?? wallet?.name;
}

// src/hooks/wallet/useConnectWallet.ts
import { useMutation } from "@tanstack/react-query";

// src/constants/walletMutationKeys.ts
var walletMutationKeys = {
  all: { baseScope: "wallet" },
  connectWallet: formMutationKeyFn("connect-wallet"),
  autoconnectWallet: formMutationKeyFn("autoconnect-wallet"),
  disconnectWallet: formMutationKeyFn("disconnect-wallet"),
  signPersonalMessage: formMutationKeyFn("sign-personal-message"),
  signTransaction: formMutationKeyFn("sign-transaction"),
  signAndExecuteTransaction: formMutationKeyFn("sign-and-execute-transaction"),
  switchAccount: formMutationKeyFn("switch-account"),
  reportTransactionEffects: formMutationKeyFn("report-transaction-effects")
};
function formMutationKeyFn(baseEntity) {
  return function mutationKeyFn(additionalKeys = []) {
    return [{ ...walletMutationKeys.all, baseEntity }, ...additionalKeys];
  };
}

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

// src/hooks/wallet/useConnectWallet.ts
function useConnectWallet({
  mutationKey,
  ...mutationOptions
} = {}) {
  const setWalletConnected = useWalletStore((state) => state.setWalletConnected);
  const setConnectionStatus = useWalletStore((state) => state.setConnectionStatus);
  return useMutation({
    mutationKey: walletMutationKeys.connectWallet(mutationKey),
    mutationFn: async ({ wallet, accountAddress, ...connectArgs }) => {
      try {
        setConnectionStatus("connecting");
        const connectResult = await wallet.features["standard:connect"].connect(connectArgs);
        const connectedSuiAccounts = connectResult.accounts.filter(
          (account) => account.chains.some((chain) => chain.split(":")[0] === "sui")
        );
        const selectedAccount = getSelectedAccount(connectedSuiAccounts, accountAddress);
        setWalletConnected(
          wallet,
          connectedSuiAccounts,
          selectedAccount,
          connectResult.supportedIntents
        );
        return { accounts: connectedSuiAccounts };
      } catch (error) {
        setConnectionStatus("disconnected");
        throw error;
      }
    },
    ...mutationOptions
  });
}
function getSelectedAccount(connectedAccounts, accountAddress) {
  if (connectedAccounts.length === 0) {
    return null;
  }
  if (accountAddress) {
    const selectedAccount = connectedAccounts.find((account) => account.address === accountAddress);
    return selectedAccount ?? connectedAccounts[0];
  }
  return connectedAccounts[0];
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

// src/hooks/wallet/useWallets.ts
function useWallets() {
  return useWalletStore((state) => state.wallets);
}

// src/hooks/wallet/useAutoConnectWallet.ts
function useAutoConnectWallet() {
  const { mutateAsync: connectWallet } = useConnectWallet();
  const autoConnectEnabled = useWalletStore((state) => state.autoConnectEnabled);
  const lastConnectedWalletName = useWalletStore((state) => state.lastConnectedWalletName);
  const lastConnectedAccountAddress = useWalletStore((state) => state.lastConnectedAccountAddress);
  const wallets = useWallets();
  const { isConnected } = useCurrentWallet();
  const [clientOnly, setClientOnly] = useState(false);
  useLayoutEffect(() => {
    setClientOnly(true);
  }, []);
  const { data, isError } = useQuery({
    queryKey: [
      "@mysten/dapp-kit",
      "autoconnect",
      {
        isConnected,
        autoConnectEnabled,
        lastConnectedWalletName,
        lastConnectedAccountAddress,
        walletCount: wallets.length
      }
    ],
    queryFn: async () => {
      if (!autoConnectEnabled) {
        return "disabled";
      }
      if (!lastConnectedWalletName || !lastConnectedAccountAddress || isConnected) {
        return "attempted";
      }
      const wallet = wallets.find(
        (wallet2) => getWalletUniqueIdentifier(wallet2) === lastConnectedWalletName
      );
      if (wallet) {
        await connectWallet({
          wallet,
          accountAddress: lastConnectedAccountAddress,
          silent: true
        });
      }
      return "attempted";
    },
    enabled: autoConnectEnabled,
    persister: void 0,
    gcTime: 0,
    staleTime: 0,
    networkMode: "always",
    retry: false,
    retryOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });
  if (!autoConnectEnabled) {
    return "disabled";
  }
  if (!clientOnly) {
    return "idle";
  }
  if (isConnected) {
    return "attempted";
  }
  if (!lastConnectedWalletName) {
    return "attempted";
  }
  return isError ? "attempted" : data ?? "idle";
}
export {
  useAutoConnectWallet
};
//# sourceMappingURL=useAutoConnectWallet.js.map
