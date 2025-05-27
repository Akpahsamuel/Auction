"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// vanilla-extract-css-ns:src/components/styling/StyleMarker.css.ts.vanilla.css?source=OndoZXJlKCopIHsKICBib3gtc2l6aW5nOiBib3JkZXItYm94OwogIGNvbG9yOiB2YXIoLS1kYXBwLWtpdC1jb2xvcnMtYm9keSk7CiAgZm9udC1mYW1pbHk6IHZhcigtLWRhcHAta2l0LXR5cG9ncmFwaHktZm9udEZhbWlseSk7CiAgZm9udC1zaXplOiB2YXIoLS1kYXBwLWtpdC1mb250V2VpZ2h0cy1ub3JtYWwpOwogIGZvbnQtc3R5bGU6IHZhcigtLWRhcHAta2l0LXR5cG9ncmFwaHktZm9udFN0eWxlKTsKICBmb250LXdlaWdodDogdmFyKC0tZGFwcC1raXQtZm9udFdlaWdodHMtbm9ybWFsKTsKICBsaW5lLWhlaWdodDogdmFyKC0tZGFwcC1raXQtdHlwb2dyYXBoeS1saW5lSGVpZ2h0KTsKICBsZXR0ZXItc3BhY2luZzogdmFyKC0tZGFwcC1raXQtdHlwb2dyYXBoeS1sZXR0ZXJTcGFjaW5nKTsKfQo6d2hlcmUoYnV0dG9uKSB7CiAgYXBwZWFyYW5jZTogbm9uZTsKICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsKICBmb250LXNpemU6IGluaGVyaXQ7CiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7CiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7CiAgbGV0dGVyLXNwYWNpbmc6IGluaGVyaXQ7CiAgY29sb3I6IGluaGVyaXQ7CiAgYm9yZGVyOiAwOwogIHBhZGRpbmc6IDA7CiAgbWFyZ2luOiAwOwp9Cjp3aGVyZShhKSB7CiAgdGV4dC1kZWNvcmF0aW9uOiBub25lOwogIGNvbG9yOiBpbmhlcml0OwogIG91dGxpbmU6IG5vbmU7Cn0KOndoZXJlKG9sLCB1bCkgewogIGxpc3Qtc3R5bGU6IG5vbmU7CiAgbWFyZ2luOiAwOwogIHBhZGRpbmc6IDA7Cn0KOndoZXJlKGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYpIHsKICBmb250LXNpemU6IGluaGVyaXQ7CiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7CiAgbWFyZ2luOiAwOwp9
var init_StyleMarker_css_ts_vanilla = __esm({
  "vanilla-extract-css-ns:src/components/styling/StyleMarker.css.ts.vanilla.css?source=OndoZXJlKCopIHsKICBib3gtc2l6aW5nOiBib3JkZXItYm94OwogIGNvbG9yOiB2YXIoLS1kYXBwLWtpdC1jb2xvcnMtYm9keSk7CiAgZm9udC1mYW1pbHk6IHZhcigtLWRhcHAta2l0LXR5cG9ncmFwaHktZm9udEZhbWlseSk7CiAgZm9udC1zaXplOiB2YXIoLS1kYXBwLWtpdC1mb250V2VpZ2h0cy1ub3JtYWwpOwogIGZvbnQtc3R5bGU6IHZhcigtLWRhcHAta2l0LXR5cG9ncmFwaHktZm9udFN0eWxlKTsKICBmb250LXdlaWdodDogdmFyKC0tZGFwcC1raXQtZm9udFdlaWdodHMtbm9ybWFsKTsKICBsaW5lLWhlaWdodDogdmFyKC0tZGFwcC1raXQtdHlwb2dyYXBoeS1saW5lSGVpZ2h0KTsKICBsZXR0ZXItc3BhY2luZzogdmFyKC0tZGFwcC1raXQtdHlwb2dyYXBoeS1sZXR0ZXJTcGFjaW5nKTsKfQo6d2hlcmUoYnV0dG9uKSB7CiAgYXBwZWFyYW5jZTogbm9uZTsKICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsKICBmb250LXNpemU6IGluaGVyaXQ7CiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7CiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7CiAgbGV0dGVyLXNwYWNpbmc6IGluaGVyaXQ7CiAgY29sb3I6IGluaGVyaXQ7CiAgYm9yZGVyOiAwOwogIHBhZGRpbmc6IDA7CiAgbWFyZ2luOiAwOwp9Cjp3aGVyZShhKSB7CiAgdGV4dC1kZWNvcmF0aW9uOiBub25lOwogIGNvbG9yOiBpbmhlcml0OwogIG91dGxpbmU6IG5vbmU7Cn0KOndoZXJlKG9sLCB1bCkgewogIGxpc3Qtc3R5bGU6IG5vbmU7CiAgbWFyZ2luOiAwOwogIHBhZGRpbmc6IDA7Cn0KOndoZXJlKGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYpIHsKICBmb250LXNpemU6IGluaGVyaXQ7CiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7CiAgbWFyZ2luOiAwOwp9"() {
  }
});

