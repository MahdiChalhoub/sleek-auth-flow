
import { supabase } from '@/integrations/supabase/client';
import { StockTransfer } from '@/models/stockTransfer';
import { tableSource } from '@/utils/supabaseUtils';
import { mapDatabaseStatus, mapToDbStatus } from '../mappers/statusMappers';

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
    
    return (data || []).map(item => ({
      id: item.id,
      date: item.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: item.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: item.destination_location_id,
      reason: item.notes || 'Stock Transfer',
      status: mapDatabaseStatus(item.status),
      notes: item.notes,
      createdBy: 'System', // Default value
      items: (item.stock_transfer_items || []).map(transferItem => ({
        productId: transferItem.product_id,
        productName: 'Product', // Default placeholder
        quantity: transferItem.quantity
      }))
    }));
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
    
    return {
      id: data.id,
      date: data.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: data.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: data.destination_location_id,
      reason: data.notes || 'Stock Transfer',
      status: mapDatabaseStatus(data.status),
      notes: data.notes,
      createdBy: 'System', // Default value
      items: (data.stock_transfer_items || []).map(transferItem => ({
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
    
    if (transfer.items && transfer.items.length > 0) {
      const items = transfer.items.map(item => ({
        stock_transfer_id: data.id,
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
      id: data.id,
      date: data.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: data.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: data.destination_location_id,
      reason: data.notes || 'Stock Transfer',
      status: mapDatabaseStatus(data.status),
      notes: data.notes,
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
    
    return {
      id: data.id,
      date: data.created_at.split('T')[0], // Convert ISO date to YYYY-MM-DD
      source: 'Location', // Default placeholder
      sourceLocationId: data.source_location_id,
      destination: 'Location', // Default placeholder
      destinationLocationId: data.destination_location_id,
      reason: data.notes || 'Stock Transfer',
      status: mapDatabaseStatus(data.status),
      notes: data.notes,
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
