
import { supabase } from '@/lib/supabase';

/**
 * Helper type for RPC params to ensure type safety
 */
type RpcParams<T extends Record<string, any>> = T;

/**
 * Type-safe generic RPC function call
 * @param functionName The name of the RPC function to call
 * @param params The parameters to pass to the function
 * @returns The result of the RPC call with proper typing
 */
export async function callRpc<T, P extends Record<string, any>>(
  functionName: string, 
  params: RpcParams<P>
): Promise<{ data: T | null; error: any | null }> {
  try {
    // @ts-ignore - We're using a string for the function name, which TypeScript doesn't like
    // but this is necessary for dynamic RPC calls
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Error calling RPC function ${functionName}:`, error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Failed to call RPC function ${functionName}:`, error);
    return { data: null, error };
  }
}

/**
 * Helper to prepare RPC parameters with proper typing
 */
export function rpcParams<T extends Record<string, any>>(params: T): T {
  return params;
}
