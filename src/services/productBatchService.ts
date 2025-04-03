
import { supabase } from '@/lib/supabase';
import { ProductBatch, mapDbProductBatchToModel, mapModelProductBatchToDb } from '@/models/productBatch';
import { callRPC } from '@/utils/rpcUtils';

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
      
      const { data, error } = await supabase
        .from('product_batches')
        .select('*, products(name)');
        
      if (error) {
        console.error('Error fetching product batches:', error);
        return [];
      }
      
      return (data || []).map(item => ({
        ...mapDbProductBatchToModel(item),
        productName: item.products?.name || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching all product batches:', error);
      return [];
    }
  },
  
  getProductBatches: async (productId: string): Promise<ProductBatch[]> => {
    try {
      const { data, error } = await supabase
        .from('product_batches')
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
      const { data, error } = await supabase
        .from('product_batches')
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
      const { data, error } = await supabase
        .from('product_batches')
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
      const { error } = await supabase
        .from('product_batches')
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
