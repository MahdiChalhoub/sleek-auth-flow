
import { Category } from '@/types/category';

export interface Product {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  price: number;
  cost?: number;
  category?: Category;
  categoryId?: string;
  imageUrl?: string;
  stock: number;
  hasStock?: boolean;
  isCombo?: boolean;
  createdAt?: string;
  updatedAt?: string;
  locationStock?: ProductLocationStock[];
  min_stock_level?: number;
}

export interface ProductFormData {
  name: string;
  description?: string;
  barcode?: string;
  price: number;
  cost?: number;
  categoryId?: string;
  hasStock?: boolean;
  stock?: number;
  imageUrl?: string;
  isCombo?: boolean;
}

export interface ProductLocationStock {
  locationId: string;
  stock: number;
  minStockLevel?: number;
  maxStockLevel?: number;
}
