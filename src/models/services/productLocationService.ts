
import { supabase } from '@/lib/supabase';
import { ProductLocationStock } from '../productTypes/productLocationStock';
import { assertType } from '@/utils/typeUtils';

// Raw data as it comes from the database
interface RawProductLocationStock {
  id: string;
  product_id: string;
  location_id: string;
  stock: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
}

export const productLocationService = {
  async getStock(productId: string, locationId?: string): Promise<ProductLocationStock[]> {
    try {
      let query = supabase
        .from('product_location_stock')
        .select('*')
        .eq('product_id', productId);
        
      if (locationId) {
        query = query.eq('location_id', locationId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Error fetching stock for product ${productId}:`, error);
        throw error;
      }
      
      const typedData = assertType<RawProductLocationStock[]>(data || []);
      
      return typedData.map(item => ({
        id: item.id,
        productId: item.product_id,
        locationId: item.location_id,
        stock: item.stock,
        minStockLevel: item.min_stock_level,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error(`Error in getStock for product ${productId}:`, error);
      return [];
    }
  },
  
  async updateStock(productId: string, locationId: string, newStock: number): Promise<ProductLocationStock> {
    try {
      // First check if the record exists
      const { data: existingData, error: existingError } = await supabase
        .from('product_location_stock')
        .select('*')
        .eq('product_id', productId)
        .eq('location_id', locationId)
        .maybeSingle();
      
      if (existingError) {
        console.error(`Error checking stock for product ${productId}:`, existingError);
        throw existingError;
      }
      
      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from('product_location_stock')
          .update({ stock: newStock })
          .eq('id', existingData.id)
          .select()
          .single();
        
        if (error) {
          console.error(`Error updating stock for product ${productId}:`, error);
          throw error;
        }
        
        const typedData = assertType<RawProductLocationStock>(data);
        
        return {
          id: typedData.id,
          productId: typedData.product_id,
          locationId: typedData.location_id,
          stock: typedData.stock,
          minStockLevel: typedData.min_stock_level,
          createdAt: typedData.created_at,
          updatedAt: typedData.updated_at
        };
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('product_location_stock')
          .insert([{
            product_id: productId,
            location_id: locationId,
            stock: newStock,
            min_stock_level: 0
          }])
          .select()
          .single();
        
        if (error) {
          console.error(`Error creating stock for product ${productId}:`, error);
          throw error;
        }
        
        const typedData = assertType<RawProductLocationStock>(data);
        
        return {
          id: typedData.id,
          productId: typedData.product_id,
          locationId: typedData.location_id,
          stock: typedData.stock,
          minStockLevel: typedData.min_stock_level,
          createdAt: typedData.created_at,
          updatedAt: typedData.updated_at
        };
      }
    } catch (error) {
      console.error(`Error in updateStock for product ${productId}:`, error);
      throw error;
    }
  },
  
  async upsertStock(data: Partial<ProductLocationStock> & { productId: string; locationId: string }): Promise<ProductLocationStock> {
    return this.updateStock(data.productId, data.locationId, data.stock || 0);
  },
  
  async getProductsAtLocation(locationId: string): Promise<ProductLocationStock[]> {
    try {
      const { data, error } = await supabase
        .from('product_location_stock')
        .select('*')
        .eq('location_id', locationId);
      
      if (error) {
        console.error(`Error fetching products at location ${locationId}:`, error);
        throw error;
      }
      
      const typedData = assertType<RawProductLocationStock[]>(data || []);
      
      return typedData.map(item => ({
        id: item.id,
        productId: item.product_id,
        locationId: item.location_id,
        stock: item.stock,
        minStockLevel: item.min_stock_level,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error(`Error in getProductsAtLocation for location ${locationId}:`, error);
      return [];
    }
  }
};
