
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  barcode: string;
  image: string;
  category: string;
  stock: number;
}

// Mock products for testing
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "MacBook Pro 16\"",
    description: "Apple M2 Pro chip, 16GB RAM, 512GB SSD",
    price: 2499.99,
    barcode: "APPL001",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    category: "Computers",
    stock: 15
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    description: "6.1\" Super Retina XDR display, A17 Pro chip",
    price: 999.99,
    barcode: "APPL002",
    image: "https://images.unsplash.com/photo-1592286927505-1def25115558?q=80&w=1000&auto=format&fit=crop",
    category: "Phones",
    stock: 32
  },
  {
    id: "3",
    name: "AirPods Pro",
    description: "Active Noise Cancellation, Transparency mode",
    price: 249.99,
    barcode: "APPL003",
    image: "https://images.unsplash.com/photo-1603351154351-5e2d0600ff5a?q=80&w=1000&auto=format&fit=crop",
    category: "Audio",
    stock: 45
  },
  {
    id: "4",
    name: "iPad Pro 11\"",
    description: "M2 chip, 11\" Liquid Retina display",
    price: 799.99,
    barcode: "APPL004",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1000&auto=format&fit=crop",
    category: "Tablets",
    stock: 20
  },
  {
    id: "5",
    name: "Apple Watch Series 9",
    description: "Always-On Retina display, S9 chip",
    price: 399.99,
    barcode: "APPL005",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop",
    category: "Wearables",
    stock: 28
  },
  {
    id: "6",
    name: "Apple TV 4K",
    description: "A15 Bionic chip, 4K HDR with Dolby Vision",
    price: 129.99,
    barcode: "APPL006",
    image: "https://images.unsplash.com/photo-1528695046320-dd808c80bb7c?q=80&w=1000&auto=format&fit=crop",
    category: "Entertainment",
    stock: 18
  },
  {
    id: "7",
    name: "HomePod mini",
    description: "Compact smart speaker with Siri",
    price: 99.99,
    barcode: "APPL007",
    image: "https://images.unsplash.com/photo-1617143207675-e7e6371f5f5d?q=80&w=1000&auto=format&fit=crop",
    category: "Audio",
    stock: 40
  },
  {
    id: "8",
    name: "Magic Keyboard",
    description: "Wireless keyboard with numeric keypad",
    price: 129.99,
    barcode: "APPL008",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
    stock: 25
  },
  {
    id: "9",
    name: "Magic Mouse",
    description: "Wireless multi-touch mouse",
    price: 79.99,
    barcode: "APPL009",
    image: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
    stock: 30
  },
  {
    id: "10",
    name: "Apple Pencil",
    description: "Precision stylus for iPad",
    price: 129.99,
    barcode: "APPL010",
    image: "https://images.unsplash.com/photo-1551651639-927b595f9010?q=80&w=1000&auto=format&fit=crop",
    category: "Accessories",
    stock: 22
  },
  {
    id: "11",
    name: "MacBook Air",
    description: "M2 chip, 13.6\" Liquid Retina display",
    price: 1199.99,
    barcode: "APPL011",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop",
    category: "Computers",
    stock: 18
  },
  {
    id: "12",
    name: "Mac mini",
    description: "M2 chip, 8GB RAM, 256GB SSD",
    price: 599.99,
    barcode: "APPL012",
    image: "https://images.unsplash.com/photo-1612815452865-e51d912edc78?q=80&w=1000&auto=format&fit=crop",
    category: "Computers",
    stock: 15
  }
];
