
import { supabase } from '@/lib/supabase';
import { ProductBatch, mapDbProductBatchToModel } from '../productBatch';
import { safeArray } from '@/utils/supabaseUtils';
import { assertType } from '@/utils/typeUtils';

interface CheckTableExistsArgs {
  table_name: string;
}

interface GetProductBatchesArgs {
  product_id_param: string;
}

export const productBatchService = {
  async getProductBatches(productId: string): Promise<ProductBatch[]> {
    try {
      const { data: tableExists, error: checkError } = await supabase
        .rpc<boolean>('check_table_exists', {
          table_name: 'product_batches' 
        } as CheckTableExistsArgs);
      
      if (!tableExists) {
        console.log('product_batches table not found in database');
        return [];
      }
      
      const { data: batchesData, error } = await supabase
        .rpc<any[]>('get_product_batches', { 
          product_id_param: productId 
        } as GetProductBatchesArgs);
      
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
