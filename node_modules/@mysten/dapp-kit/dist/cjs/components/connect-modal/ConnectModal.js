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

// src/components/connect-modal/ConnectModal.tsx
var ConnectModal_exports = {};
__export(ConnectModal_exports, {
  ConnectModal: () => ConnectModal
});
module.exports = __toCommonJS(ConnectModal_exports);
var Dialog = __toESM(require("@radix-ui/react-dialog"));
var import_clsx6 = __toESM(require("clsx"));
var import_react8 = require("react");

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
var DEFAULT_STORAGE = typeof window !== "undefined" && window.localStorage ? localStorage : createInMemoryStore();
var SIGN_FEATURES = [
  "sui:signTransaction",
  "sui:signTransactionBlock"
];
var DEFAULT_WALLET_FILTER = (wallet) => SIGN_FEATURES.some((feature) => wallet.features[feature]);

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

// src/hooks/wallet/useWallets.ts
function useWallets() {
  return useWalletStore((state) => state.wallets);
}

// src/utils/walletUtils.ts
var import_wallet_standard = require("@mysten/wallet-standard");
function getWalletUniqueIdentifier(wallet) {
  return wallet?.id ?? wallet?.name;
}

// src/components/icons/BackIcon.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function BackIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: 24, height: 24, fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "path",
    {
      d: "M7.57 12.262c0 .341.13.629.403.895l5.175 5.059c.204.205.45.307.751.307.609 0 1.101-.485 1.101-1.087 0-.293-.123-.574-.349-.8L10.14 12.27l4.511-4.375A1.13 1.13 0 0 0 15 7.087C15 6.485 14.508 6 13.9 6c-.295 0-.54.103-.752.308l-5.175 5.058c-.28.28-.404.56-.404.896Z",
      fill: "currentColor"
    }
  ) });
}

// src/components/icons/CloseIcon.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function CloseIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: 10, height: 10, fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "path",
    {
      d: "M9.708.292a.999.999 0 0 0-1.413 0l-3.289 3.29L1.717.291A.999.999 0 0 0 .305 1.705l3.289 3.289-3.29 3.289a.999.999 0 1 0 1.413 1.412l3.29-3.289 3.288 3.29a.999.999 0 0 0 1.413-1.413l-3.29-3.29 3.29-3.288a.999.999 0 0 0 0-1.413Z",
      fill: "currentColor"
    }
  ) });
}

// src/components/styling/StyleMarker.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_react3 = require("react");

// src/constants/styleDataAttribute.ts
var styleDataAttributeName = "data-dapp-kit";
var styleDataAttributeSelector = `[${styleDataAttributeName}]`;
var styleDataAttribute = { [styleDataAttributeName]: "" };

// src/components/styling/StyleMarker.tsx
var import_StyleMarker_css = __toESM(require_StyleMarker_css());
var import_jsx_runtime3 = require("react/jsx-runtime");
var StyleMarker = (0, import_react3.forwardRef)(({ children, ...props }, forwardedRef) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react_slot.Slot, { ref: forwardedRef, ...props, ...styleDataAttribute, children }));
StyleMarker.displayName = "StyleMarker";

// src/components/ui/Heading.tsx
var import_react_slot2 = require("@radix-ui/react-slot");
var import_clsx = __toESM(require("clsx"));
var import_react4 = require("react");

// src/components/ui/Heading.css.ts
var import_createRuntimeFn = require("@vanilla-extract/recipes/createRuntimeFn");
var headingVariants = (0, import_createRuntimeFn.createRuntimeFn)({ defaultClassName: "Heading__1aa835k0", variantClassNames: { size: { sm: "Heading_headingVariants_size_sm__1aa835k1", md: "Heading_headingVariants_size_md__1aa835k2", lg: "Heading_headingVariants_size_lg__1aa835k3", xl: "Heading_headingVariants_size_xl__1aa835k4" }, weight: { normal: "Heading_headingVariants_weight_normal__1aa835k5", bold: "Heading_headingVariants_weight_bold__1aa835k6" }, truncate: { true: "Heading_headingVariants_truncate_true__1aa835k7" } }, defaultVariants: { size: "lg", weight: "bold" }, compoundVariants: [] });

// src/components/ui/Heading.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var Heading = (0, import_react4.forwardRef)(
  ({
    children,
    className,
    asChild = false,
    as: Tag = "h1",
    size,
    weight,
    truncate,
    ...headingProps
  }, forwardedRef) => {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      import_react_slot2.Slot,
      {
        ...headingProps,
        ref: forwardedRef,
        className: (0, import_clsx.default)(headingVariants({ size, weight, truncate }), className),
        children: asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Tag, { children })
      }
    );
  }
);
Heading.displayName = "Heading";

