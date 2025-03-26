
// Basic interfaces
export interface ProductBase {
  id: string;
  name: string;
  description?: string;
  barcode: string;
  price: number;
  cost: number;
  stock: number;
  categoryId?: string;
  category?: string; // Adding category for backward compatibility
  imageUrl?: string;
  image?: string; // Adding image for backward compatibility
  createdAt: string;
  updatedAt: string;
}

// Extended product interfaces
export interface Product extends ProductBase {
  isCombo?: boolean;
  hasStock: boolean;
  locationStock?: ProductLocationStock[]; // Adding locationStock for compatibility
}

export interface ComboProduct extends Product {
  isCombo: true;
  components: ComboComponent[];
}

export interface ComboComponent {
  id: string;
  comboProductId: string;
  componentProductId: string; // Use this for referencing products
  productId?: string; // Adding for backward compatibility with existing code
  quantity: number;
  product?: Product; // Reference to the full product
  createdAt: string;
  updatedAt: string;
}

// Stock and inventory management
export interface ProductLocationStock {
  id: string;
  productId: string;
  locationId: string;
  stock: number;
  minStockLevel: number;
  createdAt: string;
  updatedAt: string;
}

// Batch management for expiration dates
export interface ProductBatch {
  id: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  createdAt: string;
}

// Mock data for demo purposes
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Lait Entier 1L",
    description: "Lait entier de haute qualité",
    barcode: "3760001234567",
    price: 1.2,
    cost: 0.8,
    stock: 45,
    categoryId: "dairy",
    category: "dairy", // Adding category for compatibility
    imageUrl: "https://example.com/milk.jpg",
    image: "https://example.com/milk.jpg", // Adding image for compatibility
    createdAt: "2023-01-15T08:00:00Z",
    updatedAt: "2023-01-15T08:00:00Z",
    hasStock: true
  },
  {
    id: "2",
    name: "Pain de campagne",
    description: "Pain traditionnel de campagne",
    barcode: "3760001234568",
    price: 2.5,
    cost: 1.2,
    stock: 20,
    categoryId: "bakery",
    category: "bakery",
    imageUrl: "https://example.com/bread.jpg",
    image: "https://example.com/bread.jpg",
    createdAt: "2023-01-15T08:05:00Z",
    updatedAt: "2023-01-15T08:05:00Z",
    hasStock: true
  },
  {
    id: "3",
    name: "Bananes Bio (kg)",
    description: "Bananes biologiques en provenance d'Équateur",
    barcode: "3760001234569",
    price: 2.99,
    cost: 1.75,
    stock: 30,
    categoryId: "produce",
    category: "produce",
    imageUrl: "https://example.com/bananas.jpg",
    image: "https://example.com/bananas.jpg",
    createdAt: "2023-01-15T08:10:00Z",
    updatedAt: "2023-01-15T08:10:00Z",
    hasStock: true
  },
  {
    id: "4",
    name: "Paquet Petit Déjeuner",
    description: "Ensemble petit-déjeuner avec pain, confiture et jus",
    barcode: "3760001234570",
    price: 8.99,
    cost: 5.5,
    stock: 10,
    categoryId: "combos",
    category: "combos",
    imageUrl: "https://example.com/breakfast.jpg",
    image: "https://example.com/breakfast.jpg",
    createdAt: "2023-01-15T08:15:00Z",
    updatedAt: "2023-01-15T08:15:00Z",
    isCombo: true,
    hasStock: true,
    locationStock: [
      {
        id: "ls1",
        productId: "4",
        locationId: "loc1",
        stock: 5,
        minStockLevel: 2,
        createdAt: "2023-01-15T08:15:00Z",
        updatedAt: "2023-01-15T08:15:00Z"
      }
    ]
  }
];
