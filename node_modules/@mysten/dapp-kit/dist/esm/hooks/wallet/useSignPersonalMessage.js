// src/hooks/wallet/useSignPersonalMessage.ts
import { useMutation } from "@tanstack/react-query";

// src/errors/walletErrors.ts
var WalletNotConnectedError = class extends Error {
};
var WalletNoAccountSelectedError = class extends Error {
};
var WalletFeatureNotSupportedError = class extends Error {
};

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

// src/hooks/wallet/useWalletStore.ts
import { useContext as useContext2 } from "react";
import { useStore } from "zustand";

// src/contexts/walletContext.ts
import { createContext as createContext2 } from "react";
var WalletContext = createContext2(null);

// src/hooks/wallet/useWalletStore.ts
function useWalletStore(selector) {
  const store = useContext2(WalletContext);
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

// src/hooks/wallet/useSignPersonalMessage.ts
function useSignPersonalMessage({
  mutationKey,
  ...mutationOptions
} = {}) {
  const { currentWallet } = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  const { network } = useSuiClientContext();
  return useMutation({
    mutationKey: walletMutationKeys.signPersonalMessage(mutationKey),
    mutationFn: async (signPersonalMessageArgs) => {
      if (!currentWallet) {
        throw new WalletNotConnectedError("No wallet is connected.");
      }
      const signerAccount = signPersonalMessageArgs.account ?? currentAccount;
      if (!signerAccount) {
        throw new WalletNoAccountSelectedError(
          "No wallet account is selected to sign the personal message with."
        );
      }
      const signPersonalMessageFeature = currentWallet.features["sui:signPersonalMessage"];
      if (signPersonalMessageFeature) {
        return await signPersonalMessageFeature.signPersonalMessage({
          ...signPersonalMessageArgs,
          account: signerAccount,
          chain: signPersonalMessageArgs.chain ?? `sui:${network}`
        });
      }
      const signMessageFeature = currentWallet.features["sui:signMessage"];
      if (signMessageFeature) {
        console.warn(
          "This wallet doesn't support the `signPersonalMessage` feature... falling back to `signMessage`."
        );
        const { messageBytes, signature } = await signMessageFeature.signMessage({
          ...signPersonalMessageArgs,
          account: signerAccount
        });
        return { bytes: messageBytes, signature };
      }
      throw new WalletFeatureNotSupportedError(
        "This wallet doesn't support the `signPersonalMessage` feature."
      );
    },
    ...mutationOptions
  });
}
export {
  useSignPersonalMessage
};
//# sourceMappingURL=useSignPersonalMessage.js.map
