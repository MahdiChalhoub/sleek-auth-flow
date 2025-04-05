
import { supabase } from '@/lib/supabase';

// Define available RPC function names
export type RpcFunctionName = 
  | 'check_table_exists' 
  | 'get_all_product_batches' 
  | 'can_delete_user'
  | 'get_product_batches'
  | 'insert_product_batch'
  | 'update_product_batch'
  | 'delete_product_batch'
  | 'open_register'
  | 'close_register'
  | 'resolve_register_discrepancy';

/**
 * Utility function to call Supabase RPC functions with parameters and proper typing
 * @param fn The RPC function name to call
 * @param params Parameters to pass to the RPC function
 * @returns Promise with the result of the RPC call
 */
export async function callRpcFunction<T = any, P = any>(
  fn: RpcFunctionName,
  params?: P
): Promise<T> {
  try {
    const { data, error } = await supabase.rpc(fn as any, params);

    if (error) {
      console.error(`Error calling RPC function ${fn}:`, error);
      throw error;
    }

    return data as T;
  } catch (err) {
    console.error(`Failed to call RPC function ${fn}:`, err);
    throw err;
  }
}

// Add an alias for backward compatibility
export const callRPC = callRpcFunction;
