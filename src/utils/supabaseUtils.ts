
/**
 * Utility functions for working with Supabase
 */
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type TableNames = keyof Database['public']['Tables'];

/**
 * Type assertion helper for Supabase RPC calls
 * Used to solve TypeScript errors with parameters
 * @param params The parameters object to pass
 * @returns The same object with proper type assertion
 */
export const asParams = <T>(params: T): T => {
  return params;
};

/**
 * Helper to safely handle potentially undefined array responses from Supabase
 * @param data Data returned from Supabase query
 * @param mapper Optional function to map each item
 * @returns Safe array that can be used with array methods
 */
export const safeArray = <T, R = T>(
  data: T[] | null | undefined,
  mapper?: (item: T) => R
): R[] => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return mapper ? data.map(mapper) : data as unknown as R[];
};

/**
 * Helper for type assertions to resolve "string is not assignable to parameter of type never" errors
 * @param value Any value that needs type assertion
 * @returns The same value with proper type assertion
 */
export const assertType = <T>(value: any): T => {
  return value as T;
};

/**
 * Type-safe params helper for RPC calls to fix "string is not assignable to parameter of type never" errors
 * @param params The parameters object to pass to the RPC function
 * @returns The same object with proper type assertion
 */
export const rpcParams = <T extends Record<string, any>>(params: T): Record<string, any> => {
  return params as Record<string, any>;
};

/**
 * Helper to handle Supabase errors consistently
 * @param error Error object from Supabase
 * @param defaultMessage Default message to display if error has no message
 * @returns Formatted error message
 */
export const formatSupabaseError = (error: PostgrestError | any, defaultMessage = "An error occurred"): string => {
  if (!error) return defaultMessage;
  
  // Handle different error formats from Supabase
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  if (error.details) return error.details;
  
  return defaultMessage;
};

/**
 * Type-safe helper for table names to fix "string is not assignable to parameter of type never" errors
 * @param tableName Name of the table
 * @returns The table name with proper type assertion for Supabase
 */
export const tableSource = (tableName: string): TableNames => {
  return tableName as TableNames;
};

/**
 * Check if a Supabase table exists
 * @param tableName Name of the table to check
 * @returns Promise that resolves to boolean indicating if table exists
 */
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data: tableExists, error } = await supabase
      .rpc('check_table_exists', rpcParams({
        table_name: tableName
      }));
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return !!tableExists;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

// Import the supabase client to make the checkTableExists function work
import { supabase } from '@/lib/supabase';
