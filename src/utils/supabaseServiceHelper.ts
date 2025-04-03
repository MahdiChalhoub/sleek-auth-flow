
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Type for successful data response
export interface DataResponse<T> {
  data: T;
  error: null;
}

// Type for error response
export interface ErrorResponse {
  data: null;
  error: PostgrestError;
}

// Combined response type
export type QueryResponse<T> = DataResponse<T> | ErrorResponse;

// Helper function to check if response contains data
export function isDataResponse<T>(response: QueryResponse<T>): response is DataResponse<T> {
  return response.error === null && response.data !== null;
}

// Helper function to safely convert array data or return empty array on error
export function safeArray<T, R>(data: T[] | null, mapper: (item: T) => R): R[] {
  if (!data || !Array.isArray(data)) return [];
  return data.map(mapper);
}

// Safe transform utility for handling potentially null data
export function safeDataTransform<T, R>(
  data: T[] | null | undefined,
  transformer: (item: T) => R | null
): R[] {
  if (!data) return [];
  
  return data
    .map(item => (item ? transformer(item) : null))
    .filter((item): item is R => item !== null);
}

// Helper function to access Supabase tables with better typing
export function fromTable(tableName: string) {
  // Use any to bypass the type checking here, as we need to support dynamic table names
  return supabase.from(tableName as any);
}
