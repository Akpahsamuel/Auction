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
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var dapp_post_message_channel_exports = {};
__export(dapp_post_message_channel_exports, {
  DappPostMessageChannel: () => DappPostMessageChannel
});
module.exports = __toCommonJS(dapp_post_message_channel_exports);
var import_valibot = require("valibot");
var import_responses = require("./responses.js");
var import_utils = require("@mysten/utils");
var import_utils2 = require("./utils.js");
var _popup, _version, _id, _hostOrigin, _hostPathname, _appName, _extraRequestOptions, _promise, _resolve, _reject, _interval, _isSendCalled, _listener, _DappPostMessageChannel_instances, cleanup_fn;
class DappPostMessageChannel {
  constructor({
    appName,
    hostOrigin,
    hostPathname = "dapp-request",
    extraRequestOptions
  }) {
    __privateAdd(this, _DappPostMessageChannel_instances);
    __privateAdd(this, _popup);
    __privateAdd(this, _version, "1");
    __privateAdd(this, _id);
    __privateAdd(this, _hostOrigin);
    __privateAdd(this, _hostPathname);
    __privateAdd(this, _appName);
    __privateAdd(this, _extraRequestOptions);
    __privateAdd(this, _promise);
    __privateAdd(this, _resolve);
    __privateAdd(this, _reject);
    __privateAdd(this, _interval, null);
    __privateAdd(this, _isSendCalled, false);
    __privateAdd(this, _listener, (event) => {
      if (event.origin !== __privateGet(this, _hostOrigin)) {
        return;
      }
      const { success, output } = (0, import_valibot.safeParse)(import_responses.Response, event.data);
      if (!success || output.id !== __privateGet(this, _id)) {
        return;
      }
      __privateMethod(this, _DappPostMessageChannel_instances, cleanup_fn).call(this);
      if (output.payload.type === "reject") {
        __privateGet(this, _reject).call(this, new Error("User rejected the request"));
      } else if (output.payload.type === "resolve") {
        __privateGet(this, _resolve).call(this, output.payload.data);
      }
    });
    const popup = window.open("about:blank", "_blank");
    if (!popup) {
      throw new Error("Failed to open new window");
    }
    __privateSet(this, _id, crypto.randomUUID());
    __privateSet(this, _popup, popup);
    __privateSet(this, _hostOrigin, hostOrigin);
    __privateSet(this, _hostPathname, hostPathname);
    __privateSet(this, _appName, appName);
    const { promise, resolve, reject } = (0, import_utils.promiseWithResolvers)();
    __privateSet(this, _promise, promise);
    __privateSet(this, _resolve, resolve);
    __privateSet(this, _reject, reject);
    __privateSet(this, _extraRequestOptions, extraRequestOptions);
    __privateSet(this, _interval, setInterval(() => {
      try {
        if (__privateGet(this, _popup).closed) {
          __privateMethod(this, _DappPostMessageChannel_instances, cleanup_fn).call(this);
          reject(new Error("User closed the wallet window"));
        }
      } catch {
      }
    }, 1e3));
  }
  send({
    type,
    ...data
  }) {
    if (__privateGet(this, _popup).closed) {
      throw new Error("User closed the wallet window");
    }
    if (__privateGet(this, _isSendCalled)) {
      throw new Error("send() can only be called once");
    }
    __privateSet(this, _isSendCalled, true);
    window.addEventListener("message", __privateGet(this, _listener));
    const requestData = {
      version: __privateGet(this, _version),
      requestId: __privateGet(this, _id),
      appUrl: window.location.href.split("#")[0],
      appName: __privateGet(this, _appName),
      payload: {
        type,
        ...data
      },
      metadata: (0, import_utils2.getClientMetadata)(),
      extraRequestOptions: __privateGet(this, _extraRequestOptions)
    };
    const encodedRequestData = encodeURIComponent(btoa(JSON.stringify(requestData)));
    __privateGet(this, _popup).location.assign(`${__privateGet(this, _hostOrigin)}/${__privateGet(this, _hostPathname)}#${encodedRequestData}`);
    return __privateGet(this, _promise);
  }
  close() {
    __privateMethod(this, _DappPostMessageChannel_instances, cleanup_fn).call(this);
    __privateGet(this, _popup).close();
  }
}
_popup = new WeakMap();
_version = new WeakMap();
_id = new WeakMap();
_hostOrigin = new WeakMap();
_hostPathname = new WeakMap();
_appName = new WeakMap();
_extraRequestOptions = new WeakMap();
_promise = new WeakMap();
_resolve = new WeakMap();
_reject = new WeakMap();
_interval = new WeakMap();
_isSendCalled = new WeakMap();
_listener = new WeakMap();
_DappPostMessageChannel_instances = new WeakSet();
cleanup_fn = function() {
  if (__privateGet(this, _interval)) {
    clearInterval(__privateGet(this, _interval));
    __privateSet(this, _interval, null);
  }
  window.removeEventListener("message", __privateGet(this, _listener));
};
//# sourceMappingURL=dapp-post-message-channel.js.map
