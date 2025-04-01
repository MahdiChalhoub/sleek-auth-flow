
/**
 * Type utility functions to help with type casting and narrowing
 */

// Import database type for TableName
import { Database } from '@/integrations/supabase/types';

// Export TableName type for use throughout the app
export type TableName = keyof Database['public']['Tables'];

/**
 * Safely cast a value to a specific type
 * Use with caution - only when you're sure the value is of the specified type
 */
export function assertType<T>(value: any): T {
  return value as T;
}

/**
 * Type guard to check if a value has a specific property
 */
export function hasProperty<K extends string>(obj: any, prop: K): obj is { [P in K]: any } {
  return obj && typeof obj === 'object' && prop in obj;
}

/**
 * Safely access a property that might not exist on an object
 * Returns undefined if the property doesn't exist
 */
export function safeGet<T, K extends keyof T>(obj: T | undefined | null, key: K): T[K] | undefined {
  if (!obj) return undefined;
  return obj[key];
}

/**
 * Type guard to check if an object has all the required properties
 */
export function hasRequiredProperties<T>(obj: any, props: (keyof T)[]): obj is T {
  if (!obj || typeof obj !== 'object') return false;
  return props.every(prop => prop in obj);
}
