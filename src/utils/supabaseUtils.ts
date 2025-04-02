
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
