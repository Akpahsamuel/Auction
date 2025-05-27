// src/hooks/wallet/useSlushWallet.ts
import { registerSlushWallet } from "@mysten/slush-wallet";
import { useLayoutEffect } from "react";
function useSlushWallet(config) {
  useLayoutEffect(() => {
    if (!config?.name) {
      return;
    }
    let cleanup;
    let isMounted = true;
    try {
      const result = registerSlushWallet(config.name, {
        origin: config.origin
      });
      if (isMounted && result) {
        cleanup = result.unregister;
      } else if (result) {
        result.unregister();
      }
    } catch (error) {
      console.error("Failed to register Slush wallet:", error);
    }
    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [config?.name, config?.origin]);
}
export {
  useSlushWallet
};
//# sourceMappingURL=useSlushWallet.js.map
