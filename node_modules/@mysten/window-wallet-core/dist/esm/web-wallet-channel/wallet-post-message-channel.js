var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _request, _isSendCalled;
import { parse } from "valibot";
import { Request } from "./requests.js";
import { verifyJwtSession } from "../jwt-session/index.js";
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
    const request = parse(Request, payload);
    return new _WalletPostMessageChannel(request);
  }
  static fromUrlHash(hash = window.location.hash.slice(1)) {
    const decoded = atob(decodeURIComponent(hash));
    const request = parse(Request, JSON.parse(decoded));
    return new _WalletPostMessageChannel(request);
  }
  getRequestData() {
    return __privateGet(this, _request);
  }
  async verifyJwtSession(secretKey) {
    if (!("session" in __privateGet(this, _request).payload)) {
      return null;
    }
    const session = await verifyJwtSession(__privateGet(this, _request).payload.session, secretKey);
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
export {
  WalletPostMessageChannel
};
//# sourceMappingURL=wallet-post-message-channel.js.map
