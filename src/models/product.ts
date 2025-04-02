
import { supabase } from '@/lib/supabase';
import { Category } from './interfaces/categoryInterfaces';
import { callRpc } from '@/utils/rpcUtils';

export interface Product {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  price: number;
  cost?: number;
  stock: number;
  image_url?: string;
  image?: string;
  category?: Category;
  category_id?: string;
  hasStock: boolean;
  isCombo?: boolean;
  min_stock_level?: number;
  max_stock_level?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductBatch {
  id: string;
  product_id: string;
  batch_number: string;
  expiry_date: string;
  quantity: number;
  purchase_date: string;
  cost_per_unit: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
  status: 'active' | 'expired' | 'low' | 'consumed';
}

// Get all products
const getAll = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:category_id (
          id,
          name
        )
      `)
      .order('name');

    if (error) throw error;

    // Transform data to match our interface
    return (data || []).map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      barcode: product.barcode,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      image_url: product.image_url,
      category: product.category,
      category_id: product.category_id,
      hasStock: product.has_stock,
      isCombo: product.is_combo,
      min_stock_level: product.min_stock_level || 5,
      max_stock_level: product.max_stock_level || 100,
      created_at: product.created_at,
      updated_at: product.updated_at
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get a product by ID
const getById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:category_id (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Transform data to match our interface
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      barcode: data.barcode,
      price: data.price,
      cost: data.cost,
      stock: data.stock,
      image_url: data.image_url,
      category: data.category,
      category_id: data.category_id,
      hasStock: data.has_stock,
      isCombo: data.is_combo,
      min_stock_level: data.min_stock_level || 5,
      max_stock_level: data.max_stock_level || 100,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};

// Get product batches
const getProductBatches = async (productId: string): Promise<ProductBatch[]> => {
  try {
    const { data, error } = await callRpc<ProductBatch[], { product_id: string }>('get_product_batches', {
      product_id: productId
    });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching batches for product ${productId}:`, error);
    return [];
  }
};

export const productsService = {
  getAll,
  getById,
  getProductBatches
};
