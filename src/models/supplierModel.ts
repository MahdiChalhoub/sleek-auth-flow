
import { v4 as uuidv4 } from 'uuid';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  products: string[]; // Product IDs this supplier provides
  isActive: boolean;
  rating?: number; // 1-5 rating
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierStats {
  totalOrders: number;
  totalSpend: number;
  averageDeliveryTime: number; // in days
  lateDeliveries: number;
  lastOrderDate?: string;
}

export interface SupplierOrder {
  id: string;
  supplierId: string;
  orderDate: string;
  deliveryDate?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface SuppliersFilterParams {
  search?: string;
  isActive?: boolean;
  minRating?: number;
  hasProducts?: string[]; // Filter suppliers that provide specific products
}

export function createSupplier(data: Partial<Supplier>): Supplier {
  const now = new Date().toISOString();
  
  return {
    id: data.id || uuidv4(),
    name: data.name || "",
    contactPerson: data.contactPerson || "",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    taxId: data.taxId,
    paymentTerms: data.paymentTerms,
    notes: data.notes,
    products: data.products || [],
    isActive: data.isActive !== undefined ? data.isActive : true,
    rating: data.rating,
    website: data.website,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
}

// Export the mock suppliers array used elsewhere
export { mockSuppliers } from "./supplier";
