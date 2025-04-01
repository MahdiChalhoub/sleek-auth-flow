
import { supabase } from '@/lib/supabase';
import { ProductLocationStock } from '../productTypes/productLocationStock';
import { tableSource } from '@/utils/supabaseUtils';

export const productLocationService = {
  async getProductStockByLocation(productId: string): Promise<ProductLocationStock[]> {
    try {
      const { data, error } = await supabase
        .from(tableSource('product_location_stock'))
        .select('*')
        .eq('product_id', productId);
      
      if (error) throw error;
      
      return data.map((stock: any) => ({
        id: stock.id,
        productId: stock.product_id,
        locationId: stock.location_id,
        stock: stock.stock,
        minStockLevel: stock.min_stock_level,
        createdAt: stock.created_at,
        updatedAt: stock.updated_at
      }));
    } catch (error) {
      console.error(`Error fetching location stock for product ${productId}:`, error);
      return [];
    }
  }
};
