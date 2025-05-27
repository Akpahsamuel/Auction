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

// src/components/ui/IconButton.tsx
var IconButton_exports = {};
__export(IconButton_exports, {
  IconButton: () => IconButton
});
module.exports = __toCommonJS(IconButton_exports);
var import_react_slot = require("@radix-ui/react-slot");
var import_clsx = __toESM(require("clsx"));
var import_react = require("react");

// src/components/ui/IconButton.css.ts
var container = "IconButton_container__s6n7bq0";

// src/components/ui/IconButton.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var IconButton = (0, import_react.forwardRef)(
  ({ className, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? import_react_slot.Slot : "button";
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, { ...props, className: (0, import_clsx.default)(container, className), ref: forwardedRef });
  }
);
IconButton.displayName = "Button";
//# sourceMappingURL=IconButton.js.map
