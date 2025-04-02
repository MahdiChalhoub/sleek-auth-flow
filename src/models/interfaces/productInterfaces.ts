
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
  min_stock_level?: number;
  max_stock_level?: number;
}
