
import { ProductBatch } from "./productBatch";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { productBatchService } from './services/productBatchService';
import { rpcParams } from '@/utils/supabaseTypes';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  barcode?: string;
  imageUrl?: string;
  stock: number;
  isCombo?: boolean;
  hasStock?: boolean;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductWithBatches extends Product {
  batches: ProductBatch[];
}

export interface ProductCreate {
  name: string;
  description?: string;
  price: number;
  cost?: number;
  barcode?: string;
  categoryId?: string;
  stock: number;
  imageUrl?: string;
  isCombo?: boolean;
  hasStock?: boolean;
}

export interface ProductUpdate {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  cost?: number;
  barcode?: string;
  imageUrl?: string;
  categoryId?: string;
  stock?: number;
  isCombo?: boolean;
  hasStock?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Database mappings
interface DBProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  cost: number | null;
  barcode: string | null;
  image_url: string | null;
  stock: number;
  is_combo: boolean;
  has_stock: boolean;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  } | null;
}

const mapDbProductToModel = (dbProduct: DBProduct): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || undefined,
    price: dbProduct.price,
    cost: dbProduct.cost || undefined,
    barcode: dbProduct.barcode || undefined,
    imageUrl: dbProduct.image_url || undefined,
    stock: dbProduct.stock || 0,
    isCombo: dbProduct.is_combo,
    hasStock: dbProduct.has_stock,
    categoryId: dbProduct.category_id || undefined,
    categoryName: dbProduct.category?.name,
    createdAt: dbProduct.created_at,
    updatedAt: dbProduct.updated_at,
  };
};

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          category:category_id (id, name)
        `)
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return (products || []).map(mapDbProductToModel);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      return [];
    }
  },
  
  getById: async (id: string): Promise<Product | null> => {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          category:category_id (id, name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!product) {
        return null;
      }
      
      return mapDbProductToModel(product);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      toast.error(`Failed to load product`);
      return null;
    }
  },
  
  getProductWithBatches: async (id: string): Promise<ProductWithBatches | null> => {
    try {
      const product = await productsService.getById(id);
      if (!product) return null;
      
      // Get product batches using the productBatchService
      const batches = await productBatchService.getByProductId(id);
      
      return {
        ...product,
        batches: batches || []
      };
    } catch (error) {
      console.error(`Error fetching product with batches ${id}:`, error);
      toast.error('Failed to load product details with batches');
      return null;
    }
  },
  
  create: async (data: ProductCreate): Promise<Product | null> => {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .insert([{
          name: data.name,
          description: data.description,
          price: data.price,
          cost: data.cost,
          barcode: data.barcode,
          image_url: data.imageUrl,
          stock: data.stock || 0,
          is_combo: data.isCombo || false,
          has_stock: data.hasStock ?? true,
          category_id: data.categoryId,
        }])
        .select(`
          *,
          category:category_id (id, name)
        `)
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Product created successfully');
      return mapDbProductToModel(product);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
      return null;
    }
  },
  
  update: async (data: ProductUpdate): Promise<Product | null> => {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .update({
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.cost !== undefined && { cost: data.cost }),
          ...(data.barcode !== undefined && { barcode: data.barcode }),
          ...(data.imageUrl !== undefined && { image_url: data.imageUrl }),
          ...(data.stock !== undefined && { stock: data.stock }),
          ...(data.isCombo !== undefined && { is_combo: data.isCombo }),
          ...(data.hasStock !== undefined && { has_stock: data.hasStock }),
          ...(data.categoryId !== undefined && { category_id: data.categoryId }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id)
        .select(`
          *,
          category:category_id (id, name)
        `)
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Product updated successfully');
      return mapDbProductToModel(product);
    } catch (error) {
      console.error(`Error updating product ${data.id}:`, error);
      toast.error('Failed to update product');
      return null;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Product deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      toast.error('Failed to delete product');
      return false;
    }
  },
  
  updateStock: async (id: string, newStock: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          stock: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Error updating stock for product ${id}:`, error);
      toast.error('Failed to update product stock');
      return false;
    }
  },
};
