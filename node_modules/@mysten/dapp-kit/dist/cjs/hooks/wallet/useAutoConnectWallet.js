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

// src/hooks/wallet/useAutoConnectWallet.ts
var useAutoConnectWallet_exports = {};
__export(useAutoConnectWallet_exports, {
  useAutoConnectWallet: () => useAutoConnectWallet
});
module.exports = __toCommonJS(useAutoConnectWallet_exports);
var import_react_query2 = require("@tanstack/react-query");
var import_react3 = require("react");

// src/utils/walletUtils.ts
var import_wallet_standard = require("@mysten/wallet-standard");
function getWalletUniqueIdentifier(wallet) {
  return wallet?.id ?? wallet?.name;
}

// src/hooks/wallet/useConnectWallet.ts
var import_react_query = require("@tanstack/react-query");

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
var import_react2 = require("react");
var import_zustand = require("zustand");

// src/contexts/walletContext.ts
var import_react = require("react");
var WalletContext = (0, import_react.createContext)(null);

// src/hooks/wallet/useWalletStore.ts
function useWalletStore(selector) {
  const store = (0, import_react2.useContext)(WalletContext);
  if (!store) {
    throw new Error(
      "Could not find WalletContext. Ensure that you have set up the WalletProvider."
    );
  }
  return (0, import_zustand.useStore)(store, selector);
}

// src/hooks/wallet/useConnectWallet.ts
function useConnectWallet({
  mutationKey,
  ...mutationOptions
} = {}) {
  const setWalletConnected = useWalletStore((state) => state.setWalletConnected);
  const setConnectionStatus = useWalletStore((state) => state.setConnectionStatus);
  return (0, import_react_query.useMutation)({
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
  const [clientOnly, setClientOnly] = (0, import_react3.useState)(false);
  (0, import_react3.useLayoutEffect)(() => {
    setClientOnly(true);
  }, []);
  const { data, isError } = (0, import_react_query2.useQuery)({
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
//# sourceMappingURL=useAutoConnectWallet.js.map
