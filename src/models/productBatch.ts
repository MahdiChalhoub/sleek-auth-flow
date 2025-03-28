// Export the ProductBatch interface so it can be imported by other files
export interface ProductBatch {
  id: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

export const createProductBatch = (data: Partial<ProductBatch>): ProductBatch => {
  return {
    id: data.id || '',
    productId: data.productId || '',
    batchNumber: data.batchNumber || '',
    quantity: data.quantity || 0,
    expiryDate: data.expiryDate || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
};

// Helper function to map database column names to interface property names
export const mapDbProductBatchToModel = (dbBatch: any): ProductBatch => {
  return {
    id: dbBatch.id,
    productId: dbBatch.product_id,
    batchNumber: dbBatch.batch_number,
    quantity: dbBatch.quantity,
    expiryDate: dbBatch.expiry_date,
    createdAt: dbBatch.created_at,
    updatedAt: dbBatch.updated_at
  };
};

// Helper function to map interface property names to database column names
export const mapModelProductBatchToDb = (batch: Partial<ProductBatch>): any => {
  return {
    id: batch.id,
    product_id: batch.productId,
    batch_number: batch.batchNumber,
    quantity: batch.quantity,
    expiry_date: batch.expiryDate,
    created_at: batch.createdAt,
    updated_at: batch.updatedAt
  };
};
