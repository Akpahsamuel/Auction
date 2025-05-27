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

// src/components/icons/ChevronIcon.tsx
var ChevronIcon_exports = {};
__export(ChevronIcon_exports, {
  ChevronIcon: () => ChevronIcon
});
module.exports = __toCommonJS(ChevronIcon_exports);
var import_jsx_runtime = require("react/jsx-runtime");
function ChevronIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", width: 16, height: 16, fill: "none", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "path",
    {
      stroke: "#A0B6C3",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 1.5,
      d: "m4 6 4 4 4-4"
    }
  ) });
}
//# sourceMappingURL=ChevronIcon.js.map
