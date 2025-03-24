
// Client types for the POS system

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  isVip?: boolean;
  creditLimit?: number;
  outstandingBalance?: number;
  lastVisit?: string;
  notes?: string;
  loyaltyPoints?: number;
  pointsExpiry?: string;
  loyaltyTier?: "bronze" | "silver" | "gold" | "platinum";
}

// Mock clients for development
export const mockClients: Client[] = [
  { 
    id: "1", 
    name: "John Doe", 
    email: "john@example.com", 
    phone: "+123456789",
    address: "123 Main St, Anytown",
    isVip: true,
    creditLimit: 1000,
    outstandingBalance: 250,
    lastVisit: "2023-05-15T14:30:00Z",
    notes: "Preferred payment: Credit Card",
    loyaltyPoints: 1250,
    pointsExpiry: "2024-12-31T23:59:59Z",
    loyaltyTier: "gold"
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    email: "jane@example.com", 
    phone: "+987654321",
    address: "456 Oak Ave, Somewhere",
    lastVisit: "2023-05-20T10:15:00Z",
    loyaltyPoints: 350,
    pointsExpiry: "2024-12-31T23:59:59Z",
    loyaltyTier: "bronze"
  },
  { 
    id: "3", 
    name: "Bob Johnson", 
    email: "bob@example.com", 
    phone: "+192837465",
    address: "789 Pine St, Nowhere",
    isVip: true,
    creditLimit: 500,
    outstandingBalance: 0,
    lastVisit: "2023-05-22T16:45:00Z",
    notes: "Always buys electronics",
    loyaltyPoints: 1890,
    pointsExpiry: "2024-12-31T23:59:59Z",
    loyaltyTier: "silver"
  },
  { 
    id: "4", 
    name: "Alice Brown", 
    email: "alice@example.com", 
    phone: "+918273645",
    address: "321 Elm Dr, Elsewhere",
    lastVisit: "2023-05-18T09:30:00Z",
    loyaltyPoints: 75,
    pointsExpiry: "2024-12-31T23:59:59Z",
    loyaltyTier: "bronze"
  },
  { 
    id: "5", 
    name: "Charlie Wilson", 
    email: "charlie@example.com", 
    phone: "+567891234",
    address: "654 Maple Rd, Anywhere",
    creditLimit: 200,
    outstandingBalance: 150,
    lastVisit: "2023-05-21T11:20:00Z",
    notes: "Usually pays with mobile wallet",
    loyaltyPoints: 2780,
    pointsExpiry: "2024-12-31T23:59:59Z",
    loyaltyTier: "platinum"
  },
];
