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
var jwt_session_exports = {};
__export(jwt_session_exports, {
  createJwtSession: () => createJwtSession,
  decodeJwtSession: () => decodeJwtSession,
  verifyJwtSession: () => verifyJwtSession
});
module.exports = __toCommonJS(jwt_session_exports);
var v = __toESM(require("valibot"));
var import_jose = require("jose");
const AccountSchema = v.object({
  address: v.string(),
  publicKey: v.string()
});
const JwtSessionSchema = v.object({
  exp: v.number(),
  // Expiration Time
  iat: v.number(),
  // Issued At
  iss: v.string(),
  // Issuer
  aud: v.string(),
  // Audience (the dapp origin)
  payload: v.object({
    accounts: v.array(AccountSchema)
  })
});
async function createJwtSession(payload, options) {
  const token = await new import_jose.SignJWT({ payload }).setProtectedHeader({ alg: "HS256" }).setExpirationTime(options.expirationTime).setIssuedAt().setIssuer(options.issuer).setAudience(options.audience).sign(options.secretKey);
  return token;
}
function decodeJwtSession(jwt) {
  const decodedJwt = (0, import_jose.decodeJwt)(jwt);
  return v.parse(JwtSessionSchema, decodedJwt);
}
async function verifyJwtSession(jwt, secretKey) {
  const verified = await (0, import_jose.jwtVerify)(jwt, secretKey, { algorithms: ["HS256"] });
  return v.parse(JwtSessionSchema, verified.payload);
}
//# sourceMappingURL=index.js.map
