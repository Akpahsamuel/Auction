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

// src/components/connect-modal/views/GettingStarted.tsx
var GettingStarted_exports = {};
__export(GettingStarted_exports, {
  GettingStarted: () => GettingStarted
});
module.exports = __toCommonJS(GettingStarted_exports);

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

// src/components/connect-modal/InfoSection.css.ts
var container = "InfoSection_container__1wtioi70";

// src/components/connect-modal/InfoSection.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function InfoSection({ title, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: container, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Heading, { as: "h3", size: "sm", weight: "normal", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Text, { weight: "medium", color: "muted", children })
  ] });
}

// src/components/connect-modal/views/GettingStarted.css.ts
var container2 = "GettingStarted_container__1fp07e10";
var content = "GettingStarted_content__1fp07e11";
var installButtonContainer = "GettingStarted_installButtonContainer__1fp07e12";

// src/components/connect-modal/views/GettingStarted.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function GettingStarted() {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: container2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Heading, { as: "h2", children: "Get Started with Sui" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: content, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(InfoSection, { title: "Install the Sui Wallet Extension", children: "We recommend pinning Sui Wallet to your taskbar for quicker access." }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(InfoSection, { title: "Create or Import a Wallet", children: "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone." }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(InfoSection, { title: "Refresh Your Browser", children: "Once you set up your wallet, refresh this window browser to load up the extension." }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: installButtonContainer, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
//# sourceMappingURL=GettingStarted.js.map
