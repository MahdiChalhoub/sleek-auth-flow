
import { supabase } from '@/lib/supabase';

// Define allowed RPC function names to help with type safety
export type RPCFunctions = 
  | "check_table_exists"
  | "get_all_product_batches"
  | "get_product_batches"
  | "insert_product_batch"
  | "update_product_batch"
  | "delete_product_batch"
  | "can_delete_user"; // Include all your RPC functions here

/**
 * Call a Supabase RPC function with typed parameters and return type
 */
export async function callRPC<T>(functionName: RPCFunctions, params: Record<string, any> = {}): Promise<T> {
  try {
    const { data, error } = await supabase.rpc(functionName as string, params);
    
    if (error) throw error;
    
    return data as T;
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    throw error;
  }
}

/**
 * Helper to create RPC parameters
 */
export function rpcParams<T extends Record<string, any>>(params: T): T {
  return params;
}
