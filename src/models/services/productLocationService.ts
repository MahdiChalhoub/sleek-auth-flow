
import { supabase } from '@/lib/supabase';
import { tableSource } from '@/utils/supabaseUtils';
import { ProductLocationStock } from '@/models/productTypes/productLocationStock';
import { assertType } from '@/utils/typeUtils';

// DB Types
interface DbProductLocationStock {
  id: string;
  product_id: string;
  location_id: string;
  stock: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
}

// Map DB type to model type
function mapDbToModel(data: DbProductLocationStock): ProductLocationStock {
  return {
    id: data.id,
    productId: data.product_id,
    locationId: data.location_id,
    stock: data.stock,
    minStockLevel: data.min_stock_level,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

// Map model type to DB type
function mapModelToDb(data: Partial<ProductLocationStock> & { productId: string; locationId: string }): Partial<DbProductLocationStock> {
  const result: Partial<DbProductLocationStock> = {
    product_id: data.productId,
    location_id: data.locationId
  };
  
  if (data.stock !== undefined) result.stock = data.stock;
  if (data.minStockLevel !== undefined) result.min_stock_level = data.minStockLevel;
  
  return result;
}

export const productLocationService = {
  // Get stock of a product at a specific location
  async getStock(productId: string, locationId: string): Promise<ProductLocationStock | null> {
    const { data, error } = await supabase
      .from(tableSource('product_location_stock'))
      .select('*')
      .eq('product_id', productId)
      .eq('location_id', locationId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows match the query
      console.error('Error fetching product location stock:', error);
      throw error;
    }
    
    return data ? mapDbToModel(assertType<DbProductLocationStock>(data)) : null;
  },
  
  // Update stock level
  async updateStock(
    productId: string, 
    locationId: string, 
    newStock: number
  ): Promise<ProductLocationStock> {
    // First check if a record exists
    const existingStock = await this.getStock(productId, locationId);
    
    if (existingStock) {
      // Update existing record
      const { data, error } = await supabase
        .from(tableSource('product_location_stock'))
        .update({ stock: newStock })
        .eq('id', existingStock.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product location stock:', error);
        throw error;
      }
      
      return mapDbToModel(assertType<DbProductLocationStock>(data));
    } else {
      // Create new record
      const { data, error } = await supabase
        .from(tableSource('product_location_stock'))
        .insert([{
          product_id: productId,
          location_id: locationId,
          stock: newStock,
          min_stock_level: 0 // Default min level
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product location stock:', error);
        throw error;
      }
      
      return mapDbToModel(assertType<DbProductLocationStock>(data));
    }
  },
  
  // Update or create stock record with complete data
  async upsertStock(
    data: Partial<ProductLocationStock> & { productId: string; locationId: string }
  ): Promise<ProductLocationStock> {
    const existingStock = await this.getStock(data.productId, data.locationId);
    
    if (existingStock) {
      // Update existing record
      const { data: updatedData, error } = await supabase
        .from(tableSource('product_location_stock'))
        .update(mapModelToDb(data))
        .eq('id', existingStock.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product location stock:', error);
        throw error;
      }
      
      return mapDbToModel(assertType<DbProductLocationStock>(updatedData));
    } else {
      // Create new record
      const dbData = mapModelToDb(data);
      if (dbData.stock === undefined) dbData.stock = 0;
      if (dbData.min_stock_level === undefined) dbData.min_stock_level = 0;
      
      const { data: newData, error } = await supabase
        .from(tableSource('product_location_stock'))
        .insert([dbData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product location stock:', error);
        throw error;
      }
      
      return mapDbToModel(assertType<DbProductLocationStock>(newData));
    }
  },
  
  // Get all products for a location
  async getProductsAtLocation(locationId: string): Promise<ProductLocationStock[]> {
    const { data, error } = await supabase
      .from(tableSource('product_location_stock'))
      .select('*')
      .eq('location_id', locationId);
    
    if (error) {
      console.error('Error fetching products at location:', error);
      throw error;
    }
    
    return (data || []).map(item => 
      mapDbToModel(assertType<DbProductLocationStock>(item))
    );
  }
};
