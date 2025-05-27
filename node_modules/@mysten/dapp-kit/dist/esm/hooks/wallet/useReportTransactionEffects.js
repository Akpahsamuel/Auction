// src/hooks/wallet/useReportTransactionEffects.ts
import { toBase64 } from "@mysten/sui/utils";
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

// src/errors/walletErrors.ts
var WalletNotConnectedError = class extends Error {
};
var WalletNoAccountSelectedError = class extends Error {
};

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

// src/hooks/wallet/useCurrentAccount.ts
function useCurrentAccount() {
  return useWalletStore((state) => state.currentAccount);
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

// src/hooks/wallet/useReportTransactionEffects.ts
function useReportTransactionEffects({
  mutationKey,
  ...mutationOptions
} = {}) {
  const { currentWallet } = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  return useMutation({
    mutationKey: walletMutationKeys.reportTransactionEffects(mutationKey),
    mutationFn: async ({ effects, chain = currentWallet?.chains[0], account = currentAccount }) => {
      if (!currentWallet) {
        throw new WalletNotConnectedError("No wallet is connected.");
      }
      if (!account) {
        throw new WalletNoAccountSelectedError(
          "No wallet account is selected to report transaction effects for"
        );
      }
      const reportTransactionEffectsFeature = currentWallet.features["sui:reportTransactionEffects"];
      if (reportTransactionEffectsFeature) {
        return await reportTransactionEffectsFeature.reportTransactionEffects({
          effects: Array.isArray(effects) ? toBase64(new Uint8Array(effects)) : effects,
          account,
          chain: chain ?? currentWallet?.chains[0]
        });
      }
    },
    ...mutationOptions
  });
}
export {
  useReportTransactionEffects
};
//# sourceMappingURL=useReportTransactionEffects.js.map
