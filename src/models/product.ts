
export interface LocationStock {
  locationId: string;
  locationName: string;
  stock: number;
  minStockLevel?: number;
  maxStockLevel?: number;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  description: string;
  sku: string;
  price: number;
  cost?: number;
  category: string;
  brand?: string;
  stock: number;
  image?: string;
  tax?: number;
  locationStock?: LocationStock[];
  isActive: boolean;
  variations?: Variation[];
}

export interface Variation {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: VariationAttribute[];
}

export interface VariationAttribute {
  name: string;
  value: string;
}

// Mock products data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    barcode: "123456789012",
    description: "Latest iPhone model with advanced features",
    sku: "PHONE-001",
    price: 999.99,
    cost: 700,
    category: "phones",
    brand: "Apple",
    stock: 25,
    image: "https://placehold.co/300x300.png?text=iPhone+15",
    tax: 10,
    isActive: true,
    locationStock: [
      { locationId: "branch-1", locationName: "Downtown Store", stock: 10, minStockLevel: 5 },
      { locationId: "branch-3", locationName: "Main Warehouse", stock: 15, minStockLevel: 10 }
    ]
  },
  {
    id: "2",
    name: "MacBook Air M3",
    barcode: "223456789012",
    description: "Ultra-thin laptop with M3 chip",
    sku: "LAPTOP-001",
    price: 1299.99,
    cost: 900,
    category: "laptops",
    brand: "Apple",
    stock: 15,
    image: "https://placehold.co/300x300.png?text=MacBook+Air",
    tax: 10,
    isActive: true,
    locationStock: [
      { locationId: "branch-1", locationName: "Downtown Store", stock: 5, minStockLevel: 2 },
      { locationId: "branch-3", locationName: "Main Warehouse", stock: 10, minStockLevel: 8 }
    ]
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    barcode: "323456789012",
    description: "Wireless earbuds with noise cancellation",
    sku: "AUDIO-001",
    price: 249.99,
    cost: 150,
    category: "audio",
    brand: "Apple",
    stock: 30,
    image: "https://placehold.co/300x300.png?text=AirPods+Pro",
    tax: 10,
    isActive: true,
    locationStock: [
      { locationId: "branch-1", locationName: "Downtown Store", stock: 20, minStockLevel: 10 },
      { locationId: "branch-2", locationName: "Midtown Pickup Point", stock: 5, minStockLevel: 5 },
      { locationId: "branch-3", locationName: "Main Warehouse", stock: 5, minStockLevel: 15 }
    ]
  },
  {
    id: "4",
    name: "Samsung Galaxy S24",
    barcode: "423456789012",
    description: "Latest Samsung flagship smartphone",
    sku: "PHONE-002",
    price: 899.99,
    cost: 650,
    category: "phones",
    brand: "Samsung",
    stock: 20,
    image: "https://placehold.co/300x300.png?text=Galaxy+S24",
    tax: 10,
    isActive: true,
    locationStock: [
      { locationId: "branch-1", locationName: "Downtown Store", stock: 8, minStockLevel: 5 },
      { locationId: "branch-3", locationName: "Main Warehouse", stock: 12, minStockLevel: 10 }
    ]
  },
  {
    id: "5",
    name: "iPad Pro 12.9\"",
    barcode: "523456789012",
    description: "Professional tablet with M2 chip",
    sku: "TABLET-001",
    price: 1099.99,
    cost: 750,
    category: "tablets",
    brand: "Apple",
    stock: 18,
    image: "https://placehold.co/300x300.png?text=iPad+Pro",
    tax: 10,
    isActive: true,
    locationStock: [
      { locationId: "branch-1", locationName: "Downtown Store", stock: 8, minStockLevel: 5 },
      { locationId: "branch-3", locationName: "Main Warehouse", stock: 10, minStockLevel: 8 }
    ]
  },
  {
    id: "6",
    name: "Sony WH-1000XM5",
    barcode: "623456789012",
    description: "Premium noise cancelling headphones",
    sku: "AUDIO-002",
    price: 349.99,
    cost: 200,
    category: "audio",
    brand: "Sony",
    stock: 12,
    image: "https://placehold.co/300x300.png?text=Sony+Headphones",
    tax: 10,
    isActive: true,
    locationStock: [
      { locationId: "branch-1", locationName: "Downtown Store", stock: 4, minStockLevel: 2 },
      { locationId: "branch-2", locationName: "Midtown Pickup Point", stock: 3, minStockLevel: 2 },
      { locationId: "branch-3", locationName: "Main Warehouse", stock: 5, minStockLevel: 4 }
    ]
  },
  {
    id: "7",
    name: "Samsung 55\" QLED TV",
    barcode: "723456789012",
    description: "4K Smart TV with Quantum Dot technology",
    sku: "TV-001",
    price: 799.99,
    cost: 550,
    category: "electronics",
    brand: "Samsung",
    stock: 8,
    image: "https://placehold.co/300x300.png?text=Samsung+TV",
    tax: 10,
    isActive: true,
    locationStock: [
      { locationId: "branch-1", locationName: "Downtown Store", stock: 2, minStockLevel: 2 },
      { locationId: "branch-3", locationName: "Main Warehouse", stock: 6, minStockLevel: 4 }
    ]
  },
  {
    id: "8",
    name: "Nintendo Switch OLED",
    barcode: "823456789012",
    description: "Gaming console with OLED display",
    sku: "GAME-001",
    price: 349.99,
    cost: 250,
    category: "gaming",
    brand: "Nintendo",
    stock: 10,
    image: "https://placehold.co/300x300.png?text=Nintendo+Switch",
    tax: 10,
    isActive: true,
    locationStock: [
      { locationId: "branch-1", locationName: "Downtown Store", stock: 5, minStockLevel: 3 },
      { locationId: "branch-3", locationName: "Main Warehouse", stock: 5, minStockLevel: 5 }
    ]
  },
  {
    id: "9",
    name: "Dyson V15 Detect",
    barcode: "923456789012",
    description: "Cordless vacuum with laser detection",
    sku: "HOME-001",
    price: 699.99,
    cost: 450,
    category: "appliances",
    brand: "Dyson",
    stock: 5,
    image: "https://placehold.co/300x300.png?text=Dyson+Vacuum",
    tax: 10,
    isActive: true,
    locationStock: [
      { locationId: "branch-1", locationName: "Downtown Store", stock: 2, minStockLevel: 1 },
      { locationId: "branch-3", locationName: "Main Warehouse", stock: 3, minStockLevel: 2 }
    ]
  },
  {
    id: "10",
    name: "Canon EOS R6",
    barcode: "023456789012",
    description: "Full-frame mirrorless camera",
    sku: "CAMERA-001",
    price: 2499.99,
    cost: 1800,
    category: "cameras",
    brand: "Canon",
    stock: 3,
    image: "https://placehold.co/300x300.png?text=Canon+Camera",
    tax: 10,
    isActive: true,
    locationStock: [
      { locationId: "branch-1", locationName: "Downtown Store", stock: 1, minStockLevel: 1 },
      { locationId: "branch-3", locationName: "Main Warehouse", stock: 2, minStockLevel: 2 }
    ]
  }
];
