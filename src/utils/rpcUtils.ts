
import { supabase } from '@/lib/supabase';

export type RpcFunction = 'can_delete_user' | 'get_product_batches' | 'get_all_product_batches' | 
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
    const { data, error } = await supabase.rpc(functionName as string, params);
    
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

/**
 * Specialized function to check if a user can be deleted
 */
export async function canDeleteUser(userId: string): Promise<boolean> {
  const { data, error } = await callRpc<boolean, { user_id: string }>(
    'can_delete_user',
    { user_id: userId }
  );
  
  if (error || data === null) {
    console.error('Error checking if user can be deleted:', error);
    return false;
  }
  
  return data as boolean;
}
