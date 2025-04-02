
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
  has_stock: boolean;
  is_combo?: boolean;
  created_at?: string;
  updated_at?: string;
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
}

export interface ProductFilterOptions {
  searchTerm?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
