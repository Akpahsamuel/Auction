// src/components/ui/IconButton.tsx
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { forwardRef } from "react";

// src/components/ui/IconButton.css.ts
var container = "IconButton_container__s6n7bq0";

// src/components/ui/IconButton.tsx
import { jsx } from "react/jsx-runtime";
var IconButton = forwardRef(
  ({ className, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { ...props, className: clsx(container, className), ref: forwardedRef });
  }
);
IconButton.displayName = "Button";
export {
  IconButton
};
//# sourceMappingURL=IconButton.js.map
