"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
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
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);

// src/components/WalletProvider.tsx
var WalletProvider_exports = {};
__export(WalletProvider_exports, {
  WalletProvider: () => WalletProvider
});
module.exports = __toCommonJS(WalletProvider_exports);
var import_react10 = require("react");

// src/constants/walletDefaults.ts
var import_slush_wallet = require("@mysten/slush-wallet");

// src/utils/stateStorage.ts
function createInMemoryStore() {
  const store = /* @__PURE__ */ new Map();
  return {
    getItem(key) {
      return store.get(key);
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    }
  };
}

// src/constants/walletDefaults.ts
var SUI_WALLET_NAME = "Sui Wallet";
var DEFAULT_STORAGE = typeof window !== "undefined" && window.localStorage ? localStorage : createInMemoryStore();
var DEFAULT_STORAGE_KEY = "sui-dapp-kit:wallet-connection-info";
var SIGN_FEATURES = [
  "sui:signTransaction",
  "sui:signTransactionBlock"
];
var DEFAULT_WALLET_FILTER = (wallet) => SIGN_FEATURES.some((feature) => wallet.features[feature]);
var DEFAULT_PREFERRED_WALLETS = [SUI_WALLET_NAME, import_slush_wallet.SLUSH_WALLET_NAME];

// src/contexts/walletContext.ts
var import_react = require("react");
var WalletContext = (0, import_react.createContext)(null);

// src/hooks/wallet/useAutoConnectWallet.ts
var import_react_query2 = require("@tanstack/react-query");
var import_react3 = require("react");

// src/utils/walletUtils.ts
var import_wallet_standard = require("@mysten/wallet-standard");
function getRegisteredWallets(preferredWallets, walletFilter) {
  const walletsApi = (0, import_wallet_standard.getWallets)();
  const wallets = walletsApi.get();
  const suiWallets = wallets.filter(
    (wallet) => (0, import_wallet_standard.isWalletWithRequiredFeatureSet)(wallet) && (!walletFilter || walletFilter(wallet))
  );
  return [
    // Preferred wallets, in order:
    ...preferredWallets.map((name) => suiWallets.find((wallet) => wallet.name === name)).filter(Boolean),
    // Wallets in default order:
    ...suiWallets.filter((wallet) => !preferredWallets.includes(wallet.name))
  ];
}
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

