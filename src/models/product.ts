export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost?: number;
  stock: number;
  image?: string;
  barcode: string;
  locationStock?: {
    locationId: string;
    stock: number;
    minStockLevel?: number;
  }[];
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    description: "The latest iPhone with advanced features.",
    category: "mobile",
    price: 1299.00,
    cost: 900,
    stock: 50,
    image: "https://example.com/iphone15pro.jpg",
    barcode: "1234567890123",
    locationStock: [
      { locationId: "branch-1", stock: 20, minStockLevel: 5 },
      { locationId: "branch-2", stock: 15, minStockLevel: 5 },
      { locationId: "branch-3", stock: 15, minStockLevel: 5 }
    ]
  },
  {
    id: "2",
    name: "MacBook Air M3",
    description: "The thinnest, lightest MacBook with the M3 chip.",
    category: "electronics",
    price: 1099.00,
    cost: 700,
    stock: 30,
    image: "https://example.com/macbookairm3.jpg",
    barcode: "2345678901234",
    locationStock: [
      { locationId: "branch-1", stock: 10, minStockLevel: 3 },
      { locationId: "branch-2", stock: 10, minStockLevel: 3 },
      { locationId: "branch-3", stock: 10, minStockLevel: 3 }
    ]
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    description: "The ultimate wireless earbuds with noise cancellation.",
    category: "electronics",
    price: 249.00,
    cost: 150,
    stock: 100,
    image: "https://example.com/airpodspro2.jpg",
    barcode: "3456789012345",
    locationStock: [
      { locationId: "branch-1", stock: 30, minStockLevel: 10 },
      { locationId: "branch-2", stock: 35, minStockLevel: 10 },
      { locationId: "branch-3", stock: 35, minStockLevel: 10 }
    ]
  },
  {
    id: "4",
    name: "Samsung Galaxy S24",
    description: "The latest Samsung phone with a great camera.",
    category: "mobile",
    price: 999.00,
    cost: 650,
    stock: 40,
    image: "https://example.com/galaxys24.jpg",
    barcode: "4567890123456",
    locationStock: [
      { locationId: "branch-1", stock: 15, minStockLevel: 5 },
      { locationId: "branch-2", stock: 10, minStockLevel: 5 },
      { locationId: "branch-3", stock: 15, minStockLevel: 5 }
    ]
  },
  {
    id: "5",
    name: "iPad Pro 12.9\"",
    description: "The most advanced iPad with the M2 chip.",
    category: "electronics",
    price: 1199.00,
    cost: 800,
    stock: 25,
    image: "https://example.com/ipadpro129.jpg",
    barcode: "5678901234567",
    locationStock: [
      { locationId: "branch-1", stock: 8, minStockLevel: 3 },
      { locationId: "branch-2", stock: 7, minStockLevel: 3 },
      { locationId: "branch-3", stock: 10, minStockLevel: 3 }
    ]
  },
  {
    id: "6",
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones.",
    category: "electronics",
    price: 399.00,
    cost: 250,
    stock: 60,
    image: "https://example.com/sonywh1000xm5.jpg",
    barcode: "6789012345678",
    locationStock: [
      { locationId: "branch-1", stock: 20, minStockLevel: 8 },
      { locationId: "branch-2", stock: 20, minStockLevel: 8 },
      { locationId: "branch-3", stock: 20, minStockLevel: 8 }
    ]
  },
  {
    id: "7",
    name: "Bose SoundLink Revolve+",
    description: "Portable Bluetooth speaker with 360° sound.",
    category: "electronics",
    price: 329.00,
    cost: 200,
    stock: 45,
    image: "https://example.com/bosesoundlink.jpg",
    barcode: "7890123456789",
    locationStock: [
      { locationId: "branch-1", stock: 15, minStockLevel: 5 },
      { locationId: "branch-2", stock: 15, minStockLevel: 5 },
      { locationId: "branch-3", stock: 15, minStockLevel: 5 }
    ]
  },
  {
    id: "8",
    name: "Apple Watch Series 9",
    description: "The latest Apple Watch with advanced health features.",
    category: "electronics",
    price: 499.00,
    cost: 300,
    stock: 35,
    image: "https://example.com/applewatchseries9.jpg",
    barcode: "8901234567890",
    locationStock: [
      { locationId: "branch-1", stock: 10, minStockLevel: 3 },
      { locationId: "branch-2", stock: 10, minStockLevel: 3 },
      { locationId: "branch-3", stock: 15, minStockLevel: 3 }
    ]
  },
  {
    id: "9",
    name: "DJI Mavic 3 Pro",
    description: "Professional drone with triple-camera system.",
    category: "electronics",
    price: 2199.00,
    cost: 1500,
    stock: 10,
    image: "https://example.com/djimavic3pro.jpg",
    barcode: "9012345678901",
    locationStock: [
      { locationId: "branch-1", stock: 3, minStockLevel: 1 },
      { locationId: "branch-2", stock: 3, minStockLevel: 1 },
      { locationId: "branch-3", stock: 4, minStockLevel: 1 }
    ]
  },
  {
    id: "10",
    name: "LG OLED C3 65\"",
    description: "The best OLED TV with stunning picture quality.",
    category: "electronics",
    price: 1799.00,
    cost: 1200,
    stock: 15,
    image: "https://example.com/lgolegc3.jpg",
    barcode: "0123456789012",
    locationStock: [
      { locationId: "branch-1", stock: 5, minStockLevel: 2 },
      { locationId: "branch-2", stock: 5, minStockLevel: 2 },
      { locationId: "branch-3", stock: 5, minStockLevel: 2 }
    ]
  }
];

// Add ComboComponent interface
export interface ComboComponent {
  productId: string;
  quantity: number;
  product?: Product;
}

// Update Product interface to include isCombo property
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost?: number;
  stock: number;
  image?: string;
  barcode: string;
  locationStock?: {
    locationId: string;
    stock: number;
    minStockLevel?: number;
  }[];
  isCombo?: boolean;
  comboComponents?: ComboComponent[];
  hasStock?: boolean;
}
