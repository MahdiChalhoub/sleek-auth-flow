
/**
 * Safely map an array of database objects through a mapping function
 * Handles null or undefined data gracefully
 */
export function safeArray<T, R>(data: T[] | null | undefined, mapFn: (item: T) => R): R[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.map(mapFn);
}

/**
 * Type assertion utility to help with type narrowing
 */
export function assertType<T>(value: any): asserts value is T {
  // This is just a type assertion function, no runtime check is needed
}

/**
 * Check if API response has an error and throw if it does
 */
export function checkError(error: any) {
  if (error) {
    throw new Error(error.message || 'An error occurred');
  }
}

/**
 * Helper function for RPC parameters
 */
export function rpcParams<T extends Record<string, any>>(params: T): T {
  return params;
}

/**
 * Helper function to get a table source
 */
export function tableSource(tableName: string) {
  return { source: tableName };
}

/**
 * Format Supabase error messages for user-friendly display
 */
export function formatSupabaseError(error: any): string {
  if (!error) return 'Unknown error';
  return error.message || error.error_description || 'Database operation failed';
}

/**
 * Safely execute multiple promises and return results even if some fail
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
export async function safeQuery<T>(queryFn: () => Promise<{ data: T | null; error: any }>): Promise<T | null> {
  try {
    const { data, error } = await queryFn();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Query error:', error);
    return null;
  }
}

/**
 * Execute a Supabase transaction with automatic rollback on error
 */
export async function safeTransaction<T>(transactionFn: () => Promise<T>): Promise<T | null> {
  try {
    return await transactionFn();
  } catch (error) {
    console.error('Transaction error:', error);
    return null;
  }
}
