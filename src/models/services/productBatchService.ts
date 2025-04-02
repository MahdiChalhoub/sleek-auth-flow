
import { supabase } from '@/lib/supabase';
import { ProductBatch, mapDbProductBatchToModel, mapModelProductBatchToDb } from '@/models/productBatch';
import { callRPC } from '@/utils/rpcUtils';
import { rpcParams } from '@/utils/rpcUtils';

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
      
      const batches = await callRPC<ProductBatch[]>(
        'get_all_product_batches', 
        {}
      );
      
      return batches || [];
    } catch (error) {
      console.error('Error fetching all product batches:', error);
      return [];
    }
  },
  
  getProductBatches: async (productId: string): Promise<ProductBatch[]> => {
    try {
      const batches = await callRPC<ProductBatch[]>(
        'get_product_batches',
        { product_id: productId }
      );
      
      return batches || [];
    } catch (error) {
      console.error(`Error fetching batches for product ${productId}:`, error);
      return [];
    }
  },
  
  addBatch: async (batch: Omit<ProductBatch, "id" | "created_at" | "updated_at">): Promise<ProductBatch | null> => {
    try {
      const batchData = {
        product_id: batch.product_id,
        batch_number: batch.batch_number,
        quantity: batch.quantity,
        expiry_date: batch.expiry_date,
        status: batch.status
      };
      
      const newBatch = await callRPC<ProductBatch>(
        'insert_product_batch',
        {
          batch: batchData
        }
      );
      
      return newBatch;
    } catch (error) {
      console.error('Error adding product batch:', error);
      return null;
    }
  },
  
  updateBatch: async (batch: Partial<ProductBatch> & { id: string }): Promise<ProductBatch | null> => {
    try {
      const updatedBatch = await callRPC<ProductBatch>(
        'update_product_batch',
        {
          batch_id: batch.id,
          new_quantity: batch.quantity,
          new_expiry_date: batch.expiry_date,
          new_batch_number: batch.batch_number
        }
      );
      
      return updatedBatch;
    } catch (error) {
      console.error(`Error updating batch ${batch.id}:`, error);
      return null;
    }
  },
  
  deleteBatch: async (batchId: string): Promise<boolean> => {
    try {
      await callRPC<any>(
        'delete_product_batch',
        { batch_id: batchId }
      );
      
      return true;
    } catch (error) {
      console.error(`Error deleting batch ${batchId}:`, error);
      return false;
    }
  }
};

// Re-export the helpers from productBatch.ts for convenience
export { mapDbProductBatchToModel, mapModelProductBatchToDb };
