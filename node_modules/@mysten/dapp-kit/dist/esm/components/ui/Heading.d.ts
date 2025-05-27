import type { HeadingVariants } from './Heading.css.js';
type HeadingAsChildProps = {
    asChild?: boolean;
    as?: never;
};
type HeadingAsProps = {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    asChild?: never;
};
type HeadingProps = (HeadingAsChildProps | HeadingAsProps) & React.HTMLAttributes<HTMLHeadingElement> & HeadingVariants;
declare const Heading: import("react").ForwardRefExoticComponent<HeadingProps & import("react").RefAttributes<HTMLHeadingElement>>;
export { Heading };
