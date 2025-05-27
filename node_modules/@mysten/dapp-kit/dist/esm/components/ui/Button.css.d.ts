import type { RecipeVariants } from '@vanilla-extract/recipes';
export declare const buttonVariants: import("@vanilla-extract/recipes").RuntimeFn<{
    variant: {
        primary: {
            backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            boxShadow: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            ':hover': {
                backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
        outline: {
            borderWidth: number;
            borderStyle: "solid";
            borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            ':hover': {
                backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
    };
    size: {
        md: {
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            padding: "8px 16px";
        };
        lg: {
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            padding: "16px 24px ";
        };
    };
}>;
export type ButtonVariants = RecipeVariants<typeof buttonVariants>;