// src/components/ui/IconButton.tsx
var import_react_slot3 = require("@radix-ui/react-slot");
var import_clsx2 = __toESM(require("clsx"));
var import_react5 = require("react");

// src/components/ui/IconButton.css.ts
var container = "IconButton_container__s6n7bq0";

// src/components/ui/IconButton.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var IconButton = (0, import_react5.forwardRef)(
  ({ className, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? import_react_slot3.Slot : "button";
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Comp, { ...props, className: (0, import_clsx2.default)(container, className), ref: forwardedRef });
  }
);
IconButton.displayName = "Button";

// src/components/connect-modal/ConnectModal.css.ts
var backButtonContainer = "ConnectModal_backButtonContainer__gz8z96";
var closeButtonContainer = "ConnectModal_closeButtonContainer__gz8z97";
var content = "ConnectModal_content__gz8z92";
var overlay = "ConnectModal_overlay__gz8z90";
var selectedViewContainer = "ConnectModal_selectedViewContainer__gz8z95";
var title = "ConnectModal_title__gz8z91";
var viewContainer = "ConnectModal_viewContainer__gz8z94";
var walletListContainer = "ConnectModal_walletListContainer__gz8z99";
var walletListContainerWithViewSelected = "ConnectModal_walletListContainerWithViewSelected__gz8z9a";
var walletListContent = "ConnectModal_walletListContent__gz8z98";
var whatIsAWalletButton = "ConnectModal_whatIsAWalletButton__gz8z93";

// src/components/ui/Button.tsx
var import_react_slot4 = require("@radix-ui/react-slot");
var import_clsx3 = __toESM(require("clsx"));
var import_react6 = require("react");

// src/components/ui/Button.css.ts
var import_createRuntimeFn2 = require("@vanilla-extract/recipes/createRuntimeFn");
var buttonVariants = (0, import_createRuntimeFn2.createRuntimeFn)({ defaultClassName: "Button_buttonVariants__x1s81q0", variantClassNames: { variant: { primary: "Button_buttonVariants_variant_primary__x1s81q1", outline: "Button_buttonVariants_variant_outline__x1s81q2" }, size: { md: "Button_buttonVariants_size_md__x1s81q3", lg: "Button_buttonVariants_size_lg__x1s81q4" } }, defaultVariants: { variant: "primary", size: "md" }, compoundVariants: [] });

// src/components/ui/Button.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var Button = (0, import_react6.forwardRef)(
  ({ className, variant, size, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? import_react_slot4.Slot : "button";
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      Comp,
      {
        ...props,
        className: (0, import_clsx3.default)(buttonVariants({ variant, size }), className),
        ref: forwardedRef
      }
    );
  }
);
Button.displayName = "Button";

// src/components/ui/Text.tsx
var import_react_slot5 = require("@radix-ui/react-slot");
var import_clsx4 = __toESM(require("clsx"));
var import_react7 = require("react");

// src/components/ui/Text.css.ts
var import_createRuntimeFn3 = require("@vanilla-extract/recipes/createRuntimeFn");
var textVariants = (0, import_createRuntimeFn3.createRuntimeFn)({ defaultClassName: "Text__2bv1ur0", variantClassNames: { size: { sm: "Text_textVariants_size_sm__2bv1ur1" }, weight: { normal: "Text_textVariants_weight_normal__2bv1ur2", medium: "Text_textVariants_weight_medium__2bv1ur3", bold: "Text_textVariants_weight_bold__2bv1ur4" }, color: { muted: "Text_textVariants_color_muted__2bv1ur5", danger: "Text_textVariants_color_danger__2bv1ur6" }, mono: { true: "Text_textVariants_mono_true__2bv1ur7" } }, defaultVariants: { size: "sm", weight: "normal" }, compoundVariants: [] });

// src/components/ui/Text.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var Text = (0, import_react7.forwardRef)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      import_react_slot5.Slot,
      {
        ...textProps,
        ref: forwardedRef,
        className: (0, import_clsx4.default)(textVariants({ size, weight, color, mono }), className),
        children: asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Tag, { children })
      }
    );
  }
);
Text.displayName = "Text";

// src/components/connect-modal/views/ConnectionStatus.css.ts
var connectionStatus = "ConnectionStatus_connectionStatus__nckm2d3";
var container2 = "ConnectionStatus_container__nckm2d0";
var retryButtonContainer = "ConnectionStatus_retryButtonContainer__nckm2d4";
var title2 = "ConnectionStatus_title__nckm2d2";
var walletIcon = "ConnectionStatus_walletIcon__nckm2d1";

