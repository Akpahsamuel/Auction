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

// src/components/icons/SuiIcon.tsx
var SuiIcon_exports = {};
__export(SuiIcon_exports, {
  SuiIcon: () => SuiIcon
});
module.exports = __toCommonJS(SuiIcon_exports);
var import_jsx_runtime = require("react/jsx-runtime");
function SuiIcon(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: 28, height: 28, fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { width: 28, height: 28, rx: 6, fill: "#6FBCF0" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "path",
      {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M7.942 20.527A6.875 6.875 0 0 0 13.957 24c2.51 0 4.759-1.298 6.015-3.473a6.875 6.875 0 0 0 0-6.945l-5.29-9.164a.837.837 0 0 0-1.45 0l-5.29 9.164a6.875 6.875 0 0 0 0 6.945Zm4.524-11.75 1.128-1.953a.418.418 0 0 1 .725 0l4.34 7.516a5.365 5.365 0 0 1 .449 4.442 4.675 4.675 0 0 0-.223-.73c-.599-1.512-1.954-2.68-4.029-3.47-1.426-.54-2.336-1.336-2.706-2.364-.476-1.326.021-2.77.316-3.44Zm-1.923 3.332L9.255 14.34a5.373 5.373 0 0 0 0 5.43 5.373 5.373 0 0 0 4.702 2.714 5.38 5.38 0 0 0 3.472-1.247c.125-.314.51-1.462.034-2.646-.44-1.093-1.5-1.965-3.15-2.594-1.864-.707-3.076-1.811-3.6-3.28a4.601 4.601 0 0 1-.17-.608Z",
        fill: "#fff"
      }
    )
  ] });
}
//# sourceMappingURL=SuiIcon.js.map
