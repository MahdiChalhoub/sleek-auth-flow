
import { Category } from './categoryInterfaces';

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
  is_combo?: boolean;
  min_stock_level?: number;
  max_stock_level?: number;
  created_at?: string;
  updated_at?: string;
  // Adding locationStock for ReorderSuggestions component
  locationStock?: ProductLocationStock[];
}

export interface ProductLocationStock {
  id: string;
  productId: string;
  locationId: string;
  stock: number;
  minStockLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  barcode?: string;
  price: number;
  cost?: number;
  stock?: number;
  categoryId?: string;
  imageUrl?: string;
  hasStock?: boolean;
  isCombo?: boolean;
  minStockLevel?: number;
  maxStockLevel?: number;
}

export interface ProductFilterOptions {
  searchTerm?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
