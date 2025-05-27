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

// src/components/icons/CloseIcon.tsx
var CloseIcon_exports = {};
__export(CloseIcon_exports, {
  CloseIcon: () => CloseIcon
});
module.exports = __toCommonJS(CloseIcon_exports);
var import_jsx_runtime = require("react/jsx-runtime");
function CloseIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: 10, height: 10, fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "path",
    {
      d: "M9.708.292a.999.999 0 0 0-1.413 0l-3.289 3.29L1.717.291A.999.999 0 0 0 .305 1.705l3.289 3.289-3.29 3.289a.999.999 0 1 0 1.413 1.412l3.29-3.289 3.288 3.29a.999.999 0 0 0 1.413-1.413l-3.29-3.29 3.29-3.288a.999.999 0 0 0 0-1.413Z",
      fill: "currentColor"
    }
  ) });
}
//# sourceMappingURL=CloseIcon.js.map
