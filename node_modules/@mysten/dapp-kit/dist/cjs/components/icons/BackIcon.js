"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/components/icons/BackIcon.tsx
var BackIcon_exports = {};
__export(BackIcon_exports, {
  BackIcon: () => BackIcon
});
module.exports = __toCommonJS(BackIcon_exports);
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
//# sourceMappingURL=BackIcon.js.map
