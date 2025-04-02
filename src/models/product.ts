
// Updated product model with all required properties
import { supabase } from '@/lib/supabase';
import { callRpc } from '@/utils/rpcUtils';
import { rpcParams } from '@/utils/supabaseUtils';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  barcode?: string;
  stock: number;
  categoryId?: string;
  isCombo?: boolean;
  hasStock?: boolean;
  minStockLevel?: number;
  maxStockLevel?: number;
  comboComponents?: ComboComponent[];
  image?: string;
  image_url?: string; // Database field name
  imageUrl?: string; // For client-side consistency
  createdAt?: string;
  updatedAt?: string;
  locationStock?: LocationStock[];
  category?: { id: string; name: string }; // For display purposes
}

export interface ComboComponent {
  id?: string;
  productId: string;
  componentId: string;
  componentName: string;
  quantity: number;
}

export interface LocationStock {
  locationId: string;
  locationName?: string;
  stock: number;
  minStockLevel?: number;
}

export interface ProductBatch {
  id: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  costPrice?: number;
  createdAt: string;
  updatedAt: string;
  productName?: string; // For display purposes
}

export const createProductBatch = (batch: Omit<ProductBatch, 'id' | 'createdAt' | 'updatedAt'>): ProductBatch => {
  const now = new Date().toISOString();
  return {
    id: `batch-${Math.random().toString(36).substring(2, 11)}`,
    ...batch,
    createdAt: now,
    updatedAt: now
  };
};

// Mock products array for testing
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 899.99,
    cost: 700,
    barcode: '123456789',
    stock: 15,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Electronics' },
    isCombo: false,
    hasStock: true,
    minStockLevel: 5,
    maxStockLevel: 20,
    image: 'https://example.com/laptop.jpg',
    image_url: 'https://example.com/laptop.jpg',
    imageUrl: 'https://example.com/laptop.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Smartphone',
    description: 'Latest smartphone model',
    price: 499.99,
    cost: 350,
    barcode: '987654321',
    stock: 25,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Electronics' },
    isCombo: false,
    hasStock: true,
    minStockLevel: 8,
    maxStockLevel: 30,
    image: 'https://example.com/phone.jpg',
    image_url: 'https://example.com/phone.jpg',
    imageUrl: 'https://example.com/phone.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Office Desk',
    description: 'Ergonomic office desk',
    price: 299.99,
    cost: 200,
    barcode: '456789123',
    stock: 10,
    categoryId: 'cat-2',
    category: { id: 'cat-2', name: 'Furniture' },
    isCombo: false,
    hasStock: true,
    minStockLevel: 3,
    maxStockLevel: 15,
    image: 'https://example.com/desk.jpg',
    image_url: 'https://example.com/desk.jpg',
    imageUrl: 'https://example.com/desk.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Computer Package',
    description: 'Complete computer setup',
    price: 1299.99,
    cost: 950,
    barcode: '789123456',
    stock: 5,
    categoryId: 'cat-1',
    category: { id: 'cat-1', name: 'Electronics' },
    isCombo: true,
    hasStock: true,
    minStockLevel: 2,
    maxStockLevel: 10,
    image: 'https://example.com/computer.jpg',
    image_url: 'https://example.com/computer.jpg',
    imageUrl: 'https://example.com/computer.jpg',
    comboComponents: [
      {
        productId: 'prod-4',
        componentId: 'prod-1',
        componentName: 'Laptop',
        quantity: 1
      },
      {
        productId: 'prod-4',
        componentId: 'prod-5',
        componentName: 'Mouse',
        quantity: 1
      },
      {
        productId: 'prod-4',
        componentId: 'prod-6',
        componentName: 'Keyboard',
        quantity: 1
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Product service functions
export const productsService = {
  getAll: async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:category_id(id, name)');
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        cost: item.cost,
        barcode: item.barcode,
        stock: item.stock,
        categoryId: item.category_id,
        isCombo: item.is_combo,
        hasStock: item.has_stock,
        minStockLevel: item.min_stock_level,
        maxStockLevel: item.max_stock_level,
        image: item.image_url,
        image_url: item.image_url,
        imageUrl: item.image_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        category: item.category
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return mockProducts; // Fallback to mock data
    }
  },
  
  getById: async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:category_id(id, name)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        cost: data.cost,
        barcode: data.barcode,
        stock: data.stock,
        categoryId: data.category_id,
        isCombo: data.is_combo,
        hasStock: data.has_stock,
        minStockLevel: data.min_stock_level,
        maxStockLevel: data.max_stock_level,
        image: data.image_url,
        image_url: data.image_url,
        imageUrl: data.image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        category: data.category
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return mockProducts.find(p => p.id === id) || null; // Fallback to mock data
    }
  },
  
  getProductBatches: async (productId: string): Promise<ProductBatch[]> => {
    try {
      const { data, error } = await callRpc<ProductBatch[], { product_id: string }>(
        'get_product_batches', 
        rpcParams({ product_id: productId })
      );
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching batches for product ${productId}:`, error);
      return [];
    }
  }
};
