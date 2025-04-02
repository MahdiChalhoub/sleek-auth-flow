
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ProductBatch } from '../productBatch';
import { rpcParams, typeCast } from '@/utils/supabaseTypes';

export interface GetProductBatchesResult {
  id: string;
  batch_number: string;
  product_id: string;
  quantity: number;
  expiry_date: string;
  cost_price: number;
  created_at: string;
  updated_at: string;
}

export const productBatchService = {
  getByProductId: async (productId: string): Promise<ProductBatch[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_product_batches', rpcParams({ product_id: productId }));
      
      if (error) {
        throw error;
      }
      
      return typeCast<ProductBatch[]>(data || []);
    } catch (error) {
      console.error(`Error fetching batches for product ${productId}:`, error);
      toast.error('Failed to load product batches');
      return [];
    }
  },
  
  create: async (batch: Omit<ProductBatch, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductBatch | null> => {
    try {
      const { data, error } = await supabase
        .rpc('create_product_batch', rpcParams({
          p_batch_number: batch.batchNumber,
          p_product_id: batch.productId,
          p_quantity: batch.quantity,
          p_expiry_date: batch.expiryDate,
          p_cost_price: batch.costPrice
        }));
      
      if (error) {
        throw error;
      }
      
      return typeCast<ProductBatch>(data);
    } catch (error) {
      console.error('Error creating product batch:', error);
      toast.error('Failed to create product batch');
      return null;
    }
  },
  
  update: async (batch: Partial<ProductBatch> & { id: string }): Promise<ProductBatch | null> => {
    try {
      const { data, error } = await supabase
        .rpc('update_product_batch', rpcParams({
          p_id: batch.id,
          p_batch_number: batch.batchNumber,
          p_quantity: batch.quantity,
          p_expiry_date: batch.expiryDate,
          p_cost_price: batch.costPrice
        }));
      
      if (error) {
        throw error;
      }
      
      return typeCast<ProductBatch>(data);
    } catch (error) {
      console.error(`Error updating product batch ${batch.id}:`, error);
      toast.error('Failed to update product batch');
      return null;
    }
  },
  
  delete: async (batchId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .rpc('delete_product_batch', rpcParams({
          p_id: batchId
        }));
      
      if (error) {
        throw error;
      }
      
      toast.success('Product batch deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting product batch ${batchId}:`, error);
      toast.error('Failed to delete product batch');
      return false;
    }
  }
};
