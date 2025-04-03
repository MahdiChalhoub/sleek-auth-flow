
import { supabase } from '@/lib/supabase';
import { ProductBatch, mapDbProductBatchToModel, mapModelProductBatchToDb } from '@/models/productBatch';
import { callRPC } from '@/utils/rpcUtils';
import { fromTable } from '@/utils/supabaseServiceHelper';

export const productBatchService = {
  getAllBatches: async (): Promise<ProductBatch[]> => {
    try {
      // Check if the table exists first
      const tableExists = await callRPC<boolean>(
        'check_table_exists',
        { table_name: 'product_batches' }
      );
      
      if (!tableExists) {
        console.log('product_batches table does not exist yet');
        return [];
      }
      
      const { data, error } = await fromTable('product_batches')
        .select('*');
        
      if (error) {
        console.error('Error fetching product batches:', error);
        return [];
      }
      
      // Fetch product names separately for better type safety
      const batches = (data || []).map(mapDbProductBatchToModel);
      
      // Get unique product IDs
      const productIds = [...new Set(batches.map(batch => batch.product_id))];
      
      // Create a map of product IDs to names
      const productNames: Record<string, string> = {};
      
      if (productIds.length > 0) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name')
          .in('id', productIds);
          
        if (!productsError && productsData) {
          productsData.forEach(product => {
            productNames[product.id] = product.name;
          });
        }
      }
      
      // Add product names to batches
      return batches.map(batch => ({
        ...batch,
        productName: productNames[batch.product_id] || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching all product batches:', error);
      return [];
    }
  },
  
  getProductBatches: async (productId: string): Promise<ProductBatch[]> => {
    try {
      const { data, error } = await fromTable('product_batches')
        .select('*')
        .eq('product_id', productId);
        
      if (error) {
        console.error(`Error fetching batches for product ${productId}:`, error);
        return [];
      }
      
      return (data || []).map(mapDbProductBatchToModel);
    } catch (error) {
      console.error(`Error fetching batches for product ${productId}:`, error);
      return [];
    }
  },
  
  addBatch: async (batch: Omit<ProductBatch, "id" | "created_at" | "updated_at">): Promise<ProductBatch | null> => {
    try {
      const { data, error } = await fromTable('product_batches')
        .insert(mapModelProductBatchToDb(batch))
        .select()
        .single();
        
      if (error) {
        console.error('Error adding product batch:', error);
        return null;
      }
      
      return mapDbProductBatchToModel(data);
    } catch (error) {
      console.error('Error adding product batch:', error);
      return null;
    }
  },
  
  updateBatch: async (batch: Partial<ProductBatch> & { id: string }): Promise<ProductBatch | null> => {
    try {
      const { data, error } = await fromTable('product_batches')
        .update({
          quantity: batch.quantity,
          expiry_date: batch.expiry_date,
          batch_number: batch.batch_number,
          updated_at: new Date().toISOString()
        })
        .eq('id', batch.id)
        .select()
        .single();
        
      if (error) {
        console.error(`Error updating batch ${batch.id}:`, error);
        return null;
      }
      
      return mapDbProductBatchToModel(data);
    } catch (error) {
      console.error(`Error updating batch ${batch.id}:`, error);
      return null;
    }
  },
  
  deleteBatch: async (batchId: string): Promise<boolean> => {
    try {
      const { error } = await fromTable('product_batches')
        .delete()
        .eq('id', batchId);
        
      if (error) {
        console.error(`Error deleting batch ${batchId}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting batch ${batchId}:`, error);
      return false;
    }
  }
};

// Re-export the helpers from productBatch.ts for convenience
export { mapDbProductBatchToModel, mapModelProductBatchToDb };
