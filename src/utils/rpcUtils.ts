
import { supabase } from '@/lib/supabase';

export interface RpcError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

/**
 * Call a Supabase PostgreSQL function with proper type checking
 */
export async function callRpc<T, P extends Record<string, any>>(
  functionName: string,
  params: P
): Promise<{ data: T | null; error: RpcError | null }> {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      return { data: null, error };
    }
    
    return { data: data as T, error: null };
  } catch (error) {
    console.error(`Error calling RPC function '${functionName}':`, error);
    return {
      data: null,
      error: {
        message: 'Unexpected error calling function',
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Check server logs for more details',
        code: 'UNEXPECTED_ERROR'
      }
    };
  }
}

// Specific function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const { data, error } = await callRpc<boolean, { table_name: string }>(
      'check_table_exists',
      { table_name: tableName }
    );
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

export const rpcParams = <T extends Record<string, any>>(params: T): T => {
  return params;
};
