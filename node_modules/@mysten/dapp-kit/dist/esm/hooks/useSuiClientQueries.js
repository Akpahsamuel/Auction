// src/hooks/useSuiClientQueries.ts
import { useQueries } from "@tanstack/react-query";

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

// src/hooks/useSuiClientQueries.ts
function useSuiClientQueries({
  queries,
  combine
}) {
  const suiContext = useSuiClientContext();
  return useQueries({
    combine,
    queries: queries.map((query) => {
      const { method, params, options: { queryKey = [], ...restOptions } = {} } = query;
      return {
        ...restOptions,
        queryKey: [suiContext.network, method, params, ...queryKey],
        queryFn: async () => {
          return await suiContext.client[method](params);
        }
      };
    })
  });
}
export {
  useSuiClientQueries
};
//# sourceMappingURL=useSuiClientQueries.js.map
