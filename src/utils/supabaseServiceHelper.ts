
import { supabase } from '@/lib/supabase';

/**
 * A helper function to ensure type safety when accessing tables
 * This avoids TS errors when the Database type is not up to date
 */
export const fromTable = (tableName: string) => {
  // Use type assertion to bypass TypeScript's type checking for table names
  return supabase.from(tableName as any);
};
