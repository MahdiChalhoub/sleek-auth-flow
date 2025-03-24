
// Product type definition
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  barcode: string;
  stock: number;
  category: string;
}

// Mock product data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    description: "Apple's latest flagship smartphone",
    price: 999.99,
    image: "https://images.unsplash.com/photo-1675785931406-6faf834d1e3d?q=80&w=800&auto=format&fit=crop",
    barcode: "100000001",
    stock: 15,
    category: "mobile"
  },
  {
    id: "2",
    name: "MacBook Air M3",
    description: "Ultralight laptop with Apple M3 chip",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop",
    barcode: "100000002",
    stock: 10,
    category: "electronics"
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    description: "Wireless earbuds with noise cancellation",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=800&auto=format&fit=crop",
    barcode: "100000003",
    stock: 25,
    category: "electronics"
  },
  {
    id: "4",
    name: "Samsung Galaxy S24",
    description: "Samsung's flagship smartphone",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=800&auto=format&fit=crop",
    barcode: "100000004",
    stock: 20,
    category: "mobile"
  },
  {
    id: "5",
    name: "iPad Pro 12.9\"",
    description: "Professional tablet with Apple M2 chip",
    price: 1099.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop",
    barcode: "100000005",
    stock: 8,
    category: "electronics"
  },
  {
    id: "6",
    name: "Sony WH-1000XM5",
    description: "Wireless noise cancelling headphones",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
    barcode: "100000006",
    stock: 12,
    category: "electronics"
  },
  {
    id: "7",
    name: "Organic Avocado",
    description: "Fresh organic avocados",
    price: 2.99,
    image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?q=80&w=800&auto=format&fit=crop",
    barcode: "100000007",
    stock: 50,
    category: "grocery"
  },
  {
    id: "8",
    name: "Coffee Beans",
    description: "Premium arabica coffee beans",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1562578406-7ea8e70fac3f?q=80&w=800&auto=format&fit=crop",
    barcode: "100000008",
    stock: 30,
    category: "beverages"
  },
  {
    id: "9",
    name: "Craft Beer Set",
    description: "Assorted craft beers",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1574213424251-916245aad8dc?q=80&w=800&auto=format&fit=crop",
    barcode: "100000009",
    stock: 15,
    category: "beverages"
  },
  {
    id: "10",
    name: "Margherita Pizza",
    description: "Classic Italian pizza",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604917877934-07d8d248d396?q=80&w=800&auto=format&fit=crop",
    barcode: "100000010",
    stock: 8,
    category: "food"
  },
  {
    id: "11",
    name: "Cotton T-Shirt",
    description: "Premium cotton t-shirt",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    barcode: "100000011",
    stock: 25,
    category: "clothing"
  },
  {
    id: "12",
    name: "Non-Stick Pan",
    description: "High-quality non-stick cooking pan",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1575262008029-439bdcf013cd?q=80&w=800&auto=format&fit=crop",
    barcode: "100000012",
    stock: 10,
    category: "kitchenware"
  },
  {
    id: "13",
    name: "The Alchemist",
    description: "Paulo Coelho's bestselling novel",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
    barcode: "100000013",
    stock: 20,
    category: "books"
  },
  {
    id: "14",
    name: "Throw Pillow",
    description: "Decorative home pillow",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1584637756754-14a1d01782df?q=80&w=800&auto=format&fit=crop",
    barcode: "100000014",
    stock: 15,
    category: "home"
  },
  {
    id: "15",
    name: "PlayStation 5",
    description: "Sony's latest gaming console",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop",
    barcode: "100000015",
    stock: 5,
    category: "gaming"
  },
  {
    id: "16",
    name: "Baby Onesie",
    description: "Soft cotton baby onesie",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=800&auto=format&fit=crop",
    barcode: "100000016",
    stock: 30,
    category: "baby"
  }
];
