
/**
 * Utility functions for working with Supabase
 */

/**
 * Type assertion helper for Supabase RPC calls
 * Used to solve TypeScript errors with parameters
 */
export const asParams = <T extends Record<string, any>>(params: T): T => {
  return params;
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

/**
 * Helper for type assertions to resolve "string is not assignable to parameter of type never" errors
 * @param value Any value that needs type assertion
 * @returns The same value with proper type assertion
 */
export const assertType = <T>(value: any): T => {
  return value as T;
};
