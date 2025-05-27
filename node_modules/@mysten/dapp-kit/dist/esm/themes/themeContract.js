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
export {
  themeVars
};
//# sourceMappingURL=themeContract.js.map
