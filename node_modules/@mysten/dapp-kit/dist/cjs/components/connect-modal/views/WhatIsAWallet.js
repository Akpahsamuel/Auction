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

// src/components/connect-modal/views/WhatIsAWallet.tsx
var WhatIsAWallet_exports = {};
__export(WhatIsAWallet_exports, {
  WhatIsAWallet: () => WhatIsAWallet
});
module.exports = __toCommonJS(WhatIsAWallet_exports);

// src/components/ui/Heading.tsx
var import_react_slot = require("@radix-ui/react-slot");
var import_clsx = __toESM(require("clsx"));
var import_react = require("react");

// src/components/ui/Heading.css.ts
var import_createRuntimeFn = require("@vanilla-extract/recipes/createRuntimeFn");
var headingVariants = (0, import_createRuntimeFn.createRuntimeFn)({ defaultClassName: "Heading__1aa835k0", variantClassNames: { size: { sm: "Heading_headingVariants_size_sm__1aa835k1", md: "Heading_headingVariants_size_md__1aa835k2", lg: "Heading_headingVariants_size_lg__1aa835k3", xl: "Heading_headingVariants_size_xl__1aa835k4" }, weight: { normal: "Heading_headingVariants_weight_normal__1aa835k5", bold: "Heading_headingVariants_weight_bold__1aa835k6" }, truncate: { true: "Heading_headingVariants_truncate_true__1aa835k7" } }, defaultVariants: { size: "lg", weight: "bold" }, compoundVariants: [] });

// src/components/ui/Heading.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Heading = (0, import_react.forwardRef)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react_slot.Slot,
      {
        ...headingProps,
        ref: forwardedRef,
        className: (0, import_clsx.default)(headingVariants({ size, weight, truncate }), className),
        children: asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children })
      }
    );
  }
);
Heading.displayName = "Heading";

// src/components/ui/Text.tsx
var import_react_slot2 = require("@radix-ui/react-slot");
var import_clsx2 = __toESM(require("clsx"));
var import_react2 = require("react");

// src/components/ui/Text.css.ts
var import_createRuntimeFn2 = require("@vanilla-extract/recipes/createRuntimeFn");
var textVariants = (0, import_createRuntimeFn2.createRuntimeFn)({ defaultClassName: "Text__2bv1ur0", variantClassNames: { size: { sm: "Text_textVariants_size_sm__2bv1ur1" }, weight: { normal: "Text_textVariants_weight_normal__2bv1ur2", medium: "Text_textVariants_weight_medium__2bv1ur3", bold: "Text_textVariants_weight_bold__2bv1ur4" }, color: { muted: "Text_textVariants_color_muted__2bv1ur5", danger: "Text_textVariants_color_danger__2bv1ur6" }, mono: { true: "Text_textVariants_mono_true__2bv1ur7" } }, defaultVariants: { size: "sm", weight: "normal" }, compoundVariants: [] });

// src/components/ui/Text.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Text = (0, import_react2.forwardRef)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react_slot2.Slot,
      {
        ...textProps,
        ref: forwardedRef,
        className: (0, import_clsx2.default)(textVariants({ size, weight, color, mono }), className),
        children: asChild ? children : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Tag, { children })
      }
    );
  }
);
Text.displayName = "Text";

// src/components/connect-modal/InfoSection.css.ts
var container = "InfoSection_container__1wtioi70";

// src/components/connect-modal/InfoSection.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function InfoSection({ title, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: container, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Heading, { as: "h3", size: "sm", weight: "normal", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Text, { weight: "medium", color: "muted", children })
  ] });
}

// src/components/connect-modal/views/WhatIsAWallet.css.ts
var container2 = "WhatIsAWallet_container__1ktpkq90";
var content = "WhatIsAWallet_content__1ktpkq91";

// src/components/connect-modal/views/WhatIsAWallet.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function WhatIsAWallet() {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: container2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Heading, { as: "h2", children: "What is a Wallet" }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: content, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(InfoSection, { title: "Easy Login", children: "No need to create new accounts and passwords for every website. Just connect your wallet and get going." }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(InfoSection, { title: "Store your Digital Assets", children: "Send, receive, store, and display your digital assets like NFTs & coins." })
    ] })
  ] });
}
//# sourceMappingURL=WhatIsAWallet.js.map
