
/**
 * Utility functions for working with Supabase
 */

/**
 * Type assertion helper for Supabase RPC calls
 * Used to solve TypeScript errors with RPC parameters
 */
export const asParams = <T>(params: T): Record<string, any> => {
  return params as Record<string, any>;
};

/**
 * Helper to safely handle potentially undefined array responses from Supabase
 * @param data Data returned from Supabase query
 * @param mapper Function to map each item (optional)
 * @returns Safe array that can be used with array methods
 */
export const safeArray = <T, R = T>(
  data: T[] | null | undefined,
  mapper?: (item: T) => R
): R[] => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return mapper ? data.map(mapper) : data as unknown as R[];
};
