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
import { jsx } from "react/jsx-runtime";
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
    return /* @__PURE__ */ jsx(
      Slot,
      {
        ...headingProps,
        ref: forwardedRef,
        className: clsx(headingVariants({ size, weight, truncate }), className),
        children: asChild ? children : /* @__PURE__ */ jsx(Tag, { children })
      }
    );
  }
);
Heading.displayName = "Heading";

// src/components/connect-modal/wallet-list/WalletListItem.css.ts
var container = "WalletListItem_container__1dqqtqs0";
var selectedWalletItem = "WalletListItem_selectedWalletItem__1dqqtqs2";
var walletIcon = "WalletListItem_walletIcon__1dqqtqs3";
var walletItem = "WalletListItem_walletItem__1dqqtqs1";

// src/components/connect-modal/wallet-list/WalletListItem.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function WalletListItem({ name, icon, onClick, isSelected = false }) {
  return /* @__PURE__ */ jsx2("li", { className: container, children: /* @__PURE__ */ jsxs(
    "button",
    {
      className: clsx2(walletItem, { [selectedWalletItem]: isSelected }),
      type: "button",
      onClick,
      children: [
        icon && typeof icon === "string" ? /* @__PURE__ */ jsx2("img", { className: walletIcon, src: icon, alt: `${name} logo` }) : icon,
        /* @__PURE__ */ jsx2(Heading, { size: "md", truncate: true, asChild: true, children: /* @__PURE__ */ jsx2("div", { children: name }) })
      ]
    }
  ) });
}
export {
  WalletListItem
};
//# sourceMappingURL=WalletListItem.js.map
