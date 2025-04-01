
import { supabase } from '@/integrations/supabase/client';
import { ProductCost } from '@/models/productTypes/productCost';
import { ProductPrice } from '@/models/productTypes/productPrice';
import { ComboComponent } from '@/models/productTypes/comboComponent';
import { ProductLocationStock } from '@/models/productTypes/productLocationStock';
import { assertType } from '@/utils/typeUtils';

// Define the raw database types to enable proper type casting
interface RawProductCost {
  id: string;
  product_id: string;
  cost: number;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

interface RawProductPrice {
  id: string;
  product_id: string;
  price: number;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

interface RawComboComponent {
  id: string;
  combo_product_id: string;
  component_product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface RawProductLocationStock {
  id: string;
  product_id: string;
  location_id: string;
  stock: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
}

// Product Types API - manages secondary product data like costs, prices, component relationships
export const productTypesApi = {
  // Product Costs
  getProductCosts: async (productId: string): Promise<ProductCost[]> => {
    try {
      const { data, error } = await supabase
        .from('product_costs' as any)
        .select('*')
        .eq('product_id', productId)
        .order('effective_date', { ascending: false });
      
      if (error) {
        console.error(`Error fetching costs for product ${productId}:`, error);
        throw error;
      }
      
      return (data || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        cost: item.cost,
        effectiveDate: item.effective_date,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error(`Error fetching costs for product ${productId}:`, error);
      return [];
    }
  },
  
  addProductCost: async (cost: Omit<ProductCost, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductCost> => {
    try {
      const { data, error } = await supabase
        .from('product_costs' as any)
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
      
      const rawCost = assertType<RawProductCost>(data);
      
      return {
        id: rawCost.id,
        productId: rawCost.product_id,
        cost: rawCost.cost,
        effectiveDate: rawCost.effective_date,
        createdAt: rawCost.created_at,
        updatedAt: rawCost.updated_at
      };
    } catch (error) {
      console.error('Error adding product cost:', error);
      throw error;
    }
  },
  
  // Product Prices
  getProductPrices: async (productId: string): Promise<ProductPrice[]> => {
    try {
      const { data, error } = await supabase
        .from('product_prices' as any)
        .select('*')
        .eq('product_id', productId)
        .order('effective_date', { ascending: false });
      
      if (error) {
        console.error(`Error fetching prices for product ${productId}:`, error);
        throw error;
      }
      
      return (data || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        price: item.price,
        effectiveDate: item.effective_date,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error(`Error fetching prices for product ${productId}:`, error);
      return [];
    }
  },
  
  addProductPrice: async (price: Omit<ProductPrice, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductPrice> => {
    try {
      const { data, error } = await supabase
        .from('product_prices' as any)
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
      
      const rawPrice = assertType<RawProductPrice>(data);
      
      return {
        id: rawPrice.id,
        productId: rawPrice.product_id,
        price: rawPrice.price,
        effectiveDate: rawPrice.effective_date,
        createdAt: rawPrice.created_at,
        updatedAt: rawPrice.updated_at
      };
    } catch (error) {
      console.error('Error adding product price:', error);
      throw error;
    }
  },
  
  // Combo Components
  getComboComponents: async (comboProductId: string): Promise<ComboComponent[]> => {
    try {
      const { data, error } = await supabase
        .from('combo_components')
        .select('*')
        .eq('combo_product_id', comboProductId);
      
      if (error) {
        console.error(`Error fetching combo components for product ${comboProductId}:`, error);
        throw error;
      }
      
      return (data || []).map((item: any) => ({
        id: item.id,
        comboProductId: item.combo_product_id,
        componentProductId: item.component_product_id,
        quantity: item.quantity,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error(`Error fetching combo components for product ${comboProductId}:`, error);
      return [];
    }
  },
  
  addComboComponent: async (component: Omit<ComboComponent, 'id' | 'createdAt' | 'updatedAt'>): Promise<ComboComponent> => {
    try {
      const { data, error } = await supabase
        .from('combo_components')
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
      
      const rawComponent = assertType<RawComboComponent>(data);
      
      return {
        id: rawComponent.id,
        comboProductId: rawComponent.combo_product_id,
        componentProductId: rawComponent.component_product_id,
        quantity: rawComponent.quantity,
        createdAt: rawComponent.created_at,
        updatedAt: rawComponent.updated_at
      };
    } catch (error) {
      console.error('Error adding combo component:', error);
      throw error;
    }
  },
  
  // Product Location Stock
  getProductLocationStock: async (productId: string, locationId: string): Promise<ProductLocationStock | null> => {
    try {
      const { data, error } = await supabase
        .from('product_location_stock')
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
      
      const rawStock = assertType<RawProductLocationStock>(data);
      
      return {
        id: rawStock.id,
        productId: rawStock.product_id,
        locationId: rawStock.location_id,
        stock: rawStock.stock,
        minStockLevel: rawStock.min_stock_level,
        createdAt: rawStock.created_at,
        updatedAt: rawStock.updated_at
      };
    } catch (error) {
      console.error(`Error fetching stock for product ${productId} at location ${locationId}:`, error);
      return null;
    }
  },
  
  updateProductLocationStock: async (
    stockData: Partial<ProductLocationStock> & { productId: string; locationId: string }
  ): Promise<ProductLocationStock> => {
    try {
      // First check if a record exists
      const existing = await productTypesApi.getProductLocationStock(stockData.productId, stockData.locationId);
      
      if (existing) {
        // Update existing record
        const updateData: any = {};
        if (stockData.stock !== undefined) updateData.stock = stockData.stock;
        if (stockData.minStockLevel !== undefined) updateData.min_stock_level = stockData.minStockLevel;
        
        const { data, error } = await supabase
          .from('product_location_stock')
          .update(updateData)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) {
          console.error(`Error updating stock for product ${stockData.productId}:`, error);
          throw error;
        }
        
        const rawStock = assertType<RawProductLocationStock>(data);
        
        return {
          id: rawStock.id,
          productId: rawStock.product_id,
          locationId: rawStock.location_id,
          stock: rawStock.stock,
          minStockLevel: rawStock.min_stock_level,
          createdAt: rawStock.created_at,
          updatedAt: rawStock.updated_at
        };
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('product_location_stock')
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
        
        const rawStock = assertType<RawProductLocationStock>(data);
        
        return {
          id: rawStock.id,
          productId: rawStock.product_id,
          locationId: rawStock.location_id,
          stock: rawStock.stock,
          minStockLevel: rawStock.min_stock_level,
          createdAt: rawStock.created_at,
          updatedAt: rawStock.updated_at
        };
      }
    } catch (error) {
      console.error(`Error updating stock for product ${stockData.productId}:`, error);
      throw error;
    }
  }
};
