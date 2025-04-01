
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { Database } from '@/integrations/supabase/types';

// This function gets the correct table name based on the environment
export function tableSource(tableName: keyof Database['public']['Tables']) {
  // This handles the case where we're in a different environment or want to add a prefix/suffix
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
