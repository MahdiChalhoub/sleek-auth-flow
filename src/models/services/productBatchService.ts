
import { supabase } from '@/lib/supabase';
import { ProductBatch, mapDbProductBatchToModel } from '../productBatch';
import { safeArray } from '@/utils/supabaseUtils';
import { rpcParams } from '@/utils/supabaseTypes';
import { assertType } from '@/utils/typeUtils';

export type GetProductBatchesResult = ProductBatch[];

export const productBatchService = {
  checkTableExists: async (): Promise<boolean> => {
    try {
      const { data: tableExists, error } = await supabase
        .rpc('check_table_exists', rpcParams({
          table_name: 'product_batches'
        }));
      
      if (error) throw error;
      
      return !!tableExists;
    } catch (error) {
      console.error('Error checking product_batches table:', error);
      return false;
    }
  },
  
  getAll: async (): Promise<GetProductBatchesResult> => {
    try {
      // First check if table exists
      const tableExists = await productBatchService.checkTableExists();
      if (!tableExists) {
        console.log('product_batches table does not exist');
        return [];
      }
      
      const { data, error } = await supabase
        .rpc('get_all_product_batches', rpcParams({}));
      
      if (error) throw error;
      
      const typedData = assertType<any[]>(data || []);
      return safeArray(typedData, mapDbProductBatchToModel);
    } catch (error) {
      console.error('Error fetching product batches:', error);
      return [];
    }
  },
  
  getByProductId: async (productId: string): Promise<GetProductBatchesResult> => {
    try {
      const { data, error } = await supabase
        .rpc('get_product_batches_by_product', rpcParams({
          product_id: productId
        }));
      
      if (error) throw error;
      
      const typedData = assertType<any[]>(data || []);
      return safeArray(typedData, mapDbProductBatchToModel);
    } catch (error) {
      console.error(`Error fetching batches for product ${productId}:`, error);
      return [];
    }
  },
  
  create: async (batch: Omit<ProductBatch, "id">): Promise<ProductBatch | null> => {
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
      
      return data ? mapDbProductBatchToModel(data) : null;
    } catch (error) {
      console.error('Error creating product batch:', error);
      return null;
    }
  },
  
  delete: async (batchId: string): Promise<boolean> => {
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

export default productBatchService;
