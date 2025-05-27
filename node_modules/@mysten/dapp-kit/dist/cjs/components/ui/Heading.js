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

// src/components/ui/Heading.tsx
var Heading_exports = {};
__export(Heading_exports, {
  Heading: () => Heading
});
module.exports = __toCommonJS(Heading_exports);
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
//# sourceMappingURL=Heading.js.map
