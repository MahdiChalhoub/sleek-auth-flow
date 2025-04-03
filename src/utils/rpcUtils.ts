
import { supabase } from '@/lib/supabase';

// Valid RPC function names for type safety
export type RpcFunctionName = 
  | 'check_table_exists'
  | 'get_all_product_batches'
  | 'get_product_batches'
  | 'insert_product_batch'
  | 'update_product_batch'
  | 'delete_product_batch'
  | 'can_delete_user'
  | 'open_register'
  | 'close_register'
  | 'resolve_register_discrepancy';

// Helper function to format RPC parameters
export function rpcParams<T extends Record<string, any>>(params: T): T {
  return params;
}

// Generic RPC call function with type safety
export async function callRPC<T>(
  functionName: RpcFunctionName, 
  params: Record<string, any>
): Promise<T | null> {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Error calling RPC function ${functionName}:`, error);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Exception calling RPC function ${functionName}:`, error);
    return null;
  }
}
