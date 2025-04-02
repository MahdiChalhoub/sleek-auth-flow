
import { supabase } from '@/lib/supabase';

/**
 * Helper type for RPC params to ensure type safety
 */
type RpcParams<T extends Record<string, any>> = T;

/**
 * Call an RPC function with the given parameters
 * Modified to accept any function name as string
 * @param functionName The name of the RPC function to call
 * @param params The parameters to pass to the function
 * @returns The result of the RPC call
 */
export async function callRpc<T, P extends Record<string, any>>(
  functionName: string, 
  params: RpcParams<P>
): Promise<T> {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Error calling RPC function ${functionName}:`, error);
      throw error;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Failed to call RPC function ${functionName}:`, error);
    throw error;
  }
}

/**
 * Helper to prepare RPC parameters with proper typing
 */
export function rpcParams<T extends Record<string, any>>(params: T): T {
  return params;
}
