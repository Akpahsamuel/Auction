import type { RecipeVariants } from '@vanilla-extract/recipes';
export declare const headingVariants: import("@vanilla-extract/recipes").RuntimeFn<{
    size: {
        sm: {
            fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        md: {
            fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        lg: {
            fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        xl: {
            fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
    weight: {
        normal: {
            fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        bold: {
            fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
    truncate: {
        true: {
            overflow: "hidden";
            textOverflow: "ellipsis";
            whiteSpace: "nowrap";
        };
    };
}>;
export type HeadingVariants = RecipeVariants<typeof headingVariants>;
