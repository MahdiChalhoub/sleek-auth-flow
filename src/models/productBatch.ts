
// Import required dependencies
import { format, parseISO } from 'date-fns';

// Define the ProductBatch interface
export interface ProductBatch {
  id: string;
  product_id: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  purchase_date: string;
  cost_per_unit: number;
  created_at: string;
  updated_at: string;
  status: string;
  productName?: string; // Optional field for UI display
}

// Helper function to create a new ProductBatch
export function createProductBatch(
  productId: string,
  batchNumber: string,
  quantity: number,
  expiryDate: string
): Omit<ProductBatch, "id"> {
  const now = new Date().toISOString();
  
  return {
    product_id: productId,
    batch_number: batchNumber,
    quantity: quantity,
    expiry_date: expiryDate,
    purchase_date: now,
    cost_per_unit: 0,
    created_at: now,
    updated_at: now,
    status: 'active'
  };
}

// Mapper function to convert database object to model
export function mapDbProductBatchToModel(dbBatch: any): ProductBatch {
  return {
    id: dbBatch.id,
    product_id: dbBatch.product_id,
    batch_number: dbBatch.batch_number,
    quantity: dbBatch.quantity,
    expiry_date: dbBatch.expiry_date,
    purchase_date: dbBatch.purchase_date,
    cost_per_unit: dbBatch.cost_per_unit || 0,
    created_at: dbBatch.created_at,
    updated_at: dbBatch.updated_at,
    status: dbBatch.status || 'active',
    productName: dbBatch.product_name
  };
}

// Mapper function to convert model to database object
export function mapModelProductBatchToDb(modelBatch: Omit<ProductBatch, "id">): any {
  return {
    product_id: modelBatch.product_id,
    batch_number: modelBatch.batch_number,
    quantity: modelBatch.quantity,
    expiry_date: modelBatch.expiry_date,
    purchase_date: modelBatch.purchase_date,
    cost_per_unit: modelBatch.cost_per_unit,
    status: modelBatch.status,
    created_at: modelBatch.created_at,
    updated_at: modelBatch.updated_at
  };
}
