"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var wallet_post_message_channel_exports = {};
__export(wallet_post_message_channel_exports, {
  WalletPostMessageChannel: () => WalletPostMessageChannel
});
module.exports = __toCommonJS(wallet_post_message_channel_exports);
var import_valibot = require("valibot");
var import_requests = require("./requests.js");
var import_jwt_session = require("../jwt-session/index.js");
var _request, _isSendCalled;
const _WalletPostMessageChannel = class _WalletPostMessageChannel {
  constructor(request) {
    __privateAdd(this, _request);
    __privateAdd(this, _isSendCalled, false);
    if (typeof window === "undefined" || !window.opener) {
      throw new Error(
        "This functionality requires a window opened through `window.open`. `window.opener` is not available."
      );
    }
    __privateSet(this, _request, request);
  }
  static fromPayload(payload) {
    const request = (0, import_valibot.parse)(import_requests.Request, payload);
    return new _WalletPostMessageChannel(request);
  }
  static fromUrlHash(hash = window.location.hash.slice(1)) {
    const decoded = atob(decodeURIComponent(hash));
    const request = (0, import_valibot.parse)(import_requests.Request, JSON.parse(decoded));
    return new _WalletPostMessageChannel(request);
  }
  getRequestData() {
    return __privateGet(this, _request);
  }
  async verifyJwtSession(secretKey) {
    if (!("session" in __privateGet(this, _request).payload)) {
      return null;
    }
    const session = await (0, import_jwt_session.verifyJwtSession)(__privateGet(this, _request).payload.session, secretKey);
    if (session.aud !== new URL(__privateGet(this, _request).appUrl).origin) {
      throw new Error("App and session origin mismatch");
    }
    const requestAddress = __privateGet(this, _request).payload.address;
    const addressInSession = session.payload.accounts.find(
      (account) => account.address === requestAddress
    );
    if (!addressInSession) {
      throw new Error("Requested account not found in session");
    }
    return session;
  }
  sendMessage(payload) {
    if (__privateGet(this, _isSendCalled)) {
      throw new Error("sendMessage() can only be called once");
    }
    __privateSet(this, _isSendCalled, true);
    window.opener.postMessage(
      {
        id: __privateGet(this, _request).requestId,
        source: "web-wallet-channel",
        payload,
        version: __privateGet(this, _request).version
      },
      __privateGet(this, _request).appUrl
    );
  }
  close(payload) {
    if (payload) {
      this.sendMessage(payload);
    }
    window.close();
  }
};
_request = new WeakMap();
_isSendCalled = new WeakMap();
let WalletPostMessageChannel = _WalletPostMessageChannel;
//# sourceMappingURL=wallet-post-message-channel.js.map
