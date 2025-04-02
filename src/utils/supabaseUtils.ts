import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { Database } from '@/integrations/supabase/types';
import { PostgrestError } from '@supabase/supabase-js';

// Type helper to properly define database tables
export type TableName = keyof Database['public']['Tables'];

// This function gets the correct table name based on the environment
export function tableSource(tableName: string) {
  // For now, all tables are in the public schema
  return tableName;
}

/**
 * A safe way to handle arrays returned from Supabase
 * This ensures we always return an array, even if the data is null or undefined
 */
export function safeArray<T, U>(data: T[] | null | undefined, mapFunction?: (item: T) => U): U[] {
  if (!data) return [];
  if (!mapFunction) return data as unknown as U[];
  return data.map(mapFunction);
}

/**
 * Asserts that a value is an array of the given type
 */
export function assertArray<T>(value: any): T[] {
  if (!Array.isArray(value)) return [];
  return value as T[];
}

/**
 * Type-safe RPC parameters for PostgreSQL functions
 * This solves a common issue with TypeScript and Supabase RPC calls
 * 
 * Use it like this:
 * ```
 * const { data, error } = await supabase.rpc(
 *   'my_function',
 *   rpcParams({ param1: 'value1', param2: 'value2' })
 * );
 * ```
 */
export function rpcParams<T extends Record<string, any>>(params: T): T {
  return params;
}

/**
 * Format Supabase error messages in a user-friendly way
 */
export function formatSupabaseError(error: any): string {
  if (!error) return "Unknown error";
  
  if (error.message) {
    return error.message;
  }
  
  if (error.code) {
    switch (error.code) {
      case "23505":
        return "A record with this information already exists";
      case "23503":
        return "This operation would violate referential integrity";
      case "23514":
        return "Check constraint violated";
      case "42P01":
        return "Table does not exist";
      case "42703":
        return "Column does not exist";
      default:
        return `Database error: ${error.code}`;
    }
  }
  
  return "An unexpected database error occurred";
}

/**
 * Similar to Promise.all but doesn't fail if one promise fails
 * Returns a tuple of [results, errors]
 */
export async function settleAll<T>(promises: Promise<T>[]): Promise<[T[], Error[]]> {
  const results: T[] = [];
  const errors: Error[] = [];

  const settlements = await Promise.allSettled(promises);
  
  settlements.forEach(settlement => {
    if (settlement.status === 'fulfilled') {
      results.push(settlement.value);
    } else {
      errors.push(settlement.reason);
    }
  });

  return [results, errors];
}

/**
 * Safely cast a value to a specific type
 */
export function assertType<T>(value: any): T {
  return value as T;
}

/**
 * Helper function to safely execute a Supabase query with proper error handling
 */
export async function safeQuery<T, U = T>(
  query: Promise<{ data: T | null; error: any }>,
  errorMessage: string,
  mapFn?: (data: T) => U
): Promise<U | null> {
  try {
    const { data, error } = await query;
    
    if (error) {
      console.error(`${errorMessage}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    return mapFn ? mapFn(data) : (data as unknown as U);
  } catch (err) {
    console.error(`${errorMessage}:`, err);
    return null;
  }
}

/**
 * Safely execute a database transaction with multiple write operations
 */
export async function safeTransaction<T>(
  operations: () => Promise<T>,
  errorMessage: string
): Promise<T | null> {
  try {
    const result = await operations();
    return result;
  } catch (err) {
    console.error(`${errorMessage}:`, err);
    return null;
  }
}
