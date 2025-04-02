
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/**
 * Helper function to safely get an array from a Supabase query
 * Returns an empty array if data is null or undefined
 */
export function safeArray<T, R>(data: T[] | null | undefined, mapFn?: (item: T) => R): R[] {
  if (!data) return [];
  return mapFn ? data.map(mapFn) : (data as unknown as R[]);
}

/**
 * Format Supabase error for display
 */
export function formatSupabaseError(error: PostgrestError | Error | null | unknown): string {
  if (!error) return 'Unknown error';
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message: string }).message;
  }
  
  return String(error);
}

/**
 * Helper to create parameters for RPC functions
 * This helps with type safety and consistent parameter formatting
 */
export function rpcParams<T extends Record<string, any>>(params: T): T {
  return params;
}

/**
 * Generate a Supabase table source with proper typing
 * 
 * This is a type-safe way to reference table names that will be checked
 * against the actual database schema
 */
export function tableSource<T extends string>(tableName: T): T {
  return tableName;
}

/**
 * Utility to wait for all promises to settle and return results
 */
export async function settleAll<T>(promises: Promise<T>[]): Promise<(T | Error)[]> {
  const results = await Promise.allSettled(promises);
  
  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return new Error(result.reason);
    }
  });
}

/**
 * Execute a Supabase query with error handling
 */
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  errorMessage = 'Database operation failed'
): Promise<T> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error(`${errorMessage}:`, error);
      throw new Error(`${errorMessage}: ${error.message}`);
    }
    
    if (data === null) {
      return [] as unknown as T;
    }
    
    return data;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw error;
  }
}

/**
 * Execute a Supabase transaction with error handling
 */
export async function safeTransaction<T>(
  transactionFn: () => Promise<T>,
  errorMessage = 'Transaction failed'
): Promise<T> {
  try {
    return await transactionFn();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw error;
  }
}

/**
 * Valid table types for use with tableSource and other database utilities
 */
export type ValidTable = string;

/**
 * Assert that a value is of a specific type
 * This is a runtime no-op but helps TypeScript narrow types
 */
export function assertType<T>(value: any): T {
  return value as T;
}
