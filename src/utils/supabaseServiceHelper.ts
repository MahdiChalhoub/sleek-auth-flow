
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * A helper function to ensure type safety when accessing tables
 * This avoids TS errors when the Database type is not up to date
 */
export const fromTable = (tableName: string) => {
  // Use type assertion and any to bypass TypeScript's type checking for table names
  // This is necessary when working with tables that might not be in the generated types
  return supabase.from(tableName as any);
};

/**
 * Type guard to check if a response contains a data object or is an error
 */
export function isDataResponse<T>(response: { data: T | null; error: PostgrestError | null }): response is { data: T; error: null } {
  return response.error === null && response.data !== null;
}

/**
 * Type guard to check if an object is a PostgrestError
 */
export function isPostgrestError(obj: any): obj is PostgrestError {
  return obj && typeof obj === 'object' && 'code' in obj && 'message' in obj;
}

/**
 * Safely transform data from Supabase, handling potential errors
 */
export function safeDataTransform<T, R>(data: T[] | null, transform: (item: any) => R): R[] {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => {
    // Check if item is an error or valid data
    if (isPostgrestError(item) || !item) {
      console.error("Error in data transformation:", item);
      return null;
    }
    
    try {
      return transform(item);
    } catch (error) {
      console.error("Error transforming item:", error, item);
      return null;
    }
  }).filter((item): item is R => item !== null);
}
