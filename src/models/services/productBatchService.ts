
import { supabase } from '@/lib/supabase';
import { ProductBatch, mapDbProductBatchToModel } from '../productBatch';
import { safeArray, rpcParams } from '@/utils/supabaseUtils';

export const productBatchService = {
  async getProductBatches(productId: string): Promise<ProductBatch[]> {
    try {
      const { data: checkError } = await supabase
        .rpc('check_table_exists', rpcParams({
          table_name: 'product_batches' 
        }));
      
      if (!checkError) {
        console.log('product_batches table not found in database');
        return [];
      }
      
      const { data: batchesData, error } = await supabase
        .rpc('get_product_batches', rpcParams({ 
          product_id_param: productId 
        }));
      
      if (error) {
        console.error(`Error calling get_product_batches RPC:`, error);
        throw error;
      }
      
      return safeArray(batchesData, mapDbProductBatchToModel);
    } catch (error) {
      console.error(`Error fetching batches for product ${productId}:`, error);
      return [];
    }
  }
};
