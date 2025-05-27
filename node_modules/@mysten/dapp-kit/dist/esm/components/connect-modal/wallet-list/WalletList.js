// src/utils/walletUtils.ts
import { getWallets, isWalletWithRequiredFeatureSet } from "@mysten/wallet-standard";
function getWalletUniqueIdentifier(wallet) {
  return wallet?.id ?? wallet?.name;
}

// src/components/icons/SuiIcon.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function SuiIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { width: 28, height: 28, fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: [
    /* @__PURE__ */ jsx("rect", { width: 28, height: 28, rx: 6, fill: "#6FBCF0" }),
    /* @__PURE__ */ jsx(
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
var container = "WalletList_container__1v2s6cz0";

// src/components/connect-modal/wallet-list/WalletListItem.tsx
import { clsx as clsx2 } from "clsx";

// src/components/ui/Heading.tsx
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { forwardRef } from "react";

// src/components/ui/Heading.css.ts
import { createRuntimeFn as _7a468 } from "@vanilla-extract/recipes/createRuntimeFn";
var headingVariants = _7a468({ defaultClassName: "Heading__1aa835k0", variantClassNames: { size: { sm: "Heading_headingVariants_size_sm__1aa835k1", md: "Heading_headingVariants_size_md__1aa835k2", lg: "Heading_headingVariants_size_lg__1aa835k3", xl: "Heading_headingVariants_size_xl__1aa835k4" }, weight: { normal: "Heading_headingVariants_weight_normal__1aa835k5", bold: "Heading_headingVariants_weight_bold__1aa835k6" }, truncate: { true: "Heading_headingVariants_truncate_true__1aa835k7" } }, defaultVariants: { size: "lg", weight: "bold" }, compoundVariants: [] });

// src/components/ui/Heading.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var Heading = forwardRef(
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
    return /* @__PURE__ */ jsx2(
      Slot,
      {
        ...headingProps,
        ref: forwardedRef,
        className: clsx(headingVariants({ size, weight, truncate }), className),
        children: asChild ? children : /* @__PURE__ */ jsx2(Tag, { children })
      }
    );
  }
);
Heading.displayName = "Heading";

// src/components/connect-modal/wallet-list/WalletListItem.css.ts
var container2 = "WalletListItem_container__1dqqtqs0";
var selectedWalletItem = "WalletListItem_selectedWalletItem__1dqqtqs2";
var walletIcon = "WalletListItem_walletIcon__1dqqtqs3";
var walletItem = "WalletListItem_walletItem__1dqqtqs1";

// src/components/connect-modal/wallet-list/WalletListItem.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function WalletListItem({ name, icon, onClick, isSelected = false }) {
  return /* @__PURE__ */ jsx3("li", { className: container2, children: /* @__PURE__ */ jsxs2(
    "button",
    {
      className: clsx2(walletItem, { [selectedWalletItem]: isSelected }),
      type: "button",
      onClick,
      children: [
        icon && typeof icon === "string" ? /* @__PURE__ */ jsx3("img", { className: walletIcon, src: icon, alt: `${name} logo` }) : icon,
        /* @__PURE__ */ jsx3(Heading, { size: "md", truncate: true, asChild: true, children: /* @__PURE__ */ jsx3("div", { children: name }) })
      ]
    }
  ) });
}

// src/components/connect-modal/wallet-list/WalletList.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function WalletList({
  selectedWalletName,
  onPlaceholderClick,
  onSelect,
  wallets
}) {
  return /* @__PURE__ */ jsx4("ul", { className: container, children: wallets.length > 0 ? wallets.map((wallet) => /* @__PURE__ */ jsx4(
    WalletListItem,
    {
      name: wallet.name,
      icon: wallet.icon,
      isSelected: getWalletUniqueIdentifier(wallet) === selectedWalletName,
      onClick: () => onSelect(wallet)
    },
    getWalletUniqueIdentifier(wallet)
  )) : /* @__PURE__ */ jsx4(
    WalletListItem,
    {
      name: "Sui Wallet",
      icon: /* @__PURE__ */ jsx4(SuiIcon, {}),
      onClick: onPlaceholderClick,
      isSelected: true
    }
  ) });
}
export {
  WalletList
};
//# sourceMappingURL=WalletList.js.map
