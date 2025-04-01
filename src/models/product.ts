
import { v4 as uuidv4 } from 'uuid';
import { ComboComponent } from './productTypes/comboComponent';
import { ProductCost } from './productTypes/productCost';
import { ProductPrice } from './productTypes/productPrice';
import { ProductLocationStock } from './productTypes/productLocationStock';
import { ProductBatch, mapDbProductBatchToModel } from './productBatch';
import { supabase } from '@/lib/supabase';
import { safeArray, rpcParams } from '@/utils/supabaseUtils';
import { assertType } from '@/utils/typeUtils';
import { productBatchService } from './services/productBatchService';
import { productLocationService } from './services/productLocationService';

export interface Product {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  categoryId?: string;
  category?: string;
  price: number;
  cost?: number;
  stock: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  isCombo?: boolean;
  hasStock?: boolean;
  imageUrl?: string;
  image?: string;
  comboComponents?: ComboComponent[];
  batches?: ProductBatch[];
  costs?: ProductCost[];
  prices?: ProductPrice[];
  locationStock?: ProductLocationStock[];
  createdAt: string;
  updatedAt: string;
}

// Re-export ComboComponent for use in other modules
export { ComboComponent };

export const createProduct = (data: Partial<Product>): Product => {
  const now = new Date().toISOString();
  return {
    id: data.id || uuidv4(),
    name: data.name || '',
    description: data.description,
    barcode: data.barcode,
    categoryId: data.categoryId,
    category: data.category,
    price: data.price || 0,
    cost: data.cost,
    stock: data.stock || 0,
    minStockLevel: data.minStockLevel,
    maxStockLevel: data.maxStockLevel,
    isCombo: data.isCombo || false,
    hasStock: data.hasStock !== undefined ? data.hasStock : true,
    imageUrl: data.imageUrl,
    image: data.imageUrl,
    comboComponents: data.comboComponents || [],
    batches: data.batches || [],
    costs: data.costs || [],
    prices: data.prices || [],
    locationStock: data.locationStock || [],
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};

export const productsService = {
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)');
      
      if (error) throw error;
      
      return (data || []).map((product: any) => createProduct({
        ...product,
        categoryId: product.category_id,
        category: product.categories?.name,
        imageUrl: product.image_url,
        image: product.image_url
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  async getById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Get related data
      const batches = await productBatchService.getProductBatches(id);
      const locationStock = await productLocationService.getStock(id);
      
      const typedData = assertType<any>(data);
      
      return createProduct({
        ...typedData,
        categoryId: typedData.category_id,
        category: typedData.categories?.name,
        imageUrl: typedData.image_url,
        image: typedData.image_url,
        batches,
        locationStock
      });
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },
  
  async getProductBatches(productId: string): Promise<ProductBatch[]> {
    return productBatchService.getProductBatches(productId);
  },
  
  async getProductStockByLocation(productId: string): Promise<ProductLocationStock[]> {
    return productLocationService.getStock(productId);
  }
};

export const mockProducts: Product[] = Array(10).fill(null).map((_, i) => createProduct({
  id: `temp-${i+1}`,
  name: `Temporary Product ${i+1}`,
  barcode: `TEMP${100000 + i}`,
  price: Math.floor(Math.random() * 100) + 10,
  stock: Math.floor(Math.random() * 50),
  category: 'Temporary'
}));
