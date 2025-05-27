import type { TextVariants } from './Text.css.js';
type TextAsChildProps = {
    asChild?: boolean;
    as?: never;
};
type TextDivProps = {
    as: 'div';
    asChild?: never;
};
type TextProps = (TextAsChildProps | TextDivProps) & React.HTMLAttributes<HTMLDivElement> & TextVariants;
declare const Text: import("react").ForwardRefExoticComponent<TextProps & import("react").RefAttributes<HTMLDivElement>>;
export { Text };
