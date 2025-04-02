
import { toast } from 'sonner';

/**
 * Safely maps an array of objects using a mapping function
 * Returns an empty array if the input is not an array or if any mapping fails
 */
export function safeArray<T, U>(array: U[] | null | undefined, mapFn: (item: U) => T): T[] {
  if (!array || !Array.isArray(array)) {
    return [];
  }
  
  try {
    return array.map(mapFn);
  } catch (error) {
    console.error('Error mapping array:', error);
    return [];
  }
}

/**
 * Formats parameters for RPC calls
 */
export function rpcParams<T extends Record<string, any>>(params: T): T {
  return params;
}

/**
 * Helper to create a table data source with proper error handling
 */
export function tableSource<T>(tableName: string): { 
  fetch: () => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
} {
  return {
    fetch: async () => {
      try {
        // Implementation would use supabase to fetch data
        return [];
      } catch (error) {
        console.error(`Error fetching from ${tableName}:`, error);
        toast.error(`Failed to load ${tableName}`);
        return [];
      }
    },
    getById: async (id: string) => {
      try {
        // Implementation would use supabase to fetch by id
        return null;
      } catch (error) {
        console.error(`Error fetching ${tableName} by ID:`, error);
        toast.error(`Failed to load ${tableName} details`);
        return null;
      }
    }
  };
}

/**
 * Formats a Supabase error message for display
 */
export function formatSupabaseError(error: any): string {
  if (!error) return 'Unknown error';
  
  if (typeof error === 'string') return error;
  
  if (error.message) return error.message;
  
  if (error.error_description) return error.error_description;
  
  return 'An unexpected error occurred';
}

/**
 * Settles all promises and returns results
 */
export async function settleAll<T>(promises: Promise<T>[]): Promise<(T | Error)[]> {
  const results = await Promise.allSettled(promises);
  
  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return result.reason instanceof Error ? result.reason : new Error(String(result.reason));
    }
  });
}

/**
 * Safely executes a Supabase query with error handling
 */
export async function safeQuery<T>(queryFn: () => Promise<T>, errorMessage: string): Promise<T | null> {
  try {
    return await queryFn();
  } catch (error) {
    console.error(errorMessage, error);
    toast.error(errorMessage);
    return null;
  }
}

/**
 * Safely executes a Supabase transaction with error handling
 */
export async function safeTransaction<T>(
  transactionFn: () => Promise<T>,
  successMessage: string,
  errorMessage: string
): Promise<T | null> {
  try {
    const result = await transactionFn();
    toast.success(successMessage);
    return result;
  } catch (error) {
    console.error(errorMessage, error);
    toast.error(errorMessage);
    return null;
  }
}
