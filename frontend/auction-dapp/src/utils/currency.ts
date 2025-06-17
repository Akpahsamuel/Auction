// Currency conversion utilities for auction DApp

/**
 * Safely converts MIST (smallest SUI unit) to SUI
 * @param mistValue - The value in MIST units (can be string, number, or null/undefined)
 * @param fallback - Fallback value if conversion fails (default: 0)
 * @returns The value in SUI units
 */
export const safeMistToSui = (mistValue: any, fallback: number = 0): number => {
  if (mistValue === null || mistValue === undefined) {
    return fallback;
  }
  
  const mistNumber = typeof mistValue === 'string' ? parseInt(mistValue) : Number(mistValue);
  
  if (isNaN(mistNumber) || mistNumber < 0) {
    console.warn("Invalid MIST value:", mistValue, "using fallback:", fallback);
    return fallback;
  }
  
  return mistNumber / 1_000_000_000;
};

/**
 * Converts SUI to MIST (smallest SUI unit)
 * @param suiValue - The value in SUI units
 * @returns The value in MIST units
 */
export const suiToMist = (suiValue: number): number => {
  return Math.floor(suiValue * 1_000_000_000);
};

/**
 * Formats a SUI amount for display
 * @param suiAmount - The amount in SUI
 * @param decimals - Number of decimal places (default: 4)
 * @returns Formatted string
 */
export const formatSui = (suiAmount: number, decimals: number = 4): string => {
  return suiAmount.toFixed(decimals);
};

/**
 * Formats a MIST amount for display as SUI
 * @param mistAmount - The amount in MIST
 * @param decimals - Number of decimal places (default: 4)
 * @returns Formatted string in SUI
 */
export const formatMistAsSui = (mistAmount: any, decimals: number = 4): string => {
  const suiAmount = safeMistToSui(mistAmount, 0);
  return formatSui(suiAmount, decimals);
}; 