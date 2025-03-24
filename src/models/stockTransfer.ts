
export interface TransferItem {
  productId: string;
  productName: string;
  quantity: number;
  systemQuantity?: number;
  difference?: number;
}

export interface StockTransfer {
  id: string;
  date: string;
  source: string;
  destination: string;
  reason: string;
  status: "draft" | "sent" | "verified" | "cancelled";
  items: TransferItem[];
  notes?: string;
  createdBy: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

// Mock stock transfers data
export const mockStockTransfers: StockTransfer[] = [
  {
    id: "TR-2023-001",
    date: "2023-11-15",
    source: "Main Warehouse",
    destination: "Store Front",
    reason: "Regular Restock",
    status: "verified",
    items: [
      {
        productId: "1",
        productName: "iPhone 15 Pro",
        quantity: 5,
        systemQuantity: 5,
        difference: 0
      },
      {
        productId: "3",
        productName: "AirPods Pro 2",
        quantity: 10,
        systemQuantity: 10,
        difference: 0
      }
    ],
    notes: "Weekly store restock",
    createdBy: "John Admin",
    verifiedBy: "Mike Manager",
    verifiedDate: "2023-11-16"
  },
  {
    id: "TR-2023-002",
    date: "2023-11-20",
    source: "Main Warehouse",
    destination: "Store Front",
    reason: "Display Units",
    status: "sent",
    items: [
      {
        productId: "2",
        productName: "MacBook Air M3",
        quantity: 2,
        systemQuantity: 2,
        difference: 0
      },
      {
        productId: "5",
        productName: "iPad Pro 12.9\"",
        quantity: 2,
        systemQuantity: 2,
        difference: 0
      }
    ],
    notes: "Display units for front showcase",
    createdBy: "Mike Manager"
  },
  {
    id: "TR-2023-003",
    date: "2023-11-25",
    source: "Store Front",
    destination: "N/A",
    reason: "Damage",
    status: "verified",
    items: [
      {
        productId: "6",
        productName: "Sony WH-1000XM5",
        quantity: 1,
        systemQuantity: 1,
        difference: 0
      }
    ],
    notes: "Unit damaged during unpacking",
    createdBy: "Cathy Cashier",
    verifiedBy: "Mike Manager",
    verifiedDate: "2023-11-26"
  },
  {
    id: "TR-2023-004",
    date: "2023-12-01",
    source: "Main Warehouse",
    destination: "Online Fulfillment",
    reason: "Regular Restock",
    status: "draft",
    items: [
      {
        productId: "1",
        productName: "iPhone 15 Pro",
        quantity: 10
      },
      {
        productId: "4",
        productName: "Samsung Galaxy S24",
        quantity: 10
      }
    ],
    notes: "Stock for online orders - holiday season",
    createdBy: "John Admin"
  }
];
