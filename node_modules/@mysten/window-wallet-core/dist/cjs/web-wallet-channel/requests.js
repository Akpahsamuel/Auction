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
var requests_exports = {};
__export(requests_exports, {
  Request: () => Request,
  RequestData: () => RequestData
});
module.exports = __toCommonJS(requests_exports);
var v = __toESM(require("valibot"));
const JsonSchema = v.lazy(
  () => v.union([
    v.string(),
    v.number(),
    v.boolean(),
    v.null(),
    v.record(v.string(), JsonSchema),
    v.array(JsonSchema)
  ])
);
const RequestData = v.variant("type", [
  v.object({
    type: v.literal("connect")
  }),
  v.object({
    type: v.literal("sign-transaction"),
    transaction: v.string("`transaction` is required"),
    address: v.string("`address` is required"),
    chain: v.string("`chain` is required"),
    session: v.string("`session` is required")
  }),
  v.object({
    type: v.literal("sign-and-execute-transaction"),
    transaction: v.string("`transaction` is required"),
    address: v.string("`address` is required"),
    chain: v.string("`chain` is required"),
    session: v.string("`session` is required")
  }),
  v.object({
    type: v.literal("sign-personal-message"),
    chain: v.string("`chain` is required"),
    message: v.string("`message` is required"),
    address: v.string("`address` is required"),
    session: v.string("`session` is required")
  })
]);
const Request = v.object({
  version: v.literal("1"),
  requestId: v.pipe(v.string("`requestId` is required"), v.uuid()),
  appUrl: v.pipe(v.string(), v.url("`appUrl` must be a valid URL")),
  appName: v.string("`appName` is required"),
  payload: RequestData,
  metadata: v.optional(v.record(v.string(), JsonSchema)),
  extraRequestOptions: v.optional(v.record(v.string(), JsonSchema))
});
//# sourceMappingURL=requests.js.map
