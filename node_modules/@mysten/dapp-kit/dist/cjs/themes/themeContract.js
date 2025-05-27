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

// src/themes/themeContract.ts
var themeContract_exports = {};
__export(themeContract_exports, {
  themeVars: () => themeVars
});
module.exports = __toCommonJS(themeContract_exports);
var import_css = require("@vanilla-extract/css");
var themeContractValues = {
  blurs: {
    modalOverlay: ""
  },
  backgroundColors: {
    primaryButton: "",
    primaryButtonHover: "",
    outlineButtonHover: "",
    walletItemHover: "",
    walletItemSelected: "",
    modalOverlay: "",
    modalPrimary: "",
    modalSecondary: "",
    iconButton: "",
    iconButtonHover: "",
    dropdownMenu: "",
    dropdownMenuSeparator: ""
  },
  borderColors: {
    outlineButton: ""
  },
  colors: {
    primaryButton: "",
    outlineButton: "",
    body: "",
    bodyMuted: "",
    bodyDanger: "",
    iconButton: ""
  },
  radii: {
    small: "",
    medium: "",
    large: "",
    xlarge: ""
  },
  shadows: {
    primaryButton: "",
    walletItemSelected: ""
  },
  fontWeights: {
    normal: "",
    medium: "",
    bold: ""
  },
  fontSizes: {
    small: "",
    medium: "",
    large: "",
    xlarge: ""
  },
  typography: {
    fontFamily: "",
    fontStyle: "",
    lineHeight: "",
    letterSpacing: ""
  }
};
var themeVars = (0, import_css.createGlobalThemeContract)(
  themeContractValues,
  (_, path) => `dapp-kit-${path.join("-")}`
);
//# sourceMappingURL=themeContract.js.map
