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

// src/hooks/wallet/useSignPersonalMessage.ts
var useSignPersonalMessage_exports = {};
__export(useSignPersonalMessage_exports, {
  useSignPersonalMessage: () => useSignPersonalMessage
});
module.exports = __toCommonJS(useSignPersonalMessage_exports);
var import_react_query = require("@tanstack/react-query");

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
var import_react2 = require("react");

// src/components/SuiClientProvider.tsx
var import_client = require("@mysten/sui/client");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var SuiClientContext = (0, import_react.createContext)(null);
var DEFAULT_NETWORKS = {
  localnet: { url: (0, import_client.getFullnodeUrl)("localnet") }
};

// src/hooks/useSuiClient.ts
function useSuiClientContext() {
  const suiClient = (0, import_react2.useContext)(SuiClientContext);
  if (!suiClient) {
    throw new Error(
      "Could not find SuiClientContext. Ensure that you have set up the SuiClientProvider"
    );
  }
  return suiClient;
}

// src/hooks/wallet/useWalletStore.ts
var import_react4 = require("react");
var import_zustand = require("zustand");

// src/contexts/walletContext.ts
var import_react3 = require("react");
var WalletContext = (0, import_react3.createContext)(null);

// src/hooks/wallet/useWalletStore.ts
function useWalletStore(selector) {
  const store = (0, import_react4.useContext)(WalletContext);
  if (!store) {
    throw new Error(
      "Could not find WalletContext. Ensure that you have set up the WalletProvider."
    );
  }
  return (0, import_zustand.useStore)(store, selector);
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
  return (0, import_react_query.useMutation)({
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
//# sourceMappingURL=useSignPersonalMessage.js.map
