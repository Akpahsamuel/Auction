// src/hooks/useSuiClientInfiniteQuery.ts
import { useInfiniteQuery } from "@tanstack/react-query";

// src/hooks/useSuiClient.ts
import { useContext } from "react";

// src/components/SuiClientProvider.tsx
import { getFullnodeUrl, isSuiClient, SuiClient } from "@mysten/sui/client";
import { createContext, useMemo, useState } from "react";
import { jsx } from "react/jsx-runtime";
var SuiClientContext = createContext(null);
var DEFAULT_NETWORKS = {
  localnet: { url: getFullnodeUrl("localnet") }
};

// src/hooks/useSuiClient.ts
function useSuiClientContext() {
  const suiClient = useContext(SuiClientContext);
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
  return useInfiniteQuery({
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
export {
  useSuiClientInfiniteQuery
};
//# sourceMappingURL=useSuiClientInfiniteQuery.js.map
