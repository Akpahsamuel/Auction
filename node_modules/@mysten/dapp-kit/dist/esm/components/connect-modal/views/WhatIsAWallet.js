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

// src/components/ui/Text.tsx
import { Slot as Slot2 } from "@radix-ui/react-slot";
import clsx2 from "clsx";
import { forwardRef as forwardRef2 } from "react";

// src/components/ui/Text.css.ts
import { createRuntimeFn as _7a4682 } from "@vanilla-extract/recipes/createRuntimeFn";
var textVariants = _7a4682({ defaultClassName: "Text__2bv1ur0", variantClassNames: { size: { sm: "Text_textVariants_size_sm__2bv1ur1" }, weight: { normal: "Text_textVariants_weight_normal__2bv1ur2", medium: "Text_textVariants_weight_medium__2bv1ur3", bold: "Text_textVariants_weight_bold__2bv1ur4" }, color: { muted: "Text_textVariants_color_muted__2bv1ur5", danger: "Text_textVariants_color_danger__2bv1ur6" }, mono: { true: "Text_textVariants_mono_true__2bv1ur7" } }, defaultVariants: { size: "sm", weight: "normal" }, compoundVariants: [] });

// src/components/ui/Text.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var Text = forwardRef2(
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
    return /* @__PURE__ */ jsx2(
      Slot2,
      {
        ...textProps,
        ref: forwardedRef,
        className: clsx2(textVariants({ size, weight, color, mono }), className),
        children: asChild ? children : /* @__PURE__ */ jsx2(Tag, { children })
      }
    );
  }
);
Text.displayName = "Text";

// src/components/connect-modal/InfoSection.css.ts
var container = "InfoSection_container__1wtioi70";

// src/components/connect-modal/InfoSection.tsx
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
function InfoSection({ title, children }) {
  return /* @__PURE__ */ jsxs("section", { className: container, children: [
    /* @__PURE__ */ jsx3(Heading, { as: "h3", size: "sm", weight: "normal", children: title }),
    /* @__PURE__ */ jsx3(Text, { weight: "medium", color: "muted", children })
  ] });
}

// src/components/connect-modal/views/WhatIsAWallet.css.ts
var container2 = "WhatIsAWallet_container__1ktpkq90";
var content = "WhatIsAWallet_content__1ktpkq91";

// src/components/connect-modal/views/WhatIsAWallet.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
function WhatIsAWallet() {
  return /* @__PURE__ */ jsxs2("div", { className: container2, children: [
    /* @__PURE__ */ jsx4(Heading, { as: "h2", children: "What is a Wallet" }),
    /* @__PURE__ */ jsxs2("div", { className: content, children: [
      /* @__PURE__ */ jsx4(InfoSection, { title: "Easy Login", children: "No need to create new accounts and passwords for every website. Just connect your wallet and get going." }),
      /* @__PURE__ */ jsx4(InfoSection, { title: "Store your Digital Assets", children: "Send, receive, store, and display your digital assets like NFTs & coins." })
    ] })
  ] });
}
export {
  WhatIsAWallet
};
//# sourceMappingURL=WhatIsAWallet.js.map
