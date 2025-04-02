
// Export the ProductBatch interface so it can be imported by other files
export interface ProductBatch {
  id: string;
  product_id: string;
  productId?: string; // Alternative property name for consistency
  batch_number: string;
  batchNumber?: string; // Alternative property name for consistency
  quantity: number;
  expiry_date: string;
  expiryDate?: string; // Alternative property name for consistency
  purchase_date: string;
  cost_per_unit: number;
  notes?: string;
  created_at: string;
  createdAt?: string; // Alternative property name for consistency
  updated_at: string;
  updatedAt?: string; // Alternative property name for consistency
  product?: any;
  status: 'active' | 'expired' | 'low' | 'consumed';
  productName?: string; // For display purposes
}

export const createProductBatch = (data: Partial<ProductBatch>): ProductBatch => {
  return {
    id: data.id || '',
    product_id: data.product_id || data.productId || '',
    batch_number: data.batch_number || data.batchNumber || '',
    quantity: data.quantity || 0,
    expiry_date: data.expiry_date || data.expiryDate || '',
    purchase_date: data.purchase_date || new Date().toISOString(),
    cost_per_unit: data.cost_per_unit || 0,
    notes: data.notes || '',
    created_at: data.created_at || data.createdAt || new Date().toISOString(),
    updated_at: data.updated_at || data.updatedAt || new Date().toISOString(),
    status: data.status || 'active',
    productName: data.productName || ''
  };
};

// Helper function to map database column names to interface property names
export const mapDbProductBatchToModel = (dbBatch: any): ProductBatch => {
  if (!dbBatch) return createProductBatch({});
  
  return {
    id: dbBatch.id,
    product_id: dbBatch.product_id,
    productId: dbBatch.product_id, // Add alternative property
    batch_number: dbBatch.batch_number,
    batchNumber: dbBatch.batch_number, // Add alternative property
    quantity: dbBatch.quantity,
    expiry_date: dbBatch.expiry_date,
    expiryDate: dbBatch.expiry_date, // Add alternative property
    purchase_date: dbBatch.purchase_date || new Date().toISOString(),
    cost_per_unit: dbBatch.cost_per_unit || 0,
    notes: dbBatch.notes || '',
    created_at: dbBatch.created_at,
    createdAt: dbBatch.created_at, // Add alternative property
    updated_at: dbBatch.updated_at,
    updatedAt: dbBatch.updated_at, // Add alternative property
    status: dbBatch.status || 'active',
    productName: dbBatch.product_name || ''
  };
};

// Helper function to map interface property names to database column names
export const mapModelProductBatchToDb = (batch: Partial<ProductBatch>): any => {
  return {
    id: batch.id,
    product_id: batch.product_id || batch.productId,
    batch_number: batch.batch_number || batch.batchNumber,
    quantity: batch.quantity,
    expiry_date: batch.expiry_date || batch.expiryDate,
    purchase_date: batch.purchase_date,
    cost_per_unit: batch.cost_per_unit,
    notes: batch.notes,
    created_at: batch.created_at || batch.createdAt,
    updated_at: batch.updated_at || batch.updatedAt,
    status: batch.status
  };
};