// src/components/connect-modal/views/ConnectionStatus.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
function ConnectionStatus({
  selectedWallet,
  hadConnectionError,
  onRetryConnection
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: container2, children: [
    selectedWallet.icon && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "img",
      {
        className: walletIcon,
        src: selectedWallet.icon,
        alt: `${selectedWallet.name} logo`
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: title2, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(Heading, { as: "h2", size: "xl", children: [
      "Opening ",
      selectedWallet.name
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: connectionStatus, children: hadConnectionError ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { color: "danger", children: "Connection failed" }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Text, { color: "muted", children: "Confirm connection in the wallet..." }) }),
    hadConnectionError ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: retryButtonContainer, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Button, { type: "button", variant: "outline", onClick: () => onRetryConnection(selectedWallet), children: "Retry Connection" }) }) : null
  ] });
}

// src/components/connect-modal/InfoSection.css.ts
var container3 = "InfoSection_container__1wtioi70";

// src/components/connect-modal/InfoSection.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function InfoSection({ title: title3, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: container3, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Heading, { as: "h3", size: "sm", weight: "normal", children: title3 }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Text, { weight: "medium", color: "muted", children })
  ] });
}

// src/components/connect-modal/views/GettingStarted.css.ts
var container4 = "GettingStarted_container__1fp07e10";
var content2 = "GettingStarted_content__1fp07e11";
var installButtonContainer = "GettingStarted_installButtonContainer__1fp07e12";

// src/components/connect-modal/views/GettingStarted.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
function GettingStarted() {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: container4, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Heading, { as: "h2", children: "Get Started with Sui" }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: content2, children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(InfoSection, { title: "Install the Sui Wallet Extension", children: "We recommend pinning Sui Wallet to your taskbar for quicker access." }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(InfoSection, { title: "Create or Import a Wallet", children: "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone." }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(InfoSection, { title: "Refresh Your Browser", children: "Once you set up your wallet, refresh this window browser to load up the extension." }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: installButtonContainer, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        "a",
        {
          href: "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
          target: "_blank",
          rel: "noreferrer",
          children: "Install Wallet Extension"
        }
      ) }) })
    ] })
  ] });
}

// src/components/connect-modal/views/WhatIsAWallet.css.ts
var container5 = "WhatIsAWallet_container__1ktpkq90";
var content3 = "WhatIsAWallet_content__1ktpkq91";

// src/components/connect-modal/views/WhatIsAWallet.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
function WhatIsAWallet() {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: container5, children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Heading, { as: "h2", children: "What is a Wallet" }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: content3, children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(InfoSection, { title: "Easy Login", children: "No need to create new accounts and passwords for every website. Just connect your wallet and get going." }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(InfoSection, { title: "Store your Digital Assets", children: "Send, receive, store, and display your digital assets like NFTs & coins." })
    ] })
  ] });
}

// src/components/icons/SuiIcon.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
function SuiIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("svg", { width: 28, height: 28, fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("rect", { width: 28, height: 28, rx: 6, fill: "#6FBCF0" }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      "path",
      {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M7.942 20.527A6.875 6.875 0 0 0 13.957 24c2.51 0 4.759-1.298 6.015-3.473a6.875 6.875 0 0 0 0-6.945l-5.29-9.164a.837.837 0 0 0-1.45 0l-5.29 9.164a6.875 6.875 0 0 0 0 6.945Zm4.524-11.75 1.128-1.953a.418.418 0 0 1 .725 0l4.34 7.516a5.365 5.365 0 0 1 .449 4.442 4.675 4.675 0 0 0-.223-.73c-.599-1.512-1.954-2.68-4.029-3.47-1.426-.54-2.336-1.336-2.706-2.364-.476-1.326.021-2.77.316-3.44Zm-1.923 3.332L9.255 14.34a5.373 5.373 0 0 0 0 5.43 5.373 5.373 0 0 0 4.702 2.714 5.38 5.38 0 0 0 3.472-1.247c.125-.314.51-1.462.034-2.646-.44-1.093-1.5-1.965-3.15-2.594-1.864-.707-3.076-1.811-3.6-3.28a4.601 4.601 0 0 1-.17-.608Z",
        fill: "#fff"
      }
    )
  ] });
}

// src/components/connect-modal/wallet-list/WalletList.css.ts
var container6 = "WalletList_container__1v2s6cz0";

// src/components/connect-modal/wallet-list/WalletListItem.tsx
var import_clsx5 = require("clsx");

// src/components/connect-modal/wallet-list/WalletListItem.css.ts
var container7 = "WalletListItem_container__1dqqtqs0";
var selectedWalletItem = "WalletListItem_selectedWalletItem__1dqqtqs2";
var walletIcon2 = "WalletListItem_walletIcon__1dqqtqs3";
var walletItem = "WalletListItem_walletItem__1dqqtqs1";

