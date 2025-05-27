"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/components/ui/Text.css.ts
var Text_css_exports = {};
__export(Text_css_exports, {
  textVariants: () => textVariants
});
module.exports = __toCommonJS(Text_css_exports);
var import_createRuntimeFn = require("@vanilla-extract/recipes/createRuntimeFn");
var textVariants = (0, import_createRuntimeFn.createRuntimeFn)({ defaultClassName: "Text__2bv1ur0", variantClassNames: { size: { sm: "Text_textVariants_size_sm__2bv1ur1" }, weight: { normal: "Text_textVariants_weight_normal__2bv1ur2", medium: "Text_textVariants_weight_medium__2bv1ur3", bold: "Text_textVariants_weight_bold__2bv1ur4" }, color: { muted: "Text_textVariants_color_muted__2bv1ur5", danger: "Text_textVariants_color_danger__2bv1ur6" }, mono: { true: "Text_textVariants_mono_true__2bv1ur7" } }, defaultVariants: { size: "sm", weight: "normal" }, compoundVariants: [] });
//# sourceMappingURL=Text.css.js.map
