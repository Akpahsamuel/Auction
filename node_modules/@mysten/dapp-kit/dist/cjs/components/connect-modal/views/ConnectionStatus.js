"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/components/connect-modal/views/ConnectionStatus.tsx
var ConnectionStatus_exports = {};
__export(ConnectionStatus_exports, {
  ConnectionStatus: () => ConnectionStatus
});
module.exports = __toCommonJS(ConnectionStatus_exports);

// src/components/ui/Button.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_clsx = __toESM(require("clsx"));
var import_react = require("react");

// src/components/ui/Button.css.ts
var import_createRuntimeFn = require("@vanilla-extract/recipes/createRuntimeFn");
var buttonVariants = (0, import_createRuntimeFn.createRuntimeFn)({ defaultClassName: "Button_buttonVariants__x1s81q0", variantClassNames: { variant: { primary: "Button_buttonVariants_variant_primary__x1s81q1", outline: "Button_buttonVariants_variant_outline__x1s81q2" }, size: { md: "Button_buttonVariants_size_md__x1s81q3", lg: "Button_buttonVariants_size_lg__x1s81q4" } }, defaultVariants: { variant: "primary", size: "md" }, compoundVariants: [] });

// src/components/ui/Button.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Button = (0, import_react.forwardRef)(
  ({ className, variant, size, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? import_react_slot.Slot : "button";
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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

// src/components/ui/Heading.tsx
var import_react_slot2 = require("@radix-ui/react-slot");
var import_clsx2 = __toESM(require("clsx"));
var import_react2 = require("react");

// src/components/ui/Heading.css.ts
var import_createRuntimeFn2 = require("@vanilla-extract/recipes/createRuntimeFn");
var headingVariants = (0, import_createRuntimeFn2.createRuntimeFn)({ defaultClassName: "Heading__1aa835k0", variantClassNames: { size: { sm: "Heading_headingVariants_size_sm__1aa835k1", md: "Heading_headingVariants_size_md__1aa835k2", lg: "Heading_headingVariants_size_lg__1aa835k3", xl: "Heading_headingVariants_size_xl__1aa835k4" }, weight: { normal: "Heading_headingVariants_weight_normal__1aa835k5", bold: "Heading_headingVariants_weight_bold__1aa835k6" }, truncate: { true: "Heading_headingVariants_truncate_true__1aa835k7" } }, defaultVariants: { size: "lg", weight: "bold" }, compoundVariants: [] });

// src/components/ui/Heading.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Heading = (0, import_react2.forwardRef)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react_slot2.Slot,
      {
        ...headingProps,
        ref: forwardedRef,
        className: (0, import_clsx2.default)(headingVariants({ size, weight, truncate }), className),
        children: asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Tag, { children })
      }
    );
  }
);
Heading.displayName = "Heading";

// src/components/ui/Text.tsx
var import_react_slot3 = require("@radix-ui/react-slot");
var import_clsx3 = __toESM(require("clsx"));
var import_react3 = require("react");

// src/components/ui/Text.css.ts
var import_createRuntimeFn3 = require("@vanilla-extract/recipes/createRuntimeFn");
var textVariants = (0, import_createRuntimeFn3.createRuntimeFn)({ defaultClassName: "Text__2bv1ur0", variantClassNames: { size: { sm: "Text_textVariants_size_sm__2bv1ur1" }, weight: { normal: "Text_textVariants_weight_normal__2bv1ur2", medium: "Text_textVariants_weight_medium__2bv1ur3", bold: "Text_textVariants_weight_bold__2bv1ur4" }, color: { muted: "Text_textVariants_color_muted__2bv1ur5", danger: "Text_textVariants_color_danger__2bv1ur6" }, mono: { true: "Text_textVariants_mono_true__2bv1ur7" } }, defaultVariants: { size: "sm", weight: "normal" }, compoundVariants: [] });

// src/components/ui/Text.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var Text = (0, import_react3.forwardRef)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_react_slot3.Slot,
      {
        ...textProps,
        ref: forwardedRef,
        className: (0, import_clsx3.default)(textVariants({ size, weight, color, mono }), className),
        children: asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Tag, { children })
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
var import_jsx_runtime4 = require("react/jsx-runtime");
function ConnectionStatus({
  selectedWallet,
  hadConnectionError,
  onRetryConnection
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: container, children: [
    selectedWallet.icon && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "img",
      {
        className: walletIcon,
        src: selectedWallet.icon,
        alt: `${selectedWallet.name} logo`
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: title, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Heading, { as: "h2", size: "xl", children: [
      "Opening ",
      selectedWallet.name
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: connectionStatus, children: hadConnectionError ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Text, { color: "danger", children: "Connection failed" }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Text, { color: "muted", children: "Confirm connection in the wallet..." }) }),
    hadConnectionError ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: retryButtonContainer, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Button, { type: "button", variant: "outline", onClick: () => onRetryConnection(selectedWallet), children: "Retry Connection" }) }) : null
  ] });
}
//# sourceMappingURL=ConnectionStatus.js.map
