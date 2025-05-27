import type { RecipeVariants } from '@vanilla-extract/recipes';
export declare const textVariants: import("@vanilla-extract/recipes").RuntimeFn<{
    size: {
        sm: {
            fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
    weight: {
        normal: {
            fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        medium: {
            fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        bold: {
            fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
    color: {
        muted: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        danger: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
    mono: {
        true: {
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace";
        };
    };
}>;
export type TextVariants = RecipeVariants<typeof textVariants>;
