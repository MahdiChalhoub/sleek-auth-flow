
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
