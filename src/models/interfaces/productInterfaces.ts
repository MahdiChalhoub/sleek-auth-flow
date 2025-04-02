
import { Category } from '../category';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  barcode?: string;
  stock: number;
  hasStock: boolean;
  has_stock?: boolean;
  isCombo?: boolean;
  is_combo?: boolean;
  categoryId?: string;
  category_id?: string;
  image?: string;
  image_url?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  category?: Category;
  min_stock_level?: number;
  max_stock_level?: number;
  locationStock?: ProductLocationStock[];
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  cost?: number;
  barcode?: string;
  stock: number;
  hasStock: boolean;
  categoryId?: string;
  image?: string;
  isCombo?: boolean;
  min_stock_level?: number;
  max_stock_level?: number;
}

// Define the ProductLocationStock interface which was missing
export interface ProductLocationStock {
  id: string;
  productId: string;
  locationId: string;
  stock: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  createdAt: string;
  updatedAt: string;
}
