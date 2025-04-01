
import { supabase } from '@/integrations/supabase/client';
import { StockTransfer } from '@/models/stockTransfer';
import { tableSource } from '@/utils/supabaseUtils';
import { mapDatabaseStatus, mapToDbStatus } from '../mappers/statusMappers';
import { assertType } from '@/utils/typeUtils';

type DbStockTransfer = {
  id: string;
  source_location_id: string;
  destination_location_id: string;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type DbStockTransferItem = {
  id: string;
  stock_transfer_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

// Stock Transfers API
export const stockTransfersApi = {
  getAll: async (): Promise<StockTransfer[]> => {
    const { data, error } = await supabase
      .from(tableSource('stock_transfers'))
      .select('*, stock_transfer_items(*)');
    
    if (error) {
      console.error('Error fetching stock transfers:', error);
      throw error;
    }
    
    return (data || []).map(item => {
      const transfer = assertType<DbStockTransfer & { stock_transfer_items?: DbStockTransferItem[] }>(item);
      
      return {
        id: transfer.id,
        date: transfer.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
        source: 'Location', // Default placeholder
        sourceLocationId: transfer.source_location_id,
        destination: 'Location', // Default placeholder
        destinationLocationId: transfer.destination_location_id,
        reason: transfer.notes || 'Stock Transfer',
        status: mapDatabaseStatus(transfer.status),
        notes: transfer.notes,
        createdBy: 'System', // Default value
        items: (transfer.stock_transfer_items || []).map(transferItem => ({
          productId: transferItem.product_id,
          productName: 'Product', // Default placeholder
          quantity: transferItem.quantity
        }))
      };
    });
  },
  
  getById: async (id: string): Promise<StockTransfer | null> => {
    const { data, error } = await supabase
      .from(tableSource('stock_transfers'))
      .select('*, stock_transfer_items(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching stock transfer ${id}:`, error);
      throw error;
    }
    
    const transfer = assertType<DbStockTransfer & { stock_transfer_items?: DbStockTransferItem[] }>(data);
    
    return {
      id: transfer.id,
      date: transfer.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: transfer.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: transfer.destination_location_id,
      reason: transfer.notes || 'Stock Transfer',
      status: mapDatabaseStatus(transfer.status),
      notes: transfer.notes,
      createdBy: 'System', // Default value
      items: (transfer.stock_transfer_items || []).map(transferItem => ({
        productId: transferItem.product_id,
        productName: 'Product', // Default placeholder
        quantity: transferItem.quantity
      }))
    };
  },
  
  create: async (transfer: Omit<StockTransfer, 'id'>): Promise<StockTransfer> => {
    const { data, error } = await supabase
      .from(tableSource('stock_transfers'))
      .insert([{
        source_location_id: transfer.sourceLocationId,
        destination_location_id: transfer.destinationLocationId,
        notes: transfer.notes,
        status: mapToDbStatus(transfer.status) // Map from our status to db status
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating stock transfer:', error);
      throw error;
    }
    
    const newTransfer = assertType<DbStockTransfer>(data);
    
    if (transfer.items && transfer.items.length > 0) {
      const items = transfer.items.map(item => ({
        stock_transfer_id: newTransfer.id,
        product_id: item.productId,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from(tableSource('stock_transfer_items'))
        .insert(items);
      
      if (itemsError) {
        console.error('Error adding stock transfer items:', itemsError);
        throw itemsError;
      }
    }
    
    return {
      id: newTransfer.id,
      date: newTransfer.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: newTransfer.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: newTransfer.destination_location_id,
      reason: newTransfer.notes || 'Stock Transfer',
      status: mapDatabaseStatus(newTransfer.status),
      notes: newTransfer.notes,
      createdBy: 'System', // Default value
      items: transfer.items || []
    };
  },
  
  update: async (id: string, updates: Partial<StockTransfer>): Promise<StockTransfer> => {
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = mapToDbStatus(updates.status);
    if (updates.notes) dbUpdates.notes = updates.notes;
    dbUpdates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from(tableSource('stock_transfers'))
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating stock transfer ${id}:`, error);
      throw error;
    }
    
    const updatedTransfer = assertType<DbStockTransfer>(data);
    
    return {
      id: updatedTransfer.id,
      date: updatedTransfer.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: updatedTransfer.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: updatedTransfer.destination_location_id,
      reason: updatedTransfer.notes || 'Stock Transfer',
      status: mapDatabaseStatus(updatedTransfer.status),
      notes: updatedTransfer.notes,
      createdBy: 'System', // Default value
      items: [] // Default empty array
    };
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(tableSource('stock_transfers'))
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting stock transfer ${id}:`, error);
      throw error;
    }
  }
};
