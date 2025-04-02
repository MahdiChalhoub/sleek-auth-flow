
import { Supplier } from './supplierInterfaces';

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  batch?: string | null;
  expirationDate?: string | null;
}

export interface PurchaseOrder {
  id: string;
  supplier: Supplier;
  status: 'pending' | 'ordered' | 'received' | 'completed';
  total_amount: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  items: PurchaseOrderItem[];
}
