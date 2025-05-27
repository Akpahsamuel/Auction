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

// src/components/styling/InjectedThemeStyles.tsx
var InjectedThemeStyles_exports = {};
__export(InjectedThemeStyles_exports, {
  InjectedThemeStyles: () => InjectedThemeStyles
});
module.exports = __toCommonJS(InjectedThemeStyles_exports);
var import_dynamic = require("@vanilla-extract/dynamic");

// src/constants/styleDataAttribute.ts
var styleDataAttributeName = "data-dapp-kit";
var styleDataAttributeSelector = `[${styleDataAttributeName}]`;
var styleDataAttribute = { [styleDataAttributeName]: "" };

// src/themes/themeContract.ts
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

// src/components/styling/InjectedThemeStyles.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function InjectedThemeStyles({ theme }) {
  const themeStyles = Array.isArray(theme) ? getDynamicThemeStyles(theme) : getStaticThemeStyles(theme);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "style",
    {
      precedence: "default",
      href: "mysten-dapp-kit-theme",
      dangerouslySetInnerHTML: {
        __html: themeStyles
      }
    }
  );
}
function getDynamicThemeStyles(themes) {
  return themes.map(({ mediaQuery, selector, variables }) => {
    const themeStyles = getStaticThemeStyles(variables);
    const themeStylesWithSelectorPrefix = selector ? `${selector} ${themeStyles}` : themeStyles;
    return mediaQuery ? `@media ${mediaQuery}{${themeStylesWithSelectorPrefix}}` : themeStylesWithSelectorPrefix;
  }).join(" ");
}
function getStaticThemeStyles(theme) {
  return `${styleDataAttributeSelector} {${cssStringFromTheme(theme)}}`;
}
function cssStringFromTheme(theme) {
  return Object.entries((0, import_dynamic.assignInlineVars)(themeVars, theme)).map(([key, value]) => `${key}:${value};`).join("");
}
//# sourceMappingURL=InjectedThemeStyles.js.map
