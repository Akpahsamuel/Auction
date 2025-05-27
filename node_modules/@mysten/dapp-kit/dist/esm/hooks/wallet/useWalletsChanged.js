// src/hooks/wallet/useWalletsChanged.ts
import { getWallets as getWallets2 } from "@mysten/wallet-standard";
import { useEffect } from "react";

// src/utils/walletUtils.ts
import { getWallets, isWalletWithRequiredFeatureSet } from "@mysten/wallet-standard";
function getRegisteredWallets(preferredWallets, walletFilter) {
  const walletsApi = getWallets();
  const wallets = walletsApi.get();
  const suiWallets = wallets.filter(
    (wallet) => isWalletWithRequiredFeatureSet(wallet) && (!walletFilter || walletFilter(wallet))
  );
  return [
    // Preferred wallets, in order:
    ...preferredWallets.map((name) => suiWallets.find((wallet) => wallet.name === name)).filter(Boolean),
    // Wallets in default order:
    ...suiWallets.filter((wallet) => !preferredWallets.includes(wallet.name))
  ];
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

// src/hooks/wallet/useWalletsChanged.ts
function useWalletsChanged(preferredWallets, walletFilter) {
  const setWalletRegistered = useWalletStore((state) => state.setWalletRegistered);
  const setWalletUnregistered = useWalletStore((state) => state.setWalletUnregistered);
  useEffect(() => {
    const walletsApi = getWallets2();
    setWalletRegistered(getRegisteredWallets(preferredWallets, walletFilter));
    const unsubscribeFromRegister = walletsApi.on("register", () => {
      setWalletRegistered(getRegisteredWallets(preferredWallets, walletFilter));
    });
    const unsubscribeFromUnregister = walletsApi.on("unregister", (unregisteredWallet) => {
      setWalletUnregistered(
        getRegisteredWallets(preferredWallets, walletFilter),
        unregisteredWallet
      );
    });
    return () => {
      unsubscribeFromRegister();
      unsubscribeFromUnregister();
    };
  }, [preferredWallets, walletFilter, setWalletRegistered, setWalletUnregistered]);
}
export {
  useWalletsChanged
};
//# sourceMappingURL=useWalletsChanged.js.map