// src/hooks/wallet/useSlushWallet.ts
var import_slush_wallet2 = require("@mysten/slush-wallet");
var import_react4 = require("react");
function useSlushWallet(config) {
  (0, import_react4.useLayoutEffect)(() => {
    if (!config?.name) {
      return;
    }
    let cleanup;
    let isMounted = true;
    try {
      const result = (0, import_slush_wallet2.registerSlushWallet)(config.name, {
        origin: config.origin
      });
      if (isMounted && result) {
        cleanup = result.unregister;
      } else if (result) {
        result.unregister();
      }
    } catch (error) {
      console.error("Failed to register Slush wallet:", error);
    }
    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [config?.name, config?.origin]);
}

// src/hooks/wallet/useUnsafeBurnerWallet.ts
var import_ed25519 = require("@mysten/sui/keypairs/ed25519");
var import_transactions = require("@mysten/sui/transactions");
var import_utils = require("@mysten/sui/utils");
var import_wallet_standard2 = require("@mysten/wallet-standard");
var import_react7 = require("react");

// src/hooks/useSuiClient.ts
var import_react6 = require("react");

// src/components/SuiClientProvider.tsx
var import_client = require("@mysten/sui/client");
var import_react5 = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var SuiClientContext = (0, import_react5.createContext)(null);
var DEFAULT_NETWORKS = {
  localnet: { url: (0, import_client.getFullnodeUrl)("localnet") }
};

// src/hooks/useSuiClient.ts
function useSuiClientContext() {
  const suiClient = (0, import_react6.useContext)(SuiClientContext);
  if (!suiClient) {
    throw new Error(
      "Could not find SuiClientContext. Ensure that you have set up the SuiClientProvider"
    );
  }
  return suiClient;
}
function useSuiClient() {
  return useSuiClientContext().client;
}

// src/hooks/wallet/useUnsafeBurnerWallet.ts
var WALLET_NAME = "Unsafe Burner Wallet";
function useUnsafeBurnerWallet(enabled) {
  const suiClient = useSuiClient();
  (0, import_react7.useEffect)(() => {
    if (!enabled) {
      return;
    }
    const unregister = registerUnsafeBurnerWallet(suiClient);
    return unregister;
  }, [enabled, suiClient]);
}
function registerUnsafeBurnerWallet(suiClient) {
  var _on, _connect, _signPersonalMessage, _signTransactionBlock, _signTransaction, _signAndExecuteTransactionBlock, _signAndExecuteTransaction;
  const walletsApi = (0, import_wallet_standard2.getWallets)();
  const registeredWallets = walletsApi.get();
  if (registeredWallets.find((wallet) => wallet.name === WALLET_NAME)) {
    console.warn(
      "registerUnsafeBurnerWallet: Unsafe Burner Wallet already registered, skipping duplicate registration."
    );
    return;
  }
  console.warn(
    "Your application is currently using the unsafe burner wallet. Make sure that this wallet is disabled in production."
  );
  const keypair = new import_ed25519.Ed25519Keypair();
  const account = new import_wallet_standard2.ReadonlyWalletAccount({
    address: keypair.getPublicKey().toSuiAddress(),
    publicKey: keypair.getPublicKey().toSuiBytes(),
    chains: ["sui:unknown"],
    features: [
      "sui:signAndExecuteTransactionBlock",
      "sui:signTransactionBlock",
      "sui:signTransaction",
      "sui:signAndExecuteTransaction"
    ]
  });
  class UnsafeBurnerWallet {
    constructor() {
      __privateAdd(this, _on, () => {
        return () => {
        };
      });
      __privateAdd(this, _connect, async () => {
        return { accounts: this.accounts };
      });
      __privateAdd(this, _signPersonalMessage, async (messageInput) => {
        const { bytes, signature } = await keypair.signPersonalMessage(messageInput.message);
        return { bytes, signature };
      });
      __privateAdd(this, _signTransactionBlock, async (transactionInput) => {
        const { bytes, signature } = await transactionInput.transactionBlock.sign({
          client: suiClient,
          signer: keypair
        });
        return {
          transactionBlockBytes: bytes,
          signature
        };
      });
      __privateAdd(this, _signTransaction, async (transactionInput) => {
        const { bytes, signature } = await import_transactions.Transaction.from(
          await transactionInput.transaction.toJSON()
        ).sign({
          client: suiClient,
          signer: keypair
        });
        transactionInput.signal?.throwIfAborted();
        return {
          bytes,
          signature
        };
      });
      __privateAdd(this, _signAndExecuteTransactionBlock, async (transactionInput) => {
        const { bytes, signature } = await transactionInput.transactionBlock.sign({
          client: suiClient,
          signer: keypair
        });
        return suiClient.executeTransactionBlock({
          signature,
          transactionBlock: bytes,
          options: transactionInput.options
        });
      });
      __privateAdd(this, _signAndExecuteTransaction, async (transactionInput) => {
        const { bytes, signature } = await import_transactions.Transaction.from(
          await transactionInput.transaction.toJSON()
        ).sign({
          client: suiClient,
          signer: keypair
        });
        transactionInput.signal?.throwIfAborted();
        const { rawEffects, digest } = await suiClient.executeTransactionBlock({
          signature,
          transactionBlock: bytes,
          options: {
            showRawEffects: true
          }
        });
        return {
          bytes,
          signature,
          digest,
          effects: (0, import_utils.toBase64)(new Uint8Array(rawEffects))
        };
      });
    }
    get version() {
      return "1.0.0";
    }
    get name() {
      return WALLET_NAME;
    }
    get icon() {
      return "data:image/png;base64,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";
    }
    // Return the Sui chains that your wallet supports.
    get chains() {
      return import_wallet_standard2.SUI_CHAINS;
    }
    get accounts() {
      return [account];
    }
    get features() {
      return {
        "standard:connect": {
          version: "1.0.0",
          connect: __privateGet(this, _connect)
        },
        "standard:events": {
          version: "1.0.0",
          on: __privateGet(this, _on)
        },
        "sui:signPersonalMessage": {
          version: "1.1.0",
          signPersonalMessage: __privateGet(this, _signPersonalMessage)
        },
        "sui:signTransactionBlock": {
          version: "1.0.0",
          signTransactionBlock: __privateGet(this, _signTransactionBlock)
        },
        "sui:signAndExecuteTransactionBlock": {
          version: "1.0.0",
          signAndExecuteTransactionBlock: __privateGet(this, _signAndExecuteTransactionBlock)
        },
        "sui:signTransaction": {
          version: "2.0.0",
          signTransaction: __privateGet(this, _signTransaction)
        },
        "sui:signAndExecuteTransaction": {
          version: "2.0.0",
          signAndExecuteTransaction: __privateGet(this, _signAndExecuteTransaction)
        }
      };
    }
  }
  _on = new WeakMap();
  _connect = new WeakMap();
  _signPersonalMessage = new WeakMap();
  _signTransactionBlock = new WeakMap();
  _signTransaction = new WeakMap();
  _signAndExecuteTransactionBlock = new WeakMap();
  _signAndExecuteTransaction = new WeakMap();
  return walletsApi.register(new UnsafeBurnerWallet());
}

// src/hooks/wallet/useWalletPropertiesChanged.ts
var import_react8 = require("react");
function useWalletPropertiesChanged() {
  const { currentWallet } = useCurrentWallet();
  const updateWalletAccounts = useWalletStore((state) => state.updateWalletAccounts);
  (0, import_react8.useEffect)(() => {
    const unsubscribeFromEvents = currentWallet?.features["standard:events"].on(
      "change",
      ({ accounts }) => {
        if (accounts) {
          updateWalletAccounts(accounts);
        }
      }
    );
    return unsubscribeFromEvents;
  }, [currentWallet?.features, updateWalletAccounts]);
}

// src/hooks/wallet/useWalletsChanged.ts
var import_wallet_standard3 = require("@mysten/wallet-standard");
var import_react9 = require("react");
function useWalletsChanged(preferredWallets, walletFilter) {
  const setWalletRegistered = useWalletStore((state) => state.setWalletRegistered);
  const setWalletUnregistered = useWalletStore((state) => state.setWalletUnregistered);
  (0, import_react9.useEffect)(() => {
    const walletsApi = (0, import_wallet_standard3.getWallets)();
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

// src/themes/lightTheme.ts
var lightTheme = {
  blurs: {
    modalOverlay: "blur(0)"
  },
  backgroundColors: {
    primaryButton: "#F6F7F9",
    primaryButtonHover: "#F0F2F5",
    outlineButtonHover: "#F4F4F5",
    modalOverlay: "rgba(24 36 53 / 20%)",
    modalPrimary: "white",
    modalSecondary: "#F7F8F8",
    iconButton: "transparent",
    iconButtonHover: "#F0F1F2",
    dropdownMenu: "#FFFFFF",
    dropdownMenuSeparator: "#F3F6F8",
    walletItemSelected: "white",
    walletItemHover: "#3C424226"
  },
  borderColors: {
    outlineButton: "#E4E4E7"
  },
  colors: {
    primaryButton: "#373737",
    outlineButton: "#373737",
    iconButton: "#000000",
    body: "#182435",
    bodyMuted: "#767A81",
    bodyDanger: "#FF794B"
  },
  radii: {
    small: "6px",
    medium: "8px",
    large: "12px",
    xlarge: "16px"
  },
  shadows: {
    primaryButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    walletItemSelected: "0px 2px 6px rgba(0, 0, 0, 0.05)"
  },
  fontWeights: {
    normal: "400",
    medium: "500",
    bold: "600"
  },
  fontSizes: {
    small: "14px",
    medium: "16px",
    large: "18px",
    xlarge: "20px"
  },
  typography: {
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontStyle: "normal",
    lineHeight: "1.3",
    letterSpacing: "1"
  }
};

// src/walletStore.ts
var import_zustand2 = require("zustand");
var import_middleware = require("zustand/middleware");
function createWalletStore({
  wallets,
  storage,
  storageKey,
  autoConnectEnabled
}) {
  return (0, import_zustand2.createStore)()(
    (0, import_middleware.persist)(
      (set, get) => ({
        autoConnectEnabled,
        wallets,
        accounts: [],
        currentWallet: null,
        currentAccount: null,
        lastConnectedAccountAddress: null,
        lastConnectedWalletName: null,
        connectionStatus: "disconnected",
        supportedIntents: [],
        setConnectionStatus(connectionStatus) {
          set(() => ({
            connectionStatus
          }));
        },
        setWalletConnected(wallet, connectedAccounts, selectedAccount, supportedIntents = []) {
          set(() => ({
            accounts: connectedAccounts,
            currentWallet: wallet,
            currentAccount: selectedAccount,
            lastConnectedWalletName: getWalletUniqueIdentifier(wallet),
            lastConnectedAccountAddress: selectedAccount?.address,
            connectionStatus: "connected",
            supportedIntents
          }));
        },
        setWalletDisconnected() {
          set(() => ({
            accounts: [],
            currentWallet: null,
            currentAccount: null,
            lastConnectedWalletName: null,
            lastConnectedAccountAddress: null,
            connectionStatus: "disconnected",
            supportedIntents: []
          }));
        },
        setAccountSwitched(selectedAccount) {
          set(() => ({
            currentAccount: selectedAccount,
            lastConnectedAccountAddress: selectedAccount.address
          }));
        },
        setWalletRegistered(updatedWallets) {
          set(() => ({ wallets: updatedWallets }));
        },
        setWalletUnregistered(updatedWallets, unregisteredWallet) {
          if (unregisteredWallet === get().currentWallet) {
            set(() => ({
              wallets: updatedWallets,
              accounts: [],
              currentWallet: null,
              currentAccount: null,
              lastConnectedWalletName: null,
              lastConnectedAccountAddress: null,
              connectionStatus: "disconnected",
              supportedIntents: []
            }));
          } else {
            set(() => ({ wallets: updatedWallets }));
          }
        },
        updateWalletAccounts(accounts) {
          const currentAccount = get().currentAccount;
          set(() => ({
            accounts,
            currentAccount: currentAccount && accounts.find(({ address }) => address === currentAccount.address) || accounts[0]
          }));
        }
      }),
      {
        name: storageKey,
        storage: (0, import_middleware.createJSONStorage)(() => storage),
        partialize: ({ lastConnectedWalletName, lastConnectedAccountAddress }) => ({
          lastConnectedWalletName,
          lastConnectedAccountAddress
        })
      }
    )
  );
}

// src/components/styling/InjectedThemeStyles.tsx
var import_dynamic = require("@vanilla-extract/dynamic");

// src/constants/styleDataAttribute.ts
var styleDataAttributeName = "data-dapp-kit";
var styleDataAttributeSelector = `[${styleDataAttributeName}]`;
var styleDataAttribute = { [styleDataAttributeName]: "" };

// src/themes/themeContract.ts
var import_css = require("@vanilla-extract/css");
var themeContractValues = {
  blurs: {
    modalOverlay: ""
  },
  backgroundColors: {
    primaryButton: "",
    primaryButtonHover: "",
    outlineButtonHover: "",
    walletItemHover: "",
    walletItemSelected: "",
    modalOverlay: "",
    modalPrimary: "",
    modalSecondary: "",
    iconButton: "",
    iconButtonHover: "",
    dropdownMenu: "",
    dropdownMenuSeparator: ""
  },
  borderColors: {
    outlineButton: ""
  },
  colors: {
    primaryButton: "",
    outlineButton: "",
    body: "",
    bodyMuted: "",
    bodyDanger: "",
    iconButton: ""
  },
  radii: {
    small: "",
    medium: "",
    large: "",
    xlarge: ""
  },
  shadows: {
    primaryButton: "",
    walletItemSelected: ""
  },
  fontWeights: {
    normal: "",
    medium: "",
    bold: ""
  },
  fontSizes: {
    small: "",
    medium: "",
    large: "",
    xlarge: ""
  },
  typography: {
    fontFamily: "",
    fontStyle: "",
    lineHeight: "",
    letterSpacing: ""
  }
};
var themeVars = (0, import_css.createGlobalThemeContract)(
  themeContractValues,
  (_, path) => `dapp-kit-${path.join("-")}`
);

// src/components/styling/InjectedThemeStyles.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function InjectedThemeStyles({ theme }) {
  const themeStyles = Array.isArray(theme) ? getDynamicThemeStyles(theme) : getStaticThemeStyles(theme);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "style",
    {
      precedence: "default",
      href: "mysten-dapp-kit-theme",
      dangerouslySetInnerHTML: {
        __html: themeStyles
      }
    }
  );
}
function getDynamicThemeStyles(themes) {
  return themes.map(({ mediaQuery, selector, variables }) => {
    const themeStyles = getStaticThemeStyles(variables);
    const themeStylesWithSelectorPrefix = selector ? `${selector} ${themeStyles}` : themeStyles;
    return mediaQuery ? `@media ${mediaQuery}{${themeStylesWithSelectorPrefix}}` : themeStylesWithSelectorPrefix;
  }).join(" ");
}
function getStaticThemeStyles(theme) {
  return `${styleDataAttributeSelector} {${cssStringFromTheme(theme)}}`;
}
function cssStringFromTheme(theme) {
  return Object.entries((0, import_dynamic.assignInlineVars)(themeVars, theme)).map(([key, value]) => `${key}:${value};`).join("");
}

// src/components/WalletProvider.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function WalletProvider({
  preferredWallets = DEFAULT_PREFERRED_WALLETS,
  walletFilter = DEFAULT_WALLET_FILTER,
  storage = DEFAULT_STORAGE,
  storageKey = DEFAULT_STORAGE_KEY,
  enableUnsafeBurner = false,
  autoConnect = false,
  slushWallet,
  theme = lightTheme,
  children
}) {
  const storeRef = (0, import_react10.useRef)(
    createWalletStore({
      autoConnectEnabled: autoConnect,
      wallets: getRegisteredWallets(preferredWallets, walletFilter),
      storage: storage || createInMemoryStore(),
      storageKey
    })
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(WalletContext.Provider, { value: storeRef.current, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    WalletConnectionManager,
    {
      preferredWallets,
      walletFilter,
      enableUnsafeBurner,
      slushWallet,
      children: [
        theme ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(InjectedThemeStyles, { theme }) : null,
        children
      ]
    }
  ) });
}
function WalletConnectionManager({
  preferredWallets = DEFAULT_PREFERRED_WALLETS,
  walletFilter = DEFAULT_WALLET_FILTER,
  enableUnsafeBurner = false,
  slushWallet,
  children
}) {
  useWalletsChanged(preferredWallets, walletFilter);
  useWalletPropertiesChanged();
  useSlushWallet(slushWallet);
  useUnsafeBurnerWallet(enableUnsafeBurner);
  useAutoConnectWallet();
  return children;
}
//# sourceMappingURL=WalletProvider.js.map
