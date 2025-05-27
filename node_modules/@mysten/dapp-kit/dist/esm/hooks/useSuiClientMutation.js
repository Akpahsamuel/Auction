// src/hooks/useSuiClientMutation.ts
import { useMutation } from "@tanstack/react-query";

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

// src/hooks/useSuiClientMutation.ts
function useSuiClientMutation(method, options = {}) {
  const suiContext = useSuiClientContext();
  return useMutation({
    ...options,
    mutationFn: async (params) => {
      return await suiContext.client[method](params);
    }
  });
}
export {
  useSuiClientMutation
};
//# sourceMappingURL=useSuiClientMutation.js.map
