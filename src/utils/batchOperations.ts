
import { supabase } from '@/integrations/supabase/client';
import { tableSource, ValidTable, assertType } from './supabaseUtils';

/**
 * Batch delete multiple records from a table
 * @param table - The table name
 * @param ids - Array of IDs to delete
 * @returns Whether the operation was successful
 */
export async function batchDelete(
  table: ValidTable,
  ids: string[]
): Promise<boolean> {
  if (!ids.length) return true;

  try {
    const { error } = await supabase
      .from(tableSource(table))
      .delete()
      .in('id', ids);

    if (error) {
      console.error(`Error during batch delete from ${table}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Exception during batch delete from ${table}:`, error);
    return false;
  }
}

/**
 * Batch insert multiple records to a table
 * @param table - The table name
 * @param records - Array of records to insert
 * @returns Whether the operation was successful
 */
export async function batchInsert<T extends Record<string, any>>(
  table: ValidTable,
  records: T[]
): Promise<boolean> {
  if (!records.length) return true;

  try {
    const { error } = await supabase
      .from(tableSource(table))
      .insert(records);

    if (error) {
      console.error(`Error during batch insert to ${table}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Exception during batch insert to ${table}:`, error);
    return false;
  }
}

/**
 * Batch update multiple records in a table
 * @param table - The table name
 * @param records - Array of records with IDs to update
 * @returns Whether the operation was successful
 */
export async function batchUpdate<T extends { id: string }>(
  table: ValidTable,
  records: T[]
): Promise<boolean> {
  if (!records.length) return true;

  try {
    // Supabase doesn't have a batch update, so we'll use a transaction
    // For now, we'll simulate it with multiple updates
    for (const record of records) {
      const { id, ...updates } = record;
      const { error } = await supabase
        .from(tableSource(table))
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error(`Error updating record ${id} in ${table}:`, error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(`Exception during batch update to ${table}:`, error);
    return false;
  }
}

/**
 * Export table data to CSV
 * @param table - The table name
 * @returns CSV string
 */
export async function exportTableToCSV(
  table: ValidTable
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from(tableSource(table))
      .select('*');

    if (error) {
      console.error(`Error exporting ${table} to CSV:`, error);
      throw error;
    }

    if (!data || !data.length) {
      return 'No data to export';
    }

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csv = headers.join(',') + '\n';
    
    // Add rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = assertType<any>(row)[header];
        // Handle values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value === null || value === undefined ? '' : value;
      });
      csv += values.join(',') + '\n';
    });

    return csv;
  } catch (error) {
    console.error(`Exception exporting ${table} to CSV:`, error);
    throw error;
  }
}
