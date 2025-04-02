
import { supabase } from '@/integrations/supabase/client';

type RPCFunctions = 'can_delete_user' | 'check_table_exists' | 'get_all_product_batches' | 
                    'get_product_batches' | 'insert_product_batch' | 'update_product_batch' | 
                    'delete_product_batch' | 'open_register' | 'close_register' | 
                    'resolve_register_discrepancy';

/**
 * Call a Supabase RPC function with proper typing
 * @param functionName The name of the RPC function to call
 * @param params The parameters to pass to the function
 * @returns The result of the RPC call
 */
export async function callRPC<T>(
  functionName: RPCFunctions, 
  params: Record<string, any> = {}
): Promise<T> {
  const { data, error } = await supabase.rpc(functionName, params);
  
  if (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    throw error;
  }
  
  return data as T;
}

/**
 * Alias for callRPC to support both naming conventions
 */
export const callRpc = callRPC;

/**
 * Check if a user can be deleted
 * @param userId The ID of the user to check
 * @returns True if the user can be deleted, false otherwise
 */
export async function canDeleteUser(userId: string): Promise<boolean> {
  return await callRPC<boolean>('can_delete_user', { user_id: userId });
}

/**
 * Helper function to format parameters for RPC calls
 * @param params The parameters to format
 * @returns The formatted parameters
 */
export function rpcParams<T>(params: T): T {
  return params;
}
