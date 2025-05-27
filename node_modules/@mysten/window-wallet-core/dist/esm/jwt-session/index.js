import * as v from "valibot";
import { SignJWT, decodeJwt, jwtVerify } from "jose";
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
  const token = await new SignJWT({ payload }).setProtectedHeader({ alg: "HS256" }).setExpirationTime(options.expirationTime).setIssuedAt().setIssuer(options.issuer).setAudience(options.audience).sign(options.secretKey);
  return token;
}
function decodeJwtSession(jwt) {
  const decodedJwt = decodeJwt(jwt);
  return v.parse(JwtSessionSchema, decodedJwt);
}
async function verifyJwtSession(jwt, secretKey) {
  const verified = await jwtVerify(jwt, secretKey, { algorithms: ["HS256"] });
  return v.parse(JwtSessionSchema, verified.payload);
}
export {
  createJwtSession,
  decodeJwtSession,
  verifyJwtSession
};
//# sourceMappingURL=index.js.map
