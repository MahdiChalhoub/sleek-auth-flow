
import { Product } from "@/models/product";
import { Client } from "@/models/client";
import { Supplier } from "@/models/supplier";

export type ReturnStatus = "draft" | "approved" | "rejected" | "finalized";
export type ReturnReason = "damaged" | "defective" | "wrong_item" | "customer_unsatisfied" | "expired" | "wrong_delivery";
export type RefundMethod = "cash" | "credit" | "replace" | "deduct_next_po";

export interface ReturnItemBase {
  productId: string;
  productName: string;
  returnQuantity: number;
  unitPrice: number;
  subtotal: number;
  reason: ReturnReason;
  notes?: string;
}

export interface SalesReturnItem extends ReturnItemBase {
  originalQuantity: number;
  returnToStock: boolean;
  refundMethod: "refund" | "credit" | "replace";
}

export interface PurchaseReturnItem extends ReturnItemBase {
  batchCode?: string;
  expiryDate?: string;
  refundMethod: "cash" | "credit_note" | "deduct_next_po";
}

export interface ReturnBase {
  id: string;
  date: string;
  status: ReturnStatus;
  totalAmount: number;
  notes?: string;
  createdBy: string;
  lastUpdated: string;
}

export interface SalesReturn extends ReturnBase {
  type: "sales";
  invoiceId: string;
  clientId: string;
  clientName: string;
  items: SalesReturnItem[];
  refundAmount: number;
  creditAmount: number;
}

export interface PurchaseReturn extends ReturnBase {
  type: "purchase";
  purchaseOrderId: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseReturnItem[];
  refundAmount: number;
}

// Mock sales returns data
export const mockSalesReturns: SalesReturn[] = [
  {
    id: "SR-001",
    type: "sales",
    date: "2023-11-15",
    invoiceId: "INV-2023-456",
    clientId: "1",
    clientName: "John Doe",
    items: [
      {
        productId: "4",
        productName: "Samsung Galaxy S24",
        originalQuantity: 1,
        returnQuantity: 1,
        unitPrice: 899.99,
        subtotal: 899.99,
        reason: "defective",
        returnToStock: false,
        refundMethod: "refund",
        notes: "Phone screen had dead pixels"
      }
    ],
    status: "finalized",
    totalAmount: 899.99,
    refundAmount: 899.99,
    creditAmount: 0,
    notes: "Customer requested full refund",
    createdBy: "Mike Manager",
    lastUpdated: "2023-11-16"
  },
  {
    id: "SR-002",
    type: "sales",
    date: "2023-11-20",
    invoiceId: "INV-2023-472",
    clientId: "3",
    clientName: "Bob Johnson",
    items: [
      {
        productId: "3",
        productName: "AirPods Pro 2",
        originalQuantity: 2,
        returnQuantity: 1,
        unitPrice: 249.99,
        subtotal: 249.99,
        reason: "wrong_item",
        returnToStock: true,
        refundMethod: "replace",
        notes: "Customer wanted different color"
      }
    ],
    status: "approved",
    totalAmount: 249.99,
    refundAmount: 0,
    creditAmount: 249.99,
    notes: "Replaced with black color model",
    createdBy: "Cathy Cashier",
    lastUpdated: "2023-11-21"
  },
  {
    id: "SR-003",
    type: "sales",
    date: "2023-12-05",
    invoiceId: "INV-2023-513",
    clientId: "2",
    clientName: "Jane Smith",
    items: [
      {
        productId: "12",
        productName: "Non-Stick Pan",
        originalQuantity: 1,
        returnQuantity: 1,
        unitPrice: 39.99,
        subtotal: 39.99,
        reason: "customer_unsatisfied",
        returnToStock: true,
        refundMethod: "refund",
        notes: "Customer not satisfied with quality"
      },
      {
        productId: "14",
        productName: "Throw Pillow",
        originalQuantity: 3,
        returnQuantity: 2,
        unitPrice: 24.99,
        subtotal: 49.98,
        reason: "customer_unsatisfied",
        returnToStock: true,
        refundMethod: "refund",
        notes: "Color didn't match customer's furniture"
      }
    ],
    status: "draft",
    totalAmount: 89.97,
    refundAmount: 89.97,
    creditAmount: 0,
    notes: "Customer wants to return multiple items",
    createdBy: "Cathy Cashier",
    lastUpdated: "2023-12-05"
  }
];

// Mock purchase returns data
export const mockPurchaseReturns: PurchaseReturn[] = [
  {
    id: "PR-001",
    type: "purchase",
    date: "2023-11-18",
    purchaseOrderId: "PO-2023-002",
    supplierId: "SUP-002",
    supplierName: "Samsung Electronics",
    items: [
      {
        productId: "4",
        productName: "Samsung Galaxy S24",
        returnQuantity: 2,
        unitPrice: 699.99,
        subtotal: 1399.98,
        reason: "defective",
        batchCode: "SM-S24-B12",
        refundMethod: "credit_note",
        notes: "Two units had screen defects"
      }
    ],
    status: "finalized",
    totalAmount: 1399.98,
    refundAmount: 1399.98,
    notes: "Supplier issued credit note",
    createdBy: "Mike Manager",
    lastUpdated: "2023-11-20"
  },
  {
    id: "PR-002",
    type: "purchase",
    date: "2023-12-02",
    purchaseOrderId: "PO-2023-003",
    supplierId: "SUP-004",
    supplierName: "Organic Farms Co.",
    items: [
      {
        productId: "7",
        productName: "Organic Avocado",
        returnQuantity: 25,
        unitPrice: 1.99,
        subtotal: 49.75,
        reason: "expired",
        batchCode: "B12345",
        expiryDate: "2023-12-01",
        refundMethod: "cash",
        notes: "Product already expired upon delivery"
      }
    ],
    status: "approved",
    totalAmount: 49.75,
    refundAmount: 49.75,
    notes: "Supplier agreed to refund expired product",
    createdBy: "John Admin",
    lastUpdated: "2023-12-03"
  },
  {
    id: "PR-003",
    type: "purchase",
    date: "2023-12-06",
    purchaseOrderId: "PO-2023-004",
    supplierId: "SUP-003",
    supplierName: "Sony Electronics",
    items: [
      {
        productId: "6",
        productName: "Sony WH-1000XM5",
        returnQuantity: 1,
        unitPrice: 249.99,
        subtotal: 249.99,
        reason: "wrong_delivery",
        refundMethod: "deduct_next_po",
        notes: "Received XM4 model instead of XM5"
      }
    ],
    status: "draft",
    totalAmount: 249.99,
    refundAmount: 249.99,
    notes: "Pending supplier response",
    createdBy: "Mike Manager",
    lastUpdated: "2023-12-06"
  }
];
