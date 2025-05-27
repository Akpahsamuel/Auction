// src/components/ui/Text.tsx
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { forwardRef } from "react";

// src/components/ui/Text.css.ts
import { createRuntimeFn as _7a468 } from "@vanilla-extract/recipes/createRuntimeFn";
var textVariants = _7a468({ defaultClassName: "Text__2bv1ur0", variantClassNames: { size: { sm: "Text_textVariants_size_sm__2bv1ur1" }, weight: { normal: "Text_textVariants_weight_normal__2bv1ur2", medium: "Text_textVariants_weight_medium__2bv1ur3", bold: "Text_textVariants_weight_bold__2bv1ur4" }, color: { muted: "Text_textVariants_color_muted__2bv1ur5", danger: "Text_textVariants_color_danger__2bv1ur6" }, mono: { true: "Text_textVariants_mono_true__2bv1ur7" } }, defaultVariants: { size: "sm", weight: "normal" }, compoundVariants: [] });

// src/components/ui/Text.tsx
import { jsx } from "react/jsx-runtime";
var Text = forwardRef(
  ({
    children,
    className,
    asChild = false,
    as: Tag = "div",
    size,
    weight,
    color,
    mono,
    ...textProps
  }, forwardedRef) => {
    return /* @__PURE__ */ jsx(
      Slot,
      {
        ...textProps,
        ref: forwardedRef,
        className: clsx(textVariants({ size, weight, color, mono }), className),
        children: asChild ? children : /* @__PURE__ */ jsx(Tag, { children })
      }
    );
  }
);
Text.displayName = "Text";
export {
  Text
};
//# sourceMappingURL=Text.js.map
