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
  is_combo?: boolean;
  category_id?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  min_stock_level?: number;
  max_stock_level?: number;
}
