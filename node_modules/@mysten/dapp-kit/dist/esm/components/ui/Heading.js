// src/components/ui/Heading.tsx
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { forwardRef } from "react";

// src/components/ui/Heading.css.ts
import { createRuntimeFn as _7a468 } from "@vanilla-extract/recipes/createRuntimeFn";
var headingVariants = _7a468({ defaultClassName: "Heading__1aa835k0", variantClassNames: { size: { sm: "Heading_headingVariants_size_sm__1aa835k1", md: "Heading_headingVariants_size_md__1aa835k2", lg: "Heading_headingVariants_size_lg__1aa835k3", xl: "Heading_headingVariants_size_xl__1aa835k4" }, weight: { normal: "Heading_headingVariants_weight_normal__1aa835k5", bold: "Heading_headingVariants_weight_bold__1aa835k6" }, truncate: { true: "Heading_headingVariants_truncate_true__1aa835k7" } }, defaultVariants: { size: "lg", weight: "bold" }, compoundVariants: [] });

// src/components/ui/Heading.tsx
import { jsx } from "react/jsx-runtime";
var Heading = forwardRef(
  ({
    children,
    className,
    asChild = false,
    as: Tag = "h1",
    size,
    weight,
    truncate,
    ...headingProps
  }, forwardedRef) => {
    return /* @__PURE__ */ jsx(
      Slot,
      {
        ...headingProps,
        ref: forwardedRef,
        className: clsx(headingVariants({ size, weight, truncate }), className),
        children: asChild ? children : /* @__PURE__ */ jsx(Tag, { children })
      }
    );
  }
);
Heading.displayName = "Heading";
export {
  Heading
};
//# sourceMappingURL=Heading.js.map