// src/components/styling/StyleMarker.css.ts
var require_StyleMarker_css = __commonJS({
  "src/components/styling/StyleMarker.css.ts"() {
    "use strict";
    init_StyleMarker_css_ts_vanilla();
  }
});

// src/components/AccountDropdownMenu.tsx
var AccountDropdownMenu_exports = {};
__export(AccountDropdownMenu_exports, {
  AccountDropdownMenu: () => AccountDropdownMenu,
  AccountDropdownMenuItem: () => AccountDropdownMenuItem
});
module.exports = __toCommonJS(AccountDropdownMenu_exports);
var import_utils = require("@mysten/sui/utils");
var DropdownMenu = __toESM(require("@radix-ui/react-dropdown-menu"));
var import_clsx3 = __toESM(require("clsx"));

// src/hooks/useSuiClientQuery.ts
var import_react_query = require("@tanstack/react-query");
var import_react3 = require("react");

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

// src/hooks/useSuiClientQuery.ts
function useSuiClientQuery(...args) {
  const [method, params, { queryKey = [], ...options } = {}] = args;
  const suiContext = useSuiClientContext();
  return (0, import_react_query.useQuery)({
    ...options,
    queryKey: [suiContext.network, method, params, ...queryKey],
    queryFn: async () => {
      return await suiContext.client[method](params);
    }
  });
}

// src/hooks/useResolveSuiNSNames.ts
function useResolveSuiNSName(address, options) {
  return useSuiClientQuery(
    "resolveNameServiceNames",
    {
      address,
      limit: 1
    },
    {
      ...options,
      refetchOnWindowFocus: false,
      retry: false,
      select: (data) => data.data.length > 0 ? data.data[0] : null,
      enabled: !!address && options?.enabled !== false
    }
  );
}

// src/hooks/wallet/useWalletStore.ts
var import_react5 = require("react");
var import_zustand = require("zustand");

// src/contexts/walletContext.ts
var import_react4 = require("react");
var WalletContext = (0, import_react4.createContext)(null);

// src/hooks/wallet/useWalletStore.ts
function useWalletStore(selector) {
  const store = (0, import_react5.useContext)(WalletContext);
  if (!store) {
    throw new Error(
      "Could not find WalletContext. Ensure that you have set up the WalletProvider."
    );
  }
  return (0, import_zustand.useStore)(store, selector);
}

// src/hooks/wallet/useAccounts.ts
function useAccounts() {
  return useWalletStore((state) => state.accounts);
}

// src/hooks/wallet/useDisconnectWallet.ts
var import_react_query2 = require("@tanstack/react-query");

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
var WalletAccountNotFoundError = class extends Error {
};

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

