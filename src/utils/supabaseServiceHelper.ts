
import { supabase } from '@/lib/supabase';

/**
 * A helper function to ensure type safety when accessing tables
 * This avoids TS errors when the Database type is not up to date
 */
export const fromTable = (tableName: string) => {
  return supabase.from(tableName);
};
