
import { Supplier } from "@/models/supplier";
import { Product } from "@/models/product";

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  batch?: string;
  expirationDate?: string;
}

export interface PurchaseOrder {
  id: string;
  supplier: {
    id: string;
    name: string;
  };
  dateCreated: string;
  expectedDelivery: string;
  status: "draft" | "sent" | "received" | "completed" | "cancelled";
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalValue: number;
  notes?: string;
  paymentTerms?: string;
  createdBy?: string;
  updatedBy?: string;
  lastUpdated?: string;
}

// Mock purchase orders data
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-2023-001",
    supplier: {
      id: "SUP-001",
      name: "Apple Inc."
    },
    dateCreated: "2023-11-10",
    expectedDelivery: "2023-11-25",
    status: "completed",
    items: [
      {
        productId: "1",
        productName: "iPhone 15 Pro",
        quantity: 10,
        unitCost: 799.99,
        subtotal: 7999.90,
        tax: 799.99,
        total: 8799.89
      },
      {
        productId: "2",
        productName: "MacBook Air M3",
        quantity: 5,
        unitCost: 999.99,
        subtotal: 4999.95,
        tax: 499.99,
        total: 5499.94
      }
    ],
    subtotal: 12999.85,
    tax: 1299.98,
    discount: 0,
    totalValue: 14299.83,
    notes: "Regular quarterly stock replenishment",
    paymentTerms: "Net 30",
    createdBy: "John Admin",
    lastUpdated: "2023-11-26"
  },
  {
    id: "PO-2023-002",
    supplier: {
      id: "SUP-002",
      name: "Samsung Electronics"
    },
    dateCreated: "2023-11-15",
    expectedDelivery: "2023-11-30",
    status: "received",
    items: [
      {
        productId: "4",
        productName: "Samsung Galaxy S24",
        quantity: 15,
        unitCost: 699.99,
        subtotal: 10499.85,
        tax: 1049.98,
        total: 11549.83
      }
    ],
    subtotal: 10499.85,
    tax: 1049.98,
    discount: 500,
    totalValue: 11049.83,
    notes: "Bulk order discount applied",
    paymentTerms: "Net 45",
    createdBy: "Mike Manager",
    lastUpdated: "2023-11-29"
  },
  {
    id: "PO-2023-003",
    supplier: {
      id: "SUP-004",
      name: "Organic Farms Co."
    },
    dateCreated: "2023-12-01",
    expectedDelivery: "2023-12-05",
    status: "sent",
    items: [
      {
        productId: "7",
        productName: "Organic Avocado",
        quantity: 100,
        unitCost: 1.99,
        subtotal: 199.00,
        tax: 19.90,
        total: 218.90,
        batch: "B12345",
        expirationDate: "2023-12-15"
      }
    ],
    subtotal: 199.00,
    tax: 19.90,
    discount: 0,
    totalValue: 218.90,
    notes: "Weekly produce order",
    paymentTerms: "Net 15",
    createdBy: "Cathy Cashier",
    lastUpdated: "2023-12-01"
  },
  {
    id: "PO-2023-004",
    supplier: {
      id: "SUP-003",
      name: "Sony Electronics"
    },
    dateCreated: "2023-12-05",
    expectedDelivery: "2023-12-20",
    status: "draft",
    items: [
      {
        productId: "6",
        productName: "Sony WH-1000XM5",
        quantity: 8,
        unitCost: 249.99,
        subtotal: 1999.92,
        tax: 199.99,
        total: 2199.91
      }
    ],
    subtotal: 1999.92,
    tax: 199.99,
    discount: 0,
    totalValue: 2199.91,
    notes: "Holiday season stock preparation",
    paymentTerms: "Net 30",
    createdBy: "Mike Manager",
    lastUpdated: "2023-12-05"
  }
];
