// src/components/ui/Button.tsx
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { forwardRef } from "react";

// src/components/ui/Button.css.ts
import { createRuntimeFn as _7a468 } from "@vanilla-extract/recipes/createRuntimeFn";
var buttonVariants = _7a468({ defaultClassName: "Button_buttonVariants__x1s81q0", variantClassNames: { variant: { primary: "Button_buttonVariants_variant_primary__x1s81q1", outline: "Button_buttonVariants_variant_outline__x1s81q2" }, size: { md: "Button_buttonVariants_size_md__x1s81q3", lg: "Button_buttonVariants_size_lg__x1s81q4" } }, defaultVariants: { variant: "primary", size: "md" }, compoundVariants: [] });

// src/components/ui/Button.tsx
import { jsx } from "react/jsx-runtime";
var Button = forwardRef(
  ({ className, variant, size, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ...props,
        className: clsx(buttonVariants({ variant, size }), className),
        ref: forwardedRef
      }
    );
  }
);
Button.displayName = "Button";

// src/components/ui/Heading.tsx
import { Slot as Slot2 } from "@radix-ui/react-slot";
import clsx2 from "clsx";
import { forwardRef as forwardRef2 } from "react";

// src/components/ui/Heading.css.ts
import { createRuntimeFn as _7a4682 } from "@vanilla-extract/recipes/createRuntimeFn";
var headingVariants = _7a4682({ defaultClassName: "Heading__1aa835k0", variantClassNames: { size: { sm: "Heading_headingVariants_size_sm__1aa835k1", md: "Heading_headingVariants_size_md__1aa835k2", lg: "Heading_headingVariants_size_lg__1aa835k3", xl: "Heading_headingVariants_size_xl__1aa835k4" }, weight: { normal: "Heading_headingVariants_weight_normal__1aa835k5", bold: "Heading_headingVariants_weight_bold__1aa835k6" }, truncate: { true: "Heading_headingVariants_truncate_true__1aa835k7" } }, defaultVariants: { size: "lg", weight: "bold" }, compoundVariants: [] });

// src/components/ui/Heading.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var Heading = forwardRef2(
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
      Slot2,
      {
        ...headingProps,
        ref: forwardedRef,
        className: clsx2(headingVariants({ size, weight, truncate }), className),
        children: asChild ? children : /* @__PURE__ */ jsx2(Tag, { children })
      }
    );
  }
);
Heading.displayName = "Heading";

// src/components/ui/Text.tsx
import { Slot as Slot3 } from "@radix-ui/react-slot";
import clsx3 from "clsx";
import { forwardRef as forwardRef3 } from "react";

// src/components/ui/Text.css.ts
import { createRuntimeFn as _7a4683 } from "@vanilla-extract/recipes/createRuntimeFn";
var textVariants = _7a4683({ defaultClassName: "Text__2bv1ur0", variantClassNames: { size: { sm: "Text_textVariants_size_sm__2bv1ur1" }, weight: { normal: "Text_textVariants_weight_normal__2bv1ur2", medium: "Text_textVariants_weight_medium__2bv1ur3", bold: "Text_textVariants_weight_bold__2bv1ur4" }, color: { muted: "Text_textVariants_color_muted__2bv1ur5", danger: "Text_textVariants_color_danger__2bv1ur6" }, mono: { true: "Text_textVariants_mono_true__2bv1ur7" } }, defaultVariants: { size: "sm", weight: "normal" }, compoundVariants: [] });

// src/components/ui/Text.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var Text = forwardRef3(
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
    return /* @__PURE__ */ jsx3(
      Slot3,
      {
        ...textProps,
        ref: forwardedRef,
        className: clsx3(textVariants({ size, weight, color, mono }), className),
        children: asChild ? children : /* @__PURE__ */ jsx3(Tag, { children })
      }
    );
  }
);
Text.displayName = "Text";

// src/components/connect-modal/views/ConnectionStatus.css.ts
var connectionStatus = "ConnectionStatus_connectionStatus__nckm2d3";
var container = "ConnectionStatus_container__nckm2d0";
var retryButtonContainer = "ConnectionStatus_retryButtonContainer__nckm2d4";
var title = "ConnectionStatus_title__nckm2d2";
var walletIcon = "ConnectionStatus_walletIcon__nckm2d1";

// src/components/connect-modal/views/ConnectionStatus.tsx
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
function ConnectionStatus({
  selectedWallet,
  hadConnectionError,
  onRetryConnection
}) {
  return /* @__PURE__ */ jsxs("div", { className: container, children: [
    selectedWallet.icon && /* @__PURE__ */ jsx4(
      "img",
      {
        className: walletIcon,
        src: selectedWallet.icon,
        alt: `${selectedWallet.name} logo`
      }
    ),
    /* @__PURE__ */ jsx4("div", { className: title, children: /* @__PURE__ */ jsxs(Heading, { as: "h2", size: "xl", children: [
      "Opening ",
      selectedWallet.name
    ] }) }),
    /* @__PURE__ */ jsx4("div", { className: connectionStatus, children: hadConnectionError ? /* @__PURE__ */ jsx4(Text, { color: "danger", children: "Connection failed" }) : /* @__PURE__ */ jsx4(Text, { color: "muted", children: "Confirm connection in the wallet..." }) }),
    hadConnectionError ? /* @__PURE__ */ jsx4("div", { className: retryButtonContainer, children: /* @__PURE__ */ jsx4(Button, { type: "button", variant: "outline", onClick: () => onRetryConnection(selectedWallet), children: "Retry Connection" }) }) : null
  ] });
}
export {
  ConnectionStatus
};
//# sourceMappingURL=ConnectionStatus.js.map
