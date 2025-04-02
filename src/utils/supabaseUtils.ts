
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Safely handle arrays from Supabase responses
 */
export const safeArray = <T>(data: T[] | null): T[] => {
  return data || [];
};

/**
 * Create parameters object for RPC calls
 */
export const rpcParams = <T>(params: T): T => {
  return params;
};

/**
 * Safely get a table source for reuse
 */
export const tableSource = (tableName: string) => {
  return tableName;
};

/**
 * Format Supabase error messages for better user experience
 */
export const formatSupabaseError = (error: PostgrestError | null): string => {
  if (!error) return 'Unknown error';
  
  // Check for common error codes and provide more user-friendly messages
  if (error.code === '23505') {
    return 'This record already exists. Please use a unique value.';
  }
  
  if (error.code === '23503') {
    return 'This operation failed because the record is used by other records.';
  }
  
  if (error.code === '42P01') {
    return 'Database table not found. Please contact support.';
  }
  
  return error.message || 'An error occurred with the database operation';
};

/**
 * Process multiple promises and collect success/error results
 */
export const settleAll = async <T>(promises: Promise<T>[]): Promise<{
  successes: T[];
  errors: any[];
}> => {
  const results = await Promise.allSettled(promises);
  
  const successes: T[] = [];
  const errors: any[] = [];
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      successes.push(result.value);
    } else {
      errors.push(result.reason);
    }
  });
  
  return { successes, errors };
};

/**
 * Safely execute a query with error handling
 */
export const safeQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      return { data: null, error: formatSupabaseError(error) };
    }
    
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Unknown error occurred' };
  }
};

/**
 * Execute a transaction safely
 */
export const safeTransaction = async <T>(
  transactionFn: () => Promise<T>
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const result = await transactionFn();
    return { data: result, error: null };
  } catch (err: any) {
    return { 
      data: null, 
      error: err.message || 'Transaction failed' 
    };
  }
};
