
import { supabase } from '@/lib/supabase';

/**
 * A helper function to ensure type safety when accessing tables
 * This avoids TS errors when the Database type is not up to date
 */
export const fromTable = (tableName: string) => {
  // Use type assertion and any to bypass TypeScript's type checking for table names
  // This is necessary when working with tables that might not be in the generated types
  return supabase.from(tableName as any);
};
