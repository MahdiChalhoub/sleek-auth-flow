
import { supabase } from '@/lib/supabase';

type RpcFunction = 'can_delete_user' | 'get_product_batches' | 'get_all_product_batches' | 
                   'insert_product_batch' | 'update_product_batch' | 'delete_product_batch' |
                   'check_table_exists' | 'open_register' | 'close_register' | 
                   'resolve_register_discrepancy';

/**
 * Helper function to call Supabase RPC functions with proper typing
 */
export async function callRpc<T, P extends Record<string, any>>(
  functionName: RpcFunction,
  params: P
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      return { data: null, error: new Error(error.message) };
    }
    
    return { data, error: null };
  } catch (err: any) {
    console.error(`Error calling RPC function ${functionName}:`, err);
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Helper function to format parameters for RPC calls
 */
export function rpcParams<T extends Record<string, any>>(params: T): T {
  return params;
}
