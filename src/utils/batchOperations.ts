
import { supabase } from '@/lib/supabase';
import { tableSource } from '@/utils/supabaseUtils';

/**
 * Utility for batch operations with Supabase
 * Efficiently handles larger datasets by breaking them into chunks
 */

interface BatchOptions {
  chunkSize?: number;
  onProgress?: (processed: number, total: number) => void;
}

/**
 * Perform batch inserts with chunking for better performance
 * @param table Supabase table name
 * @param rows Array of row data to insert
 * @param options Batch operation options
 * @returns Result of the operation
 */
export async function batchInsert<T extends Record<string, any>>(
  table: string, 
  rows: T[], 
  options: BatchOptions = {}
) {
  const { chunkSize = 100, onProgress } = options;
  const results: any[] = [];
  const errors: any[] = [];
  
  if (!rows.length) return { results: [], errors: [] };
  
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    
    try {
      const { data, error } = await supabase
        .from(tableSource(table))
        .insert(chunk)
        .select();
      
      if (error) {
        errors.push(error);
      } else if (data) {
        results.push(...data);
      }
      
      if (onProgress) {
        onProgress(Math.min(i + chunkSize, rows.length), rows.length);
      }
    } catch (err) {
      errors.push(err);
    }
  }
  
  return { results, errors };
}

/**
 * Perform batch updates with chunking for better performance
 * @param table Supabase table name
 * @param updates Array of updates with id and data
 * @param options Batch operation options
 * @returns Result of the operation
 */
export async function batchUpdate<T extends Record<string, any>>(
  table: string, 
  updates: { id: string; data: Partial<T> }[], 
  options: BatchOptions = {}
) {
  const { chunkSize = 100, onProgress } = options;
  const results: any[] = [];
  const errors: any[] = [];
  
  if (!updates.length) return { results: [], errors: [] };
  
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    
    for (const { id, data } of chunk) {
      try {
        const { data: result, error } = await supabase
          .from(tableSource(table))
          .update(data)
          .eq('id', id)
          .select();
        
        if (error) {
          errors.push({ id, error });
        } else if (result) {
          results.push(...result);
        }
      } catch (err) {
        errors.push({ id, error: err });
      }
    }
    
    if (onProgress) {
      onProgress(Math.min(i + chunkSize, updates.length), updates.length);
    }
  }
  
  return { results, errors };
}
