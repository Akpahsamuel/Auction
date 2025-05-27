"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// vanilla-extract-css-ns:src/components/styling/StyleMarker.css.ts.vanilla.css?source=OndoZXJlKCopIHsKICBib3gtc2l6aW5nOiBib3JkZXItYm94OwogIGNvbG9yOiB2YXIoLS1kYXBwLWtpdC1jb2xvcnMtYm9keSk7CiAgZm9udC1mYW1pbHk6IHZhcigtLWRhcHAta2l0LXR5cG9ncmFwaHktZm9udEZhbWlseSk7CiAgZm9udC1zaXplOiB2YXIoLS1kYXBwLWtpdC1mb250V2VpZ2h0cy1ub3JtYWwpOwogIGZvbnQtc3R5bGU6IHZhcigtLWRhcHAta2l0LXR5cG9ncmFwaHktZm9udFN0eWxlKTsKICBmb250LXdlaWdodDogdmFyKC0tZGFwcC1raXQtZm9udFdlaWdodHMtbm9ybWFsKTsKICBsaW5lLWhlaWdodDogdmFyKC0tZGFwcC1raXQtdHlwb2dyYXBoeS1saW5lSGVpZ2h0KTsKICBsZXR0ZXItc3BhY2luZzogdmFyKC0tZGFwcC1raXQtdHlwb2dyYXBoeS1sZXR0ZXJTcGFjaW5nKTsKfQo6d2hlcmUoYnV0dG9uKSB7CiAgYXBwZWFyYW5jZTogbm9uZTsKICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsKICBmb250LXNpemU6IGluaGVyaXQ7CiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7CiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7CiAgbGV0dGVyLXNwYWNpbmc6IGluaGVyaXQ7CiAgY29sb3I6IGluaGVyaXQ7CiAgYm9yZGVyOiAwOwogIHBhZGRpbmc6IDA7CiAgbWFyZ2luOiAwOwp9Cjp3aGVyZShhKSB7CiAgdGV4dC1kZWNvcmF0aW9uOiBub25lOwogIGNvbG9yOiBpbmhlcml0OwogIG91dGxpbmU6IG5vbmU7Cn0KOndoZXJlKG9sLCB1bCkgewogIGxpc3Qtc3R5bGU6IG5vbmU7CiAgbWFyZ2luOiAwOwogIHBhZGRpbmc6IDA7Cn0KOndoZXJlKGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYpIHsKICBmb250LXNpemU6IGluaGVyaXQ7CiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7CiAgbWFyZ2luOiAwOwp9
var init_StyleMarker_css_ts_vanilla = __esm({
  "vanilla-extract-css-ns:src/components/styling/StyleMarker.css.ts.vanilla.css?source=OndoZXJlKCopIHsKICBib3gtc2l6aW5nOiBib3JkZXItYm94OwogIGNvbG9yOiB2YXIoLS1kYXBwLWtpdC1jb2xvcnMtYm9keSk7CiAgZm9udC1mYW1pbHk6IHZhcigtLWRhcHAta2l0LXR5cG9ncmFwaHktZm9udEZhbWlseSk7CiAgZm9udC1zaXplOiB2YXIoLS1kYXBwLWtpdC1mb250V2VpZ2h0cy1ub3JtYWwpOwogIGZvbnQtc3R5bGU6IHZhcigtLWRhcHAta2l0LXR5cG9ncmFwaHktZm9udFN0eWxlKTsKICBmb250LXdlaWdodDogdmFyKC0tZGFwcC1raXQtZm9udFdlaWdodHMtbm9ybWFsKTsKICBsaW5lLWhlaWdodDogdmFyKC0tZGFwcC1raXQtdHlwb2dyYXBoeS1saW5lSGVpZ2h0KTsKICBsZXR0ZXItc3BhY2luZzogdmFyKC0tZGFwcC1raXQtdHlwb2dyYXBoeS1sZXR0ZXJTcGFjaW5nKTsKfQo6d2hlcmUoYnV0dG9uKSB7CiAgYXBwZWFyYW5jZTogbm9uZTsKICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsKICBmb250LXNpemU6IGluaGVyaXQ7CiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7CiAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7CiAgbGV0dGVyLXNwYWNpbmc6IGluaGVyaXQ7CiAgY29sb3I6IGluaGVyaXQ7CiAgYm9yZGVyOiAwOwogIHBhZGRpbmc6IDA7CiAgbWFyZ2luOiAwOwp9Cjp3aGVyZShhKSB7CiAgdGV4dC1kZWNvcmF0aW9uOiBub25lOwogIGNvbG9yOiBpbmhlcml0OwogIG91dGxpbmU6IG5vbmU7Cn0KOndoZXJlKG9sLCB1bCkgewogIGxpc3Qtc3R5bGU6IG5vbmU7CiAgbWFyZ2luOiAwOwogIHBhZGRpbmc6IDA7Cn0KOndoZXJlKGgxLCBoMiwgaDMsIGg0LCBoNSwgaDYpIHsKICBmb250LXNpemU6IGluaGVyaXQ7CiAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7CiAgbWFyZ2luOiAwOwp9"() {
  }
});

// src/components/styling/StyleMarker.css.ts
var require_StyleMarker_css = __commonJS({
  "src/components/styling/StyleMarker.css.ts"() {
    "use strict";
    init_StyleMarker_css_ts_vanilla();
  }
});

// src/components/styling/StyleMarker.tsx
var StyleMarker_exports = {};
__export(StyleMarker_exports, {
  StyleMarker: () => StyleMarker
});
module.exports = __toCommonJS(StyleMarker_exports);
var import_react_slot = require("@radix-ui/react-slot");
var import_react = require("react");

// src/constants/styleDataAttribute.ts
var styleDataAttributeName = "data-dapp-kit";
var styleDataAttributeSelector = `[${styleDataAttributeName}]`;
var styleDataAttribute = { [styleDataAttributeName]: "" };

// src/components/styling/StyleMarker.tsx
var import_StyleMarker_css = __toESM(require_StyleMarker_css());
var import_jsx_runtime = require("react/jsx-runtime");
var StyleMarker = (0, import_react.forwardRef)(({ children, ...props }, forwardedRef) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_slot.Slot, { ref: forwardedRef, ...props, ...styleDataAttribute, children }));
StyleMarker.displayName = "StyleMarker";
//# sourceMappingURL=StyleMarker.js.map
