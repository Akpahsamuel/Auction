declare const themeContractValues: {
    blurs: {
        modalOverlay: string;
    };
    backgroundColors: {
        primaryButton: string;
        primaryButtonHover: string;
        outlineButtonHover: string;
        walletItemHover: string;
        walletItemSelected: string;
        modalOverlay: string;
        modalPrimary: string;
        modalSecondary: string;
        iconButton: string;
        iconButtonHover: string;
        dropdownMenu: string;
        dropdownMenuSeparator: string;
    };
    borderColors: {
        outlineButton: string;
    };
    colors: {
        primaryButton: string;
        outlineButton: string;
        body: string;
        bodyMuted: string;
        bodyDanger: string;
        iconButton: string;
    };
    radii: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
    };
    shadows: {
        primaryButton: string;
        walletItemSelected: string;
    };
    fontWeights: {
        normal: string;
        medium: string;
        bold: string;
    };
    fontSizes: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
    };
    typography: {
        fontFamily: string;
        fontStyle: string;
        lineHeight: string;
        letterSpacing: string;
    };
};
export type ThemeVars = typeof themeContractValues;
/**
 * A custom theme that is enabled when various conditions are
 */
export type DynamicTheme = {
    /**
     * An optional media query required for the given theme to be enabled. This is useful
     * when you want the theme of your application to automatically switch depending on
     * a media feature.
     *
     * @example '(prefers-color-scheme: dark)'
     */
    mediaQuery?: string;
    /**
     * An optional CSS selector required for the given theme to be enabled. This is useful
     * when you have a manual theme switcher on your application that sets a top-level
     * class name or data-attribute to control the current theme.
     *
     * @example '.data-dark'
     */
    selector?: string;
    /** The theme definitions that will be set when the selector and mediaQuery criteria are matched. */
    variables: ThemeVars;
};
export type Theme = ThemeVars | DynamicTheme[];
export declare const themeVars: {
    blurs: {
        modalOverlay: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    backgroundColors: {
        primaryButton: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        primaryButtonHover: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        outlineButtonHover: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        walletItemHover: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        walletItemSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        modalOverlay: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        modalPrimary: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        modalSecondary: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        iconButton: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        iconButtonHover: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        dropdownMenu: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        dropdownMenuSeparator: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    borderColors: {
        outlineButton: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    colors: {
        primaryButton: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        outlineButton: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        body: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        bodyMuted: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        bodyDanger: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        iconButton: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    radii: {
        small: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        medium: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        large: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        xlarge: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    shadows: {
        primaryButton: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        walletItemSelected: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    fontWeights: {
        normal: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        medium: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        bold: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    fontSizes: {
        small: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        medium: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        large: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        xlarge: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
    typography: {
        fontFamily: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        fontStyle: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        letterSpacing: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
    };
};
export {};
