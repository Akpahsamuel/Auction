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

// src/hooks/useResolveSuiNSNames.ts
function useResolveSuiNSName(address, options) {
  return useSuiClientQuery(
    "resolveNameServiceNames",
    {
      address,
      limit: 1
    },
    {
      ...options,
      refetchOnWindowFocus: false,
      retry: false,
      select: (data) => data.data.length > 0 ? data.data[0] : null,
      enabled: !!address && options?.enabled !== false
    }
  );
}
export {
  useResolveSuiNSName
};
//# sourceMappingURL=useResolveSuiNSNames.js.map
