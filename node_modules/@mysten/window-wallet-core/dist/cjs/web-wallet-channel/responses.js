"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var responses_exports = {};
__export(responses_exports, {
  Response: () => Response,
  ResponseData: () => ResponseData,
  ResponsePayload: () => ResponsePayload
});
module.exports = __toCommonJS(responses_exports);
var v = __toESM(require("valibot"));
const ResponseData = v.variant("type", [
  v.object({
    type: v.literal("connect"),
    session: v.string("`session` is required")
  }),
  v.object({
    type: v.literal("sign-transaction"),
    bytes: v.string(),
    signature: v.string()
  }),
  v.object({
    type: v.literal("sign-and-execute-transaction"),
    bytes: v.string(),
    signature: v.string(),
    digest: v.string(),
    effects: v.string()
  }),
  v.object({
    type: v.literal("sign-personal-message"),
    bytes: v.string(),
    signature: v.string()
  })
]);
const ResponsePayload = v.variant("type", [
  v.object({
    type: v.literal("reject"),
    reason: v.optional(v.string("`reason` must be a string"))
  }),
  v.object({
    type: v.literal("resolve"),
    data: ResponseData
  })
]);
const Response = v.object({
  id: v.pipe(v.string(), v.uuid()),
  source: v.literal("web-wallet-channel"),
  payload: ResponsePayload,
  version: v.literal("1")
});
//# sourceMappingURL=responses.js.map
