
import { supabase } from '@/integrations/supabase/client';

type RPCFunctions = 'can_delete_user'; // Add more function names here as needed

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
 * Check if a user can be deleted
 * @param userId The ID of the user to check
 * @returns True if the user can be deleted, false otherwise
 */
export async function canDeleteUser(userId: string): Promise<boolean> {
  return await callRPC<boolean>('can_delete_user', { user_id: userId });
}
