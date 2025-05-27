// src/components/ui/Button.tsx
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { forwardRef } from "react";

// src/components/ui/Button.css.ts
import { createRuntimeFn as _7a468 } from "@vanilla-extract/recipes/createRuntimeFn";
var buttonVariants = _7a468({ defaultClassName: "Button_buttonVariants__x1s81q0", variantClassNames: { variant: { primary: "Button_buttonVariants_variant_primary__x1s81q1", outline: "Button_buttonVariants_variant_outline__x1s81q2" }, size: { md: "Button_buttonVariants_size_md__x1s81q3", lg: "Button_buttonVariants_size_lg__x1s81q4" } }, defaultVariants: { variant: "primary", size: "md" }, compoundVariants: [] });

// src/components/ui/Button.tsx
import { jsx } from "react/jsx-runtime";
var Button = forwardRef(
  ({ className, variant, size, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ...props,
        className: clsx(buttonVariants({ variant, size }), className),
        ref: forwardedRef
      }
    );
  }
);
Button.displayName = "Button";
export {
  Button
};
//# sourceMappingURL=Button.js.map
