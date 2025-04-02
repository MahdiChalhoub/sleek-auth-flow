
import { supabase } from '@/lib/supabase';

/**
 * A type-safe helper function for accessing Supabase tables
 * This works around TypeScript limitations with dynamic table names
 */
export function fromTable(tableName: string) {
  // Use type assertion to tell TypeScript this is valid
  return supabase.from(tableName as any);
}

/**
 * A set of valid table names in the database
 * This can be used for type checking but we use string parameters
 * for flexibility in the actual implementation
 */
export const TableNames = {
  CATEGORIES: 'categories',
  CLIENTS: 'clients',
  PRODUCTS: 'products',
  SALES: 'sales',
  SUPPLIERS: 'suppliers',
  STOCK_TRANSFERS: 'stock_transfers',
  STOCK_TRANSFER_ITEMS: 'stock_transfer_items',
  TRANSACTIONS: 'transactions',
  JOURNAL_ENTRIES: 'journal_entries',
} as const;

export type TableName = typeof TableNames[keyof typeof TableNames];
