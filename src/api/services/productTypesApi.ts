
import { supabase } from '@/integrations/supabase/client';
import { ProductCost } from '@/models/productTypes/productCost';
import { ProductPrice } from '@/models/productTypes/productPrice';
import { ComboComponent } from '@/models/productTypes/comboComponent';
import { ProductLocationStock } from '@/models/productTypes/productLocationStock';
import { tableSource } from '@/utils/supabaseUtils';
import { assertType } from '@/utils/typeUtils';

// Product Types API - manages secondary product data like costs, prices, component relationships
export const productTypesApi = {
  // Product Costs
  getProductCosts: async (productId: string): Promise<ProductCost[]> => {
    const { data, error } = await supabase
      .from(tableSource('product_costs'))
      .select('*')
      .eq('product_id', productId)
      .order('effective_date', { ascending: false });
    
    if (error) {
      console.error(`Error fetching costs for product ${productId}:`, error);
      throw error;
    }
    
    return (data || []).map(item => ({
      id: item.id,
      productId: item.product_id,
      cost: item.cost,
      effectiveDate: item.effective_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },
  
  addProductCost: async (cost: Omit<ProductCost, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductCost> => {
    const { data, error } = await supabase
      .from(tableSource('product_costs'))
      .insert([{
        product_id: cost.productId,
        cost: cost.cost,
        effective_date: cost.effectiveDate
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product cost:', error);
      throw error;
    }
    
    return {
      id: data.id,
      productId: data.product_id,
      cost: data.cost,
      effectiveDate: data.effective_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  // Product Prices
  getProductPrices: async (productId: string): Promise<ProductPrice[]> => {
    const { data, error } = await supabase
      .from(tableSource('product_prices'))
      .select('*')
      .eq('product_id', productId)
      .order('effective_date', { ascending: false });
    
    if (error) {
      console.error(`Error fetching prices for product ${productId}:`, error);
      throw error;
    }
    
    return (data || []).map(item => ({
      id: item.id,
      productId: item.product_id,
      price: item.price,
      effectiveDate: item.effective_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },
  
  addProductPrice: async (price: Omit<ProductPrice, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductPrice> => {
    const { data, error } = await supabase
      .from(tableSource('product_prices'))
      .insert([{
        product_id: price.productId,
        price: price.price,
        effective_date: price.effectiveDate
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product price:', error);
      throw error;
    }
    
    return {
      id: data.id,
      productId: data.product_id,
      price: data.price,
      effectiveDate: data.effective_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  // Combo Components
  getComboComponents: async (comboProductId: string): Promise<ComboComponent[]> => {
    const { data, error } = await supabase
      .from(tableSource('combo_components'))
      .select('*')
      .eq('combo_product_id', comboProductId);
    
    if (error) {
      console.error(`Error fetching combo components for product ${comboProductId}:`, error);
      throw error;
    }
    
    return (data || []).map(item => ({
      id: item.id,
      comboProductId: item.combo_product_id,
      componentProductId: item.component_product_id,
      quantity: item.quantity,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },
  
  addComboComponent: async (component: Omit<ComboComponent, 'id' | 'createdAt' | 'updatedAt'>): Promise<ComboComponent> => {
    const { data, error } = await supabase
      .from(tableSource('combo_components'))
      .insert([{
        combo_product_id: component.comboProductId,
        component_product_id: component.componentProductId,
        quantity: component.quantity
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding combo component:', error);
      throw error;
    }
    
    return {
      id: data.id,
      comboProductId: data.combo_product_id,
      componentProductId: data.component_product_id,
      quantity: data.quantity,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  // Product Location Stock
  getProductLocationStock: async (productId: string, locationId: string): Promise<ProductLocationStock | null> => {
    const { data, error } = await supabase
      .from(tableSource('product_location_stock'))
      .select('*')
      .eq('product_id', productId)
      .eq('location_id', locationId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No results found
        return null;
      }
      console.error(`Error fetching stock for product ${productId} at location ${locationId}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      productId: data.product_id,
      locationId: data.location_id,
      stock: data.stock,
      minStockLevel: data.min_stock_level,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },
  
  updateProductLocationStock: async (
    stockData: Partial<ProductLocationStock> & { productId: string; locationId: string }
  ): Promise<ProductLocationStock> => {
    // First check if a record exists
    const existing = await productTypesApi.getProductLocationStock(stockData.productId, stockData.locationId);
    
    if (existing) {
      // Update existing record
      const updateData: any = {};
      if (stockData.stock !== undefined) updateData.stock = stockData.stock;
      if (stockData.minStockLevel !== undefined) updateData.min_stock_level = stockData.minStockLevel;
      
      const { data, error } = await supabase
        .from(tableSource('product_location_stock'))
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating stock for product ${stockData.productId}:`, error);
        throw error;
      }
      
      return {
        id: data.id,
        productId: data.product_id,
        locationId: data.location_id,
        stock: data.stock,
        minStockLevel: data.min_stock_level,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } else {
      // Create new record
      const { data, error } = await supabase
        .from(tableSource('product_location_stock'))
        .insert([{
          product_id: stockData.productId,
          location_id: stockData.locationId,
          stock: stockData.stock || 0,
          min_stock_level: stockData.minStockLevel || 0
        }])
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating stock for product ${stockData.productId}:`, error);
        throw error;
      }
      
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
  }
};
