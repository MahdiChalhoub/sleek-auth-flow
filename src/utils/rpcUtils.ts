
import { supabase } from '@/lib/supabase';

export async function callRPC<T>(
  functionName: string, 
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
