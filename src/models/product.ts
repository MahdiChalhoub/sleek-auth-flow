
// Import current code and add to the Product interface
import { Category } from './category';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  barcode?: string;
  stock: number;
  has_stock?: boolean;
  hasStock?: boolean; // Adding for compatibility with existing components
  is_combo?: boolean;
  category_id?: string;
  image_url?: string;
  image?: string; // Adding for compatibility with existing components
  created_at?: string;
  updated_at?: string;
  category?: Category;
  min_stock_level?: number;
  max_stock_level?: number;
}

// Add mock products for use in components
export const mockProducts: Product[] = [
  {
    id: "prod-001",
    name: "Laptop",
    description: "High-performance laptop",
    price: 1299.99,
    cost: 899.99,
    stock: 15,
    barcode: "123456789012",
    image_url: "/images/laptop.jpg",
    image: "/images/laptop.jpg", // For compatibility
    category_id: "cat-001",
    has_stock: true,
    hasStock: true, // For compatibility
    is_combo: false,
    min_stock_level: 5,
    max_stock_level: 30,
    category: { id: "cat-001", name: "Electronics" }
  },
  {
    id: "prod-002",
    name: "Smartphone",
    description: "Latest smartphone model",
    price: 899.99,
    cost: 599.99,
    stock: 25,
    barcode: "223456789012",
    image_url: "/images/smartphone.jpg",
    image: "/images/smartphone.jpg", // For compatibility
    category_id: "cat-001",
    has_stock: true,
    hasStock: true, // For compatibility
    is_combo: false,
    min_stock_level: 10,
    max_stock_level: 50,
    category: { id: "cat-001", name: "Electronics" }
  },
  {
    id: "prod-003",
    name: "Coffee Maker",
    description: "Automatic coffee machine",
    price: 149.99,
    cost: 89.99,
    stock: 8,
    barcode: "323456789012",
    image_url: "/images/coffeemaker.jpg",
    image: "/images/coffeemaker.jpg", // For compatibility
    category_id: "cat-002",
    has_stock: true,
    hasStock: true, // For compatibility
    is_combo: false,
    min_stock_level: 3,
    max_stock_level: 15,
    category: { id: "cat-002", name: "Home Appliances" }
  },
  {
    id: "prod-004",
    name: "Office Chair",
    description: "Ergonomic office chair",
    price: 249.99,
    cost: 149.99,
    stock: 12,
    barcode: "423456789012",
    image_url: "/images/chair.jpg",
    image: "/images/chair.jpg", // For compatibility
    category_id: "cat-003",
    has_stock: true,
    hasStock: true, // For compatibility
    is_combo: false,
    min_stock_level: 5,
    max_stock_level: 20,
    category: { id: "cat-003", name: "Furniture" }
  },
  {
    id: "prod-005",
    name: "Desk Lamp",
    description: "LED desk lamp",
    price: 49.99,
    cost: 24.99,
    stock: 20,
    barcode: "523456789012",
    image_url: "/images/lamp.jpg",
    image: "/images/lamp.jpg", // For compatibility
    category_id: "cat-003",
    has_stock: true,
    hasStock: true, // For compatibility
    is_combo: false,
    min_stock_level: 8,
    max_stock_level: 30,
    category: { id: "cat-003", name: "Furniture" }
  }
];

// Dummy product service for components that need it
export const productsService = {
  getAll: async () => mockProducts,
  getById: async (id: string) => mockProducts.find(p => p.id === id) || null,
  create: async (product: Omit<Product, 'id'>) => ({
    ...product,
    id: `prod-${Math.floor(Math.random() * 1000)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }),
  update: async (id: string, product: Partial<Product>) => ({
    ...mockProducts.find(p => p.id === id),
    ...product,
    updated_at: new Date().toISOString()
  }),
  delete: async (id: string) => true
};