// src/hooks/wallet/useDisconnectWallet.ts
function useDisconnectWallet({
  mutationKey,
  ...mutationOptions
} = {}) {
  const { currentWallet } = useCurrentWallet();
  const setWalletDisconnected = useWalletStore((state) => state.setWalletDisconnected);
  return (0, import_react_query2.useMutation)({
    mutationKey: walletMutationKeys.disconnectWallet(mutationKey),
    mutationFn: async () => {
      if (!currentWallet) {
        throw new WalletNotConnectedError("No wallet is connected.");
      }
      try {
        await currentWallet.features["standard:disconnect"]?.disconnect();
      } catch (error) {
        console.error("Failed to disconnect the application from the current wallet.", error);
      }
      setWalletDisconnected();
    },
    ...mutationOptions
  });
}

// src/hooks/wallet/useSwitchAccount.ts
var import_react_query3 = require("@tanstack/react-query");
function useSwitchAccount({
  mutationKey,
  ...mutationOptions
} = {}) {
  const { currentWallet } = useCurrentWallet();
  const setAccountSwitched = useWalletStore((state) => state.setAccountSwitched);
  return (0, import_react_query3.useMutation)({
    mutationKey: walletMutationKeys.switchAccount(mutationKey),
    mutationFn: async ({ account }) => {
      if (!currentWallet) {
        throw new WalletNotConnectedError("No wallet is connected.");
      }
      const accountToSelect = currentWallet.accounts.find(
        (walletAccount) => walletAccount.address === account.address
      );
      if (!accountToSelect) {
        throw new WalletAccountNotFoundError(
          `No account with address ${account.address} is connected to ${currentWallet.name}.`
        );
      }
      setAccountSwitched(accountToSelect);
    },
    ...mutationOptions
  });
}

// src/components/AccountDropdownMenu.css.ts
var connectedAccount = "AccountDropdownMenu_connectedAccount__div2ql0";
var menuContainer = "AccountDropdownMenu_menuContainer__div2ql1";
var menuContent = "AccountDropdownMenu_menuContent__div2ql2";
var menuItem = "AccountDropdownMenu_menuItem__div2ql3";
var separator = "AccountDropdownMenu_separator__div2ql5";
var switchAccountMenuItem = "AccountDropdownMenu_switchAccountMenuItem__div2ql4";

// src/components/icons/CheckIcon.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function CheckIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "none", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "path",
    {
      fill: "currentColor",
      d: "m11.726 5.048-4.73 5.156-1.722-1.879a.72.72 0 0 0-.529-.23.722.722 0 0 0-.525.24.858.858 0 0 0-.22.573.86.86 0 0 0 .211.576l2.255 2.458c.14.153.332.24.53.24.2 0 .391-.087.532-.24l5.261-5.735A.86.86 0 0 0 13 5.63a.858.858 0 0 0-.22-.572.722.722 0 0 0-.525-.24.72.72 0 0 0-.529.23Z"
    }
  ) });
}

// src/components/icons/ChevronIcon.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function ChevronIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "none", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "path",
    {
      stroke: "#A0B6C3",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 1.5,
      d: "m4 6 4 4 4-4"
    }
  ) });
}

// src/components/styling/StyleMarker.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_react6 = require("react");

// src/constants/styleDataAttribute.ts
var styleDataAttributeName = "data-dapp-kit";
var styleDataAttributeSelector = `[${styleDataAttributeName}]`;
var styleDataAttribute = { [styleDataAttributeName]: "" };

// src/components/styling/StyleMarker.tsx
var import_StyleMarker_css = __toESM(require_StyleMarker_css());
var import_jsx_runtime4 = require("react/jsx-runtime");
var StyleMarker = (0, import_react6.forwardRef)(({ children, ...props }, forwardedRef) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react_slot.Slot, { ref: forwardedRef, ...props, ...styleDataAttribute, children }));
StyleMarker.displayName = "StyleMarker";

// src/components/ui/Button.tsx
var import_react_slot2 = require("@radix-ui/react-slot");
var import_clsx = __toESM(require("clsx"));
var import_react7 = require("react");

