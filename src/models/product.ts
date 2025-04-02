
import { supabase } from '@/lib/supabase';
import { Category } from './interfaces/categoryInterfaces';
import { callRpc } from '@/utils/rpcUtils';
import { Product, ProductLocationStock } from './interfaces/productInterfaces';
import { ProductBatch } from './productBatch';

// Create mock products for testing
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Basic T-shirt",
    description: "Comfortable cotton t-shirt",
    barcode: "1234567890",
    price: 19.99,
    cost: 8.50,
    stock: 25,
    image_url: "/images/products/tshirt.jpg",
    category: { id: "1", name: "Clothing" },
    category_id: "1",
    hasStock: true,
    is_combo: false,
    min_stock_level: 5,
    max_stock_level: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locationStock: []
  },
  {
    id: "2",
    name: "Premium Coffee",
    description: "Organic fair-trade coffee beans",
    barcode: "2345678901",
    price: 12.99,
    cost: 6.00,
    stock: 15,
    image_url: "/images/products/coffee.jpg",
    category: { id: "2", name: "Groceries" },
    category_id: "2",
    hasStock: true,
    is_combo: false,
    min_stock_level: 3,
    max_stock_level: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locationStock: []
  },
  {
    id: "3",
    name: "Wireless Headphones",
    description: "Noise-cancelling wireless headphones",
    barcode: "3456789012",
    price: 89.99,
    cost: 45.00,
    stock: 8,
    image_url: "/images/products/headphones.jpg",
    category: { id: "3", name: "Electronics" },
    category_id: "3",
    hasStock: true,
    is_combo: false,
    min_stock_level: 2,
    max_stock_level: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locationStock: []
  }
];

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
      is_combo: product.is_combo,
      min_stock_level: product.min_stock_level || 5,
      max_stock_level: product.max_stock_level || 100,
      created_at: product.created_at,
      updated_at: product.updated_at,
      locationStock: []
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
      is_combo: data.is_combo,
      min_stock_level: data.min_stock_level || 5,
      max_stock_level: data.max_stock_level || 100,
      created_at: data.created_at,
      updated_at: data.updated_at,
      locationStock: []
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

export type { Product, ProductBatch, ProductLocationStock };
