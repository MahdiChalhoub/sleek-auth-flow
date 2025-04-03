
/**
 * Safely converts an array or null to a mapped array
 * @param data The array to map or null
 * @param mapper The mapping function
 * @returns The mapped array or empty array if data is null
 */
export function safeArray<T, R>(data: T[] | null, mapper: (item: T) => R): R[] {
  if (!data || !Array.isArray(data)) return [];
  return data.map(mapper);
}

/**
 * Format supabase error for user-friendly display
 * @param error The PostgrestError to format
 * @returns Formatted error message
 */
export function formatSupabaseError(error: any): string {
  if (!error) return 'An unknown error occurred';
  if (typeof error === 'string') return error;
  
  return error.message || 'Database operation failed';
}

/**
 * Utility to execute multiple promises and wait for all to settle
 * @param promises An array of promises to execute
 * @returns Array of settled promise results
 */
export async function settleAll<T>(promises: Promise<T>[]): Promise<(T | null)[]> {
  const results = await Promise.allSettled(promises);
  return results.map(result => 
    result.status === 'fulfilled' ? result.value : null
  );
}

/**
 * Get Supabase table source with better typing
 * @param tableName The name of the table
 * @returns Supabase PostgrestQueryBuilder
 */
export function tableSource(tableName: string) {
  return {} as any; // This is a placeholder, as we're replacing it with fromTable
}

/**
 * Safely execute a Supabase query with error handling
 * @param queryFn The query function to execute
 * @returns The query result or null on error
 */
export async function safeQuery<T>(queryFn: () => Promise<{data: T | null, error: any}>): Promise<T | null> {
  try {
    const { data, error } = await queryFn();
    if (error) {
      console.error('Query error:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Exception in query:', error);
    return null;
  }
}

/**
 * Safely execute a Supabase transaction with error handling
 * @param transactionFn The transaction function to execute
 * @returns True if transaction succeeded, false otherwise
 */
export async function safeTransaction(transactionFn: () => Promise<{error: any}>): Promise<boolean> {
  try {
    const { error } = await transactionFn();
    if (error) {
      console.error('Transaction error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Exception in transaction:', error);
    return false;
  }
}
