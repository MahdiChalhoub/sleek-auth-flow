
import { supabase } from '@/lib/supabase';
import { ProductBatch, mapDbProductBatchToModel, mapModelProductBatchToDb } from '@/models/productBatch';
import { callRpc } from '@/utils/rpcUtils';
import { rpcParams } from '@/utils/supabaseUtils';

export const productBatchService = {
  getAllBatches: async (): Promise<ProductBatch[]> => {
    try {
      // Check if the table exists first
      const { data: tableExists, error: tableCheckError } = await callRpc<boolean, { table_name: string }>(
        'check_table_exists',
        rpcParams({ table_name: 'product_batches' })
      );
      
      if (tableCheckError) {
        console.error('Error checking if table exists:', tableCheckError);
        return [];
      }
      
      if (!tableExists) {
        console.log('product_batches table does not exist yet');
        return [];
      }
      
      const { data, error } = await callRpc<ProductBatch[], {}>(
        'get_all_product_batches', 
        rpcParams({})
      );
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching all product batches:', error);
      return [];
    }
  },
  
  getProductBatches: async (productId: string): Promise<ProductBatch[]> => {
    try {
      const { data, error } = await callRpc<ProductBatch[], { product_id: string }>(
        'get_product_batches',
        rpcParams({ product_id: productId })
      );
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching batches for product ${productId}:`, error);
      return [];
    }
  },
  
  addBatch: async (batch: Omit<ProductBatch, "id" | "created_at" | "updated_at">): Promise<ProductBatch | null> => {
    try {
      const batchData = {
        product_id: batch.product_id || batch.productId,
        batch_number: batch.batch_number || batch.batchNumber,
        quantity: batch.quantity,
        expiry_date: batch.expiry_date || batch.expiryDate
      };
      
      const { data, error } = await callRpc<ProductBatch, { batch: any }>(
        'insert_product_batch',
        rpcParams({
          batch: batchData
        })
      );
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error adding product batch:', error);
      return null;
    }
  },
  
  updateBatch: async (batch: Partial<ProductBatch> & { id: string }): Promise<ProductBatch | null> => {
    try {
      const { data, error } = await callRpc<ProductBatch, { 
        batch_id: string;
        new_quantity?: number; 
        new_expiry_date?: string; 
        new_batch_number?: string; 
      }>(
        'update_product_batch',
        rpcParams({
          batch_id: batch.id,
          new_quantity: batch.quantity,
          new_expiry_date: batch.expiry_date || batch.expiryDate,
          new_batch_number: batch.batch_number || batch.batchNumber
        })
      );
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Error updating batch ${batch.id}:`, error);
      return null;
    }
  },
  
  deleteBatch: async (batchId: string): Promise<boolean> => {
    try {
      const { error } = await callRpc<any, { batch_id: string }>(
        'delete_product_batch',
        rpcParams({ batch_id: batchId })
      );
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting batch ${batchId}:`, error);
      return false;
    }
  }
};

// Re-export the helpers from productBatch.ts for convenience
export { mapDbProductBatchToModel, mapModelProductBatchToDb };
