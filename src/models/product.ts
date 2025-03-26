
import { v4 as uuidv4 } from 'uuid';

export interface ComboComponent {
  id: string;
  comboProductId: string;
  componentProductId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductBatch {
  id: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCost {
  id: string;
  productId: string;
  cost: number;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPrice {
  id: string;
  productId: string;
  price: number;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  categoryId?: string;
  price: number;
  cost?: number;
  stock: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  isCombo?: boolean;
  hasStock?: boolean;
  imageUrl?: string;
  comboComponents?: ComboComponent[];
  batches?: ProductBatch[];
  costs?: ProductCost[];
  prices?: ProductPrice[];
  createdAt: string;
  updatedAt: string;
}

export const createProduct = (data: Partial<Product>): Product => {
  const now = new Date().toISOString();
  return {
    id: data.id || uuidv4(),
    name: data.name || '',
    description: data.description,
    barcode: data.barcode,
    categoryId: data.categoryId,
    price: data.price || 0,
    cost: data.cost,
    stock: data.stock || 0,
    minStockLevel: data.minStockLevel,
    maxStockLevel: data.maxStockLevel,
    isCombo: data.isCombo || false,
    hasStock: data.hasStock !== undefined ? data.hasStock : true,
    imageUrl: data.imageUrl,
    comboComponents: data.comboComponents || [],
    batches: data.batches || [],
    costs: data.costs || [],
    prices: data.prices || [],
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
};
