
/**
 * Utility types and functions for Supabase operations
 */

/**
 * Helper type to allow string parameters in Supabase RPC calls
 * This addresses the "string is not assignable to parameter of type 'never'" error
 */
export type RPCParam = any;

/**
 * Helper function to cast parameters for RPC calls
 * This works around the TypeScript error: "Argument of type 'string' is not assignable to parameter of type 'never'"
 */
export function rpcParams<T>(params: T): T {
  return params;
}
