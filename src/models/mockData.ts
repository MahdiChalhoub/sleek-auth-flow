
import { Product } from './interfaces/productInterfaces';
import { Supplier } from './interfaces/supplierInterfaces';
import { PurchaseOrder } from './interfaces/purchaseOrderInterfaces';

// Mock product data
export const mockProducts: Product[] = [
  {
    id: "prod-001",
    name: "Laptop",
    description: "High-performance laptop",
    price: 1299.99,
    cost: 899.99,
    stock: 15,
    barcode: "123456789012",
    image_url: "/images/laptop.jpg",
    category_id: "cat-001",
    hasStock: true,
    is_combo: false,
    min_stock_level: 5,
    max_stock_level: 30,
    category: { id: "cat-001", name: "Electronics" }
  },
  {
    id: "prod-002",
    name: "Smartphone",
    description: "Latest smartphone model",
    price: 899.99,
    cost: 599.99,
    stock: 25,
    barcode: "223456789012",
    image_url: "/images/smartphone.jpg",
    category_id: "cat-001",
    hasStock: true,
    is_combo: false,
    min_stock_level: 10,
    max_stock_level: 50,
    category: { id: "cat-001", name: "Electronics" }
  },
  {
    id: "prod-003",
    name: "Coffee Maker",
    description: "Automatic coffee machine",
    price: 149.99,
    cost: 89.99,
    stock: 8,
    barcode: "323456789012",
    image_url: "/images/coffeemaker.jpg",
    category_id: "cat-002",
    hasStock: true,
    is_combo: false,
    min_stock_level: 3,
    max_stock_level: 15,
    category: { id: "cat-002", name: "Home Appliances" }
  },
  {
    id: "prod-004",
    name: "Office Chair",
    description: "Ergonomic office chair",
    price: 249.99,
    cost: 149.99,
    stock: 12,
    barcode: "423456789012",
    image_url: "/images/chair.jpg",
    category_id: "cat-003",
    hasStock: true,
    is_combo: false,
    min_stock_level: 5,
    max_stock_level: 20,
    category: { id: "cat-003", name: "Furniture" }
  },
  {
    id: "prod-005",
    name: "Desk Lamp",
    description: "LED desk lamp",
    price: 49.99,
    cost: 24.99,
    stock: 20,
    barcode: "523456789012",
    image_url: "/images/lamp.jpg",
    category_id: "cat-003",
    hasStock: true,
    is_combo: false,
    min_stock_level: 8,
    max_stock_level: 30,
    category: { id: "cat-003", name: "Furniture" }
  }
];

// Mock suppliers data
export const mockSuppliers: Supplier[] = [
  {
    id: "sup-001",
    name: "TechSource Inc.",
    email: "contact@techsource.com",
    phone: "555-123-4567",
    address: "123 Tech Blvd, Silicon Valley, CA",
    contact_person: "John Smith",
    notes: "Reliable electronics supplier",
    products: ["prod-001", "prod-002"]
  },
  {
    id: "sup-002",
    name: "HomeGoods Supply",
    email: "orders@homegoods.com",
    phone: "555-987-6543",
    address: "456 Home St, Furnishville, NY",
    contact_person: "Mary Johnson",
    notes: "Home goods and appliances supplier",
    products: ["prod-003", "prod-004", "prod-005"]
  }
];

// Mock purchase orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-001",
    supplier: mockSuppliers[0],
    status: "completed",
    total_amount: 5999.95,
    created_at: "2023-05-15T09:30:00Z",
    updated_at: "2023-05-16T14:20:00Z",
    items: [
      {
        id: "poi-001",
        productId: "prod-001",
        productName: "Laptop",
        quantity: 5,
        unitCost: 899.99,
        totalCost: 4499.95,
        batch: "BATCH-L2023-05",
        expirationDate: "2025-05-15T00:00:00Z"
      },
      {
        id: "poi-002",
        productId: "prod-002",
        productName: "Smartphone",
        quantity: 3,
        unitCost: 500.00,
        totalCost: 1500.00,
        batch: "BATCH-S2023-05",
        expirationDate: null
      }
    ]
  },
  {
    id: "po-002",
    supplier: mockSuppliers[1],
    status: "pending",
    total_amount: 1349.85,
    created_at: "2023-06-01T10:15:00Z",
    updated_at: "2023-06-01T10:15:00Z",
    items: [
      {
        id: "poi-003",
        productId: "prod-003",
        productName: "Coffee Maker",
        quantity: 5,
        unitCost: 89.99,
        totalCost: 449.95,
        batch: null,
        expirationDate: null
      },
      {
        id: "poi-004",
        productId: "prod-004",
        productName: "Office Chair",
        quantity: 6,
        unitCost: 149.99,
        totalCost: 899.94,
        batch: null,
        expirationDate: null
      }
    ]
  }
];
