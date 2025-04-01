
import { supabase } from '@/lib/supabase';
import { ProductBatch, mapDbProductBatchToModel } from '../productBatch';
import { safeArray } from '@/utils/supabaseUtils';
import { assertType } from '@/utils/typeUtils';

export const productBatchService = {
  async getProductBatches(productId: string): Promise<ProductBatch[]> {
    try {
      const { data: checkError } = await supabase
        .rpc('check_table_exists', {
          table_name: 'product_batches' 
        });
      
      if (!checkError) {
        console.log('product_batches table not found in database');
        return [];
      }
      
      const { data: batchesData, error } = await supabase
        .rpc('get_product_batches', { 
          product_id_param: productId 
        });
      
      if (error) {
        console.error(`Error calling get_product_batches RPC:`, error);
        throw error;
      }
      
      // Ensure we're handling the data properly
      const typedBatchesData = assertType<any[]>(batchesData || []);
      return safeArray(typedBatchesData, mapDbProductBatchToModel);
    } catch (error) {
      console.error(`Error fetching batches for product ${productId}:`, error);
      return [];
    }
  }
};