// src/components/ui/Button.css.ts
var import_createRuntimeFn = require("@vanilla-extract/recipes/createRuntimeFn");
var buttonVariants = (0, import_createRuntimeFn.createRuntimeFn)({ defaultClassName: "Button_buttonVariants__x1s81q0", variantClassNames: { variant: { primary: "Button_buttonVariants_variant_primary__x1s81q1", outline: "Button_buttonVariants_variant_outline__x1s81q2" }, size: { md: "Button_buttonVariants_size_md__x1s81q3", lg: "Button_buttonVariants_size_lg__x1s81q4" } }, defaultVariants: { variant: "primary", size: "md" }, compoundVariants: [] });

// src/components/ui/Button.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var Button = (0, import_react7.forwardRef)(
  ({ className, variant, size, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? import_react_slot2.Slot : "button";
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      Comp,
      {
        ...props,
        className: (0, import_clsx.default)(buttonVariants({ variant, size }), className),
        ref: forwardedRef
      }
    );
  }
);
Button.displayName = "Button";

// src/components/ui/Text.tsx
var import_react_slot3 = require("@radix-ui/react-slot");
var import_clsx2 = __toESM(require("clsx"));
var import_react8 = require("react");

// src/components/ui/Text.css.ts
var import_createRuntimeFn2 = require("@vanilla-extract/recipes/createRuntimeFn");
var textVariants = (0, import_createRuntimeFn2.createRuntimeFn)({ defaultClassName: "Text__2bv1ur0", variantClassNames: { size: { sm: "Text_textVariants_size_sm__2bv1ur1" }, weight: { normal: "Text_textVariants_weight_normal__2bv1ur2", medium: "Text_textVariants_weight_medium__2bv1ur3", bold: "Text_textVariants_weight_bold__2bv1ur4" }, color: { muted: "Text_textVariants_color_muted__2bv1ur5", danger: "Text_textVariants_color_danger__2bv1ur6" }, mono: { true: "Text_textVariants_mono_true__2bv1ur7" } }, defaultVariants: { size: "sm", weight: "normal" }, compoundVariants: [] });

// src/components/ui/Text.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var Text = (0, import_react8.forwardRef)(
  ({
    children,
    className,
    asChild = false,
    as: Tag = "div",
    size,
    weight,
    color,
    mono,
    ...textProps
  }, forwardedRef) => {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      import_react_slot3.Slot,
      {
        ...textProps,
        ref: forwardedRef,
        className: (0, import_clsx2.default)(textVariants({ size, weight, color, mono }), className),
        children: asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Tag, { children })
      }
    );
  }
);
Text.displayName = "Text";

// src/components/AccountDropdownMenu.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function AccountDropdownMenu({ currentAccount }) {
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const { data: domain } = useResolveSuiNSName(
    currentAccount.label ? null : currentAccount.address
  );
  const accounts = useAccounts();
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(DropdownMenu.Root, { modal: false, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(StyleMarker, { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DropdownMenu.Trigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(Button, { size: "lg", className: connectedAccount, children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Text, { mono: true, weight: "bold", children: currentAccount.label ?? domain ?? (0, import_utils.formatAddress)(currentAccount.address) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ChevronIcon, {})
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DropdownMenu.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(StyleMarker, { className: menuContainer, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(DropdownMenu.Content, { className: menuContent, children: [
      accounts.map((account) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        AccountDropdownMenuItem,
        {
          account,
          active: currentAccount.address === account.address
        },
        account.address
      )),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DropdownMenu.Separator, { className: separator }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        DropdownMenu.Item,
        {
          className: (0, import_clsx3.default)(menuItem),
          onSelect: () => disconnectWallet(),
          children: "Disconnect"
        }
      )
    ] }) }) })
  ] });
}
function AccountDropdownMenuItem({
  account,
  active
}) {
  const { mutate: switchAccount } = useSwitchAccount();
  const { data: domain } = useResolveSuiNSName(account.label ? null : account.address);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    DropdownMenu.Item,
    {
      className: (0, import_clsx3.default)(menuItem, switchAccountMenuItem),
      onSelect: () => switchAccount({ account }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Text, { mono: true, children: account.label ?? domain ?? (0, import_utils.formatAddress)(account.address) }),
        active ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CheckIcon, {}) : null
      ]
    }
  );
}
//# sourceMappingURL=AccountDropdownMenu.js.map
