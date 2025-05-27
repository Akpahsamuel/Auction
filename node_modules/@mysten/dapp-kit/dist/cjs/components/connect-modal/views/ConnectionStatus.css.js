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

// src/components/connect-modal/views/ConnectionStatus.css.ts
var ConnectionStatus_css_exports = {};
__export(ConnectionStatus_css_exports, {
  connectionStatus: () => connectionStatus,
  container: () => container,
  retryButtonContainer: () => retryButtonContainer,
  title: () => title,
  walletIcon: () => walletIcon
});
module.exports = __toCommonJS(ConnectionStatus_css_exports);
var connectionStatus = "ConnectionStatus_connectionStatus__nckm2d3";
var container = "ConnectionStatus_container__nckm2d0";
var retryButtonContainer = "ConnectionStatus_retryButtonContainer__nckm2d4";
var title = "ConnectionStatus_title__nckm2d2";
var walletIcon = "ConnectionStatus_walletIcon__nckm2d1";
//# sourceMappingURL=ConnectionStatus.css.js.map
