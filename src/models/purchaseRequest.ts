
import { v4 as uuidv4 } from 'uuid';
import { Product } from './product';
import { Supplier } from './supplier';

export type PurchaseRequestMethod = 
  | 'scan' 
  | 'manual' 
  | 'ai_suggestion' 
  | 'sales_based' 
  | 'expiry_alert'
  | 'transfer_suggestion';

export type PurchaseRequestStatus = 
  | 'requested' 
  | 'ordered' 
  | 'delivered' 
  | 'failed' 
  | 'reorder_after_fail' 
  | 'success';

export type PurchaseRequestActionType = 
  | 'purchase_order' 
  | 'stock_transfer' 
  | 'ignore' 
  | 'promotion';

export interface PurchaseRequest {
  id: string;
  productId: string;
  productName: string;
  barcode?: string;
  requestedQuantity: number;
  method: PurchaseRequestMethod;
  sourceLocationId?: string;
  sourceLocation?: string;
  destinationLocationId?: string;
  destinationLocation?: string;
  expiryReason?: string;
  notes?: string;
  status: PurchaseRequestStatus;
  suggestedSupplierId?: string;
  suggestedSupplier?: string;
  actionType?: PurchaseRequestActionType;
  userId?: string;
  userName?: string;
  requestDate: string;
  lastUpdated: string;
  purchaseOrderId?: string;
  transferId?: string;
  product?: Product;
  suppliers?: { 
    supplierId: string;
    supplierName: string;
    lastPrice?: number;
    lastDeliveryDate?: string;
  }[];
}

export const createPurchaseRequest = (data: Partial<PurchaseRequest>): PurchaseRequest => {
  const now = new Date().toISOString();
  
  return {
    id: data.id || uuidv4(),
    productId: data.productId || '',
    productName: data.productName || '',
    barcode: data.barcode,
    requestedQuantity: data.requestedQuantity || 1,
    method: data.method || 'manual',
    sourceLocationId: data.sourceLocationId,
    sourceLocation: data.sourceLocation,
    destinationLocationId: data.destinationLocationId,
    destinationLocation: data.destinationLocation,
    expiryReason: data.expiryReason,
    notes: data.notes,
    status: data.status || 'requested',
    suggestedSupplierId: data.suggestedSupplierId,
    suggestedSupplier: data.suggestedSupplier,
    actionType: data.actionType,
    userId: data.userId,
    userName: data.userName,
    requestDate: data.requestDate || now,
    lastUpdated: data.lastUpdated || now,
    purchaseOrderId: data.purchaseOrderId,
    transferId: data.transferId,
    product: data.product,
    suppliers: data.suppliers || []
  };
};

// Mock data for purchase requests
export const mockPurchaseRequests: PurchaseRequest[] = [
  createPurchaseRequest({
    id: 'req-001',
    productId: '1',
    productName: 'iPhone 15 Pro',
    barcode: 'IPHONE15PRO',
    requestedQuantity: 5,
    method: 'scan',
    sourceLocationId: 'branch-3',
    sourceLocation: 'Main Warehouse',
    destinationLocationId: 'branch-1',
    destinationLocation: 'Store Front',
    status: 'requested',
    userId: 'user-admin',
    userName: 'John Admin',
    notes: 'Low stock on shelf',
    suppliers: [
      { supplierId: 'SUP-001', supplierName: 'Apple Inc.', lastPrice: 799.99, lastDeliveryDate: '2023-11-10' }
    ]
  }),
  createPurchaseRequest({
    id: 'req-002',
    productId: '4',
    productName: 'Samsung Galaxy S24',
    barcode: 'SAMSUNGS24',
    requestedQuantity: 10,
    method: 'sales_based',
    destinationLocationId: 'branch-1',
    destinationLocation: 'Store Front',
    status: 'ordered',
    purchaseOrderId: 'PO-2023-002',
    userId: 'user-manager',
    userName: 'Mike Manager',
    notes: 'High demand in last week',
    suppliers: [
      { supplierId: 'SUP-002', supplierName: 'Samsung Electronics', lastPrice: 699.99, lastDeliveryDate: '2023-11-15' }
    ]
  }),
  createPurchaseRequest({
    id: 'req-003',
    productId: '7',
    productName: 'Organic Avocado',
    barcode: 'ORGAVOCADO',
    requestedQuantity: 50,
    method: 'expiry_alert',
    destinationLocationId: 'branch-2',
    destinationLocation: 'Downtown Store',
    status: 'requested',
    expiryReason: 'Current batch expiring in 3 days',
    userId: 'user-admin',
    userName: 'John Admin',
    notes: 'Need fresh batch',
    suppliers: [
      { supplierId: 'SUP-004', supplierName: 'Organic Farms Co.', lastPrice: 1.99, lastDeliveryDate: '2023-12-01' }
    ]
  }),
  createPurchaseRequest({
    id: 'req-004',
    productId: '6',
    productName: 'Sony WH-1000XM5',
    barcode: 'SONYWH1000XM5',
    requestedQuantity: 3,
    method: 'transfer_suggestion',
    sourceLocationId: 'branch-3',
    sourceLocation: 'Main Warehouse',
    destinationLocationId: 'branch-2',
    destinationLocation: 'Downtown Store',
    status: 'requested',
    actionType: 'stock_transfer',
    userId: 'user-cashier',
    userName: 'Cathy Cashier',
    notes: 'Product available in Main Warehouse'
  })
];
