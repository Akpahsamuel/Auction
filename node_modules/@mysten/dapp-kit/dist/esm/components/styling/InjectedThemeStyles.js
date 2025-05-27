// src/components/styling/InjectedThemeStyles.tsx
import { assignInlineVars } from "@vanilla-extract/dynamic";

// src/constants/styleDataAttribute.ts
var styleDataAttributeName = "data-dapp-kit";
var styleDataAttributeSelector = `[${styleDataAttributeName}]`;
var styleDataAttribute = { [styleDataAttributeName]: "" };

// src/themes/themeContract.ts
import { createGlobalThemeContract } from "@vanilla-extract/css";
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
var themeVars = createGlobalThemeContract(
  themeContractValues,
  (_, path) => `dapp-kit-${path.join("-")}`
);

// src/components/styling/InjectedThemeStyles.tsx
import { jsx } from "react/jsx-runtime";
function InjectedThemeStyles({ theme }) {
  const themeStyles = Array.isArray(theme) ? getDynamicThemeStyles(theme) : getStaticThemeStyles(theme);
  return /* @__PURE__ */ jsx(
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
  return Object.entries(assignInlineVars(themeVars, theme)).map(([key, value]) => `${key}:${value};`).join("");
}
export {
  InjectedThemeStyles
};
//# sourceMappingURL=InjectedThemeStyles.js.map
