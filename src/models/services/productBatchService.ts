
import { supabase } from '@/lib/supabase';
import { ProductBatch, mapDbProductBatchToModel } from '../productBatch';
import { safeArray } from '@/utils/supabaseUtils';
import { assertType } from '@/utils/typeUtils';

// Properly define the parameter types for the RPC calls
interface CheckTableExistsArgs {
  table_name: string;
}

interface GetProductBatchesArgs {
  product_id_param: string;
}

// Define the return type for these RPC calls
type CheckTableExistsResult = boolean;
type GetProductBatchesResult = any[];

export const productBatchService = {
  async getProductBatches(productId: string): Promise<ProductBatch[]> {
    try {
      const { data: tableExists, error: checkError } = await supabase
        .rpc<CheckTableExistsResult, CheckTableExistsArgs>('check_table_exists', {
          table_name: 'product_batches' 
        });
      
      if (!tableExists) {
        console.log('product_batches table not found in database');
        return [];
      }
      
      const { data: batchesData, error } = await supabase
        .rpc<GetProductBatchesResult, GetProductBatchesArgs>('get_product_batches', { 
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
