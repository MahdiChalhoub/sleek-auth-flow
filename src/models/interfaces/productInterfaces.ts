
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
  image_url?: string; // Added for backward compatibility
  image?: string; // Added for backward compatibility
  stock: number;
  hasStock?: boolean;
  has_stock?: boolean; // Added for backward compatibility
  isCombo?: boolean;
  is_combo?: boolean; // Added for backward compatibility
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // Added for backward compatibility
  updated_at?: string; // Added for backward compatibility
  locationStock?: ProductLocationStock[];
  min_stock_level?: number;
  max_stock_level?: number;
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
  id?: string;
  locationId: string;
  productId?: string;
  stock: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  createdAt?: string;
  updatedAt?: string;
}
