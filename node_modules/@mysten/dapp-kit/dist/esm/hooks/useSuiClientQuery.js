// src/hooks/useSuiClientQuery.ts
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo as useMemo2 } from "react";

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

// src/hooks/useSuiClientQuery.ts
function getSuiClientQuery({
  client,
  network,
  method,
  params,
  options
}) {
  return queryOptions({
    ...options,
    queryKey: [network, method, params],
    queryFn: async () => {
      return await client[method](params);
    }
  });
}
function useSuiClientQuery(...args) {
  const [method, params, { queryKey = [], ...options } = {}] = args;
  const suiContext = useSuiClientContext();
  return useQuery({
    ...options,
    queryKey: [suiContext.network, method, params, ...queryKey],
    queryFn: async () => {
      return await suiContext.client[method](params);
    }
  });
}
function useSuiClientSuspenseQuery(...args) {
  const [method, params, options = {}] = args;
  const suiContext = useSuiClientContext();
  const query = useMemo2(() => {
    return getSuiClientQuery({
      client: suiContext.client,
      network: suiContext.network,
      method,
      params,
      options
    });
  }, [suiContext.client, suiContext.network, method, params, options]);
  return useSuspenseQuery(query);
}
export {
  getSuiClientQuery,
  useSuiClientQuery,
  useSuiClientSuspenseQuery
};
//# sourceMappingURL=useSuiClientQuery.js.map
