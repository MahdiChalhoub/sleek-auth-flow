
/**
 * Utility types and functions for Supabase operations
 */

/**
 * Helper type to allow string parameters in Supabase RPC calls
 * This addresses the "string is not assignable to parameter of type 'never'" error
 */
export type RPCParam = string | number | boolean | object | null;

/**
 * Helper function to cast parameters for RPC calls
 * This works around the TypeScript error: "Argument of type 'string' is not assignable to parameter of type 'never'"
 */
export function rpcParams<T>(params: T): any {
  return params as any;
}

/**
 * Helper function to safely cast between related types
 * Use this when TypeScript complains about types not being compatible
 * even though they have similar structure
 */
export function typeCast<T>(value: any): T {
  return value as T;
}