// src/components/connect-modal/wallet-list/WalletListItem.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function WalletListItem({ name, icon, onClick, isSelected = false }) {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("li", { className: container7, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    "button",
    {
      className: (0, import_clsx5.clsx)(walletItem, { [selectedWalletItem]: isSelected }),
      type: "button",
      onClick,
      children: [
        icon && typeof icon === "string" ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("img", { className: walletIcon2, src: icon, alt: `${name} logo` }) : icon,
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Heading, { size: "md", truncate: true, asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { children: name }) })
      ]
    }
  ) });
}

// src/components/connect-modal/wallet-list/WalletList.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
function WalletList({
  selectedWalletName,
  onPlaceholderClick,
  onSelect,
  wallets
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("ul", { className: container6, children: wallets.length > 0 ? wallets.map((wallet) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    WalletListItem,
    {
      name: wallet.name,
      icon: wallet.icon,
      isSelected: getWalletUniqueIdentifier(wallet) === selectedWalletName,
      onClick: () => onSelect(wallet)
    },
    getWalletUniqueIdentifier(wallet)
  )) : /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    WalletListItem,
    {
      name: "Sui Wallet",
      icon: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(SuiIcon, {}),
      onClick: onPlaceholderClick,
      isSelected: true
    }
  ) });
}

// src/components/connect-modal/ConnectModal.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
function ConnectModal({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  walletFilter = DEFAULT_WALLET_FILTER
}) {
  const [isModalOpen, setModalOpen] = (0, import_react8.useState)(open ?? defaultOpen);
  const [currentView, setCurrentView] = (0, import_react8.useState)();
  const [selectedWallet, setSelectedWallet] = (0, import_react8.useState)();
  const wallets = useWallets().filter(walletFilter);
  const { mutate, isError } = useConnectWallet();
  const resetSelection = () => {
    setSelectedWallet(void 0);
    setCurrentView(void 0);
  };
  const handleOpenChange = (open2) => {
    if (!open2) {
      resetSelection();
    }
    setModalOpen(open2);
    onOpenChange?.(open2);
  };
  const connectWallet = (wallet) => {
    setCurrentView("connection-status");
    mutate(
      { wallet },
      {
        onSuccess: () => handleOpenChange(false)
      }
    );
  };
  let modalContent;
  switch (currentView) {
    case "what-is-a-wallet":
      modalContent = /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(WhatIsAWallet, {});
      break;
    case "getting-started":
      modalContent = /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(GettingStarted, {});
      break;
    case "connection-status":
      modalContent = /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
        ConnectionStatus,
        {
          selectedWallet,
          hadConnectionError: isError,
          onRetryConnection: connectWallet
        }
      );
      break;
    default:
      modalContent = /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(WhatIsAWallet, {});
  }
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(Dialog.Root, { open: open ?? isModalOpen, onOpenChange: handleOpenChange, children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Dialog.Trigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Dialog.Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(StyleMarker, { children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Dialog.Overlay, { className: overlay, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(Dialog.Content, { className: content, "aria-describedby": void 0, children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
        "div",
        {
          className: (0, import_clsx6.default)(walletListContainer, {
            [walletListContainerWithViewSelected]: !!currentView
          }),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: walletListContent, children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Dialog.Title, { className: title, asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Heading, { as: "h2", children: "Connect a Wallet" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                WalletList,
                {
                  wallets,
                  selectedWalletName: getWalletUniqueIdentifier(selectedWallet),
                  onPlaceholderClick: () => setCurrentView("getting-started"),
                  onSelect: (wallet) => {
                    if (getWalletUniqueIdentifier(selectedWallet) !== getWalletUniqueIdentifier(wallet)) {
                      setSelectedWallet(wallet);
                      connectWallet(wallet);
                    }
                  }
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
              "button",
              {
                className: whatIsAWalletButton,
                onClick: () => setCurrentView("what-is-a-wallet"),
                type: "button",
                children: "What is a Wallet?"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
        "div",
        {
          className: (0, import_clsx6.default)(viewContainer, {
            [selectedViewContainer]: !!currentView
          }),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: backButtonContainer, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(IconButton, { type: "button", "aria-label": "Back", onClick: () => resetSelection(), children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(BackIcon, {}) }) }),
            modalContent
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(Dialog.Close, { className: closeButtonContainer, asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(IconButton, { type: "button", "aria-label": "Close", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(CloseIcon, {}) }) })
    ] }) }) }) })
  ] });
}
//# sourceMappingURL=ConnectModal.js.map
