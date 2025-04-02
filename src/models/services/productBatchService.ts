
import { supabase } from '@/lib/supabase';
import { ProductBatch } from '@/models/product';
import { typeCast, rpcParams } from '@/utils/supabaseTypes';

export const productBatchService = {
  getAllBatches: async (): Promise<ProductBatch[]> => {
    try {
      // Check if the table exists first
      const { data: tableExists, error: tableCheckError } = await supabase
        .rpc('check_table_exists', rpcParams({
          table_name: 'product_batches'
        }));
      
      if (tableCheckError) {
        console.error('Error checking if table exists:', tableCheckError);
        return [];
      }
      
      if (!tableExists) {
        console.log('product_batches table does not exist yet');
        return [];
      }
      
      const { data, error } = await supabase
        .rpc('get_all_product_batches', rpcParams({}));
      
      if (error) throw error;
      
      return typeCast<ProductBatch[]>(data || []);
    } catch (error) {
      console.error('Error fetching all product batches:', error);
      return [];
    }
  },
  
  getProductBatches: async (productId: string): Promise<ProductBatch[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_product_batches', rpcParams({
          product_id: productId
        }));
      
      if (error) throw error;
      
      return typeCast<ProductBatch[]>(data || []);
    } catch (error) {
      console.error(`Error fetching batches for product ${productId}:`, error);
      return [];
    }
  },
  
  addBatch: async (batch: Omit<ProductBatch, "id" | "createdAt" | "updatedAt">): Promise<ProductBatch | null> => {
    try {
      const { data, error } = await supabase
        .rpc('insert_product_batch', rpcParams({
          batch: {
            product_id: batch.productId,
            batch_number: batch.batchNumber,
            quantity: batch.quantity,
            expiry_date: batch.expiryDate
          }
        }));
      
      if (error) throw error;
      
      return typeCast<ProductBatch>(data);
    } catch (error) {
      console.error('Error adding product batch:', error);
      return null;
    }
  },
  
  updateBatch: async (batch: Partial<ProductBatch> & { id: string }): Promise<ProductBatch | null> => {
    try {
      const { data, error } = await supabase
        .rpc('update_product_batch', rpcParams({
          batch_id: batch.id,
          new_quantity: batch.quantity,
          new_expiry_date: batch.expiryDate,
          new_batch_number: batch.batchNumber
        }));
      
      if (error) throw error;
      
      return typeCast<ProductBatch>(data);
    } catch (error) {
      console.error(`Error updating batch ${batch.id}:`, error);
      return null;
    }
  },
  
  deleteBatch: async (batchId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .rpc('delete_product_batch', rpcParams({
          batch_id: batchId
        }));
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error(`Error deleting batch ${batchId}:`, error);
      return false;
    }
  }
};

export const mapDbProductBatchToModel = (dbBatch: any): ProductBatch => {
  return {
    id: dbBatch.id,
    productId: dbBatch.product_id,
    batchNumber: dbBatch.batch_number,
    quantity: dbBatch.quantity,
    expiryDate: dbBatch.expiry_date,
    createdAt: dbBatch.created_at,
    updatedAt: dbBatch.updated_at,
    productName: dbBatch.product_name
  };
};
