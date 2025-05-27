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

// src/hooks/useSuiClientInfiniteQuery.ts
var useSuiClientInfiniteQuery_exports = {};
__export(useSuiClientInfiniteQuery_exports, {
  useSuiClientInfiniteQuery: () => useSuiClientInfiniteQuery
});
module.exports = __toCommonJS(useSuiClientInfiniteQuery_exports);
var import_react_query = require("@tanstack/react-query");

// src/hooks/useSuiClient.ts
var import_react2 = require("react");

// src/components/SuiClientProvider.tsx
var import_client = require("@mysten/sui/client");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var SuiClientContext = (0, import_react.createContext)(null);
var DEFAULT_NETWORKS = {
  localnet: { url: (0, import_client.getFullnodeUrl)("localnet") }
};

// src/hooks/useSuiClient.ts
function useSuiClientContext() {
  const suiClient = (0, import_react2.useContext)(SuiClientContext);
  if (!suiClient) {
    throw new Error(
      "Could not find SuiClientContext. Ensure that you have set up the SuiClientProvider"
    );
  }
  return suiClient;
}

// src/hooks/useSuiClientInfiniteQuery.ts
function useSuiClientInfiniteQuery(method, params, {
  queryKey = [],
  enabled = !!params,
  ...options
} = {}) {
  const suiContext = useSuiClientContext();
  return (0, import_react_query.useInfiniteQuery)({
    ...options,
    initialPageParam: null,
    queryKey: [suiContext.network, method, params, ...queryKey],
    enabled,
    queryFn: ({ pageParam }) => suiContext.client[method]({
      ...params ?? {},
      cursor: pageParam
    }),
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextCursor ?? null : null
  });
}
//# sourceMappingURL=useSuiClientInfiniteQuery.js.map
