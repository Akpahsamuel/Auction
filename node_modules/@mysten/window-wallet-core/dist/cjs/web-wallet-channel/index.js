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
var web_wallet_channel_exports = {};
__export(web_wallet_channel_exports, {
  DappPostMessageChannel: () => import_dapp_post_message_channel.DappPostMessageChannel,
  WalletPostMessageChannel: () => import_wallet_post_message_channel.WalletPostMessageChannel
});
module.exports = __toCommonJS(web_wallet_channel_exports);
var import_wallet_post_message_channel = require("./wallet-post-message-channel.js");
var import_dapp_post_message_channel = require("./dapp-post-message-channel.js");
//# sourceMappingURL=index.js.map
