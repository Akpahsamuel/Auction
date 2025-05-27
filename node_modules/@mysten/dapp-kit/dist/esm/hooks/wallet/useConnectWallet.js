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
export {
  useConnectWallet
};
//# sourceMappingURL=useConnectWallet.js.map
