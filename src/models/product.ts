
import { v4 as uuidv4 } from 'uuid';
import { mapDbProductBatchToModel, ProductBatch } from './productBatch';

export interface ComboComponent {
  id: string;
  comboProductId: string;
  componentProductId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCost {
  id: string;
  productId: string;
  cost: number;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPrice {
  id: string;
  productId: string;
  price: number;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductLocationStock {
  id: string;
  productId: string;
  locationId: string;
  stock: number;
  minStockLevel?: number;
  updatedAt: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  categoryId?: string;
  category?: string; // Added for backward compatibility
  price: number;
  cost?: number;
  stock: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  isCombo?: boolean;
  hasStock?: boolean;
  imageUrl?: string;
  image?: string; // Added for backward compatibility with existing code
  comboComponents?: ComboComponent[];
  batches?: ProductBatch[];
  costs?: ProductCost[];
  prices?: ProductPrice[];
  locationStock?: ProductLocationStock[];
  createdAt: string;
  updatedAt: string;
}

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
    image: data.imageUrl, // Map imageUrl to image for compatibility
    comboComponents: data.comboComponents || [],
    batches: data.batches || [],
    costs: data.costs || [],
    prices: data.prices || [],
    locationStock: data.locationStock || [],
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};

// Create a products service to fetch from Supabase instead of mock data
import { supabase } from '@/lib/supabase';

export const productsService = {
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)');
      
      if (error) throw error;
      
      return data.map((product: any) => createProduct({
        ...product,
        category: product.categories?.name,
        image: product.image_url,
        imageUrl: product.image_url
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
      
      return createProduct({
        ...data,
        category: data.categories?.name,
        image: data.image_url,
        imageUrl: data.image_url
      });
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },
  
  async getProductBatches(productId: string): Promise<ProductBatch[]> {
    try {
      const { data, error } = await supabase
        .from('product_batches')
        .select('*')
        .eq('product_id', productId);
      
      if (error) throw error;
      
      return data.map(mapDbProductBatchToModel);
    } catch (error) {
      console.error(`Error fetching batches for product ${productId}:`, error);
      return [];
    }
  },
  
  async getProductStockByLocation(productId: string): Promise<ProductLocationStock[]> {
    try {
      const { data, error } = await supabase
        .from('product_location_stock')
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

// Temporary solution until all components are updated to use the productsService
export const mockProducts: Product[] = Array(10).fill(null).map((_, i) => createProduct({
  id: `temp-${i+1}`,
  name: `Temporary Product ${i+1}`,
  barcode: `TEMP${100000 + i}`,
  price: Math.floor(Math.random() * 100) + 10,
  stock: Math.floor(Math.random() * 50),
  category: 'Temporary'
}));
