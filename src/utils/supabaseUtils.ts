
/**
 * Utility functions for working with Supabase
 */

/**
 * Safely convert array data with a mapper function
 * @param data The data to map
 * @param mapper The mapping function
 * @returns Mapped array or empty array if data is not valid
 */
export function safeArray<T, R>(data: T[] | null | undefined, mapper: (item: T) => R): R[] {
  if (!data || !Array.isArray(data)) return [];
  return data.map(mapper);
}

/**
 * Helper to prepare RPC parameters with proper typing
 */
export function rpcParams<T extends Record<string, any>>(params: T): T {
  return params;
}

/**
 * Get a table source for use with extensions
 */
export function tableSource(tableName: string) {
  return `public.${tableName}`;
}

/**
 * Format Supabase error messages for user display
 */
export function formatSupabaseError(error: any): string {
  if (!error) return 'Unknown error';
  
  // Check if it's a Supabase error with a message
  if (error.message) {
    // Handle some common error messages more user-friendly
    if (error.message.includes('duplicate key')) {
      return 'This record already exists.';
    }
    if (error.message.includes('violates foreign key constraint')) {
      return 'This operation references a record that does not exist.';
    }
    if (error.message.includes('violates check constraint')) {
      return 'The data does not meet validation requirements.';
    }
    
    return error.message;
  }
  
  // Fallback to stringifying the error
  return JSON.stringify(error);
}

/**
 * Execute multiple async operations and return when all are settled
 */
export async function settleAll<T>(promises: Promise<T>[]): Promise<(T | null)[]> {
  const results = await Promise.allSettled(promises);
  return results.map(result => 
    result.status === 'fulfilled' ? result.value : null
  );
}

/**
 * Safely execute a Supabase query with standardized error handling
 */
export async function safeQuery<T>(queryFn: () => Promise<{ data: T | null; error: any }>): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      return { data: null, error: formatSupabaseError(error) };
    }
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error: formatSupabaseError(error) };
  }
}

/**
 * Execute a transaction with multiple queries
 */
export async function safeTransaction<T>(
  transactionFn: () => Promise<T>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await transactionFn();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: formatSupabaseError(error) };
  }
}
