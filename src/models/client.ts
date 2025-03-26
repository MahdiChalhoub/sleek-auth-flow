
import { v4 as uuidv4 } from 'uuid';

export interface ClientTransaction {
  id: string;
  clientId: string;
  type: 'invoice' | 'payment' | 'return' | 'credit_note';
  referenceId: string;
  date: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ClientFinancialAccount {
  id: string;
  clientId: string;
  totalDue: number;
  totalPaid: number;
  availableCredit: number;
  ledgerAccountId?: string;
  lastUpdated: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  type: 'regular' | 'vip' | 'credit' | 'wholesale';
  salesRepId?: string;
  notes?: string;
  tags?: string[];
  status: 'active' | 'inactive';
  financialAccount?: ClientFinancialAccount;
  transactions?: ClientTransaction[];
  createdAt: string;
  updatedAt: string;
  // Additional fields needed by ClientSelector
  isVip?: boolean;
  creditLimit?: number;
  outstandingBalance?: number;
  lastVisit?: string;
}

export const createClient = (data: Partial<Client>): Client => {
  const now = new Date().toISOString();
  return {
    id: data.id || uuidv4(),
    name: data.name || '',
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    country: data.country,
    type: data.type || 'regular',
    salesRepId: data.salesRepId,
    notes: data.notes,
    tags: data.tags || [],
    status: data.status || 'active',
    financialAccount: data.financialAccount,
    transactions: data.transactions || [],
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    isVip: data.isVip,
    creditLimit: data.creditLimit,
    outstandingBalance: data.outstandingBalance,
    lastVisit: data.lastVisit
  };
};

// Add mock client data for use in ClientSelector
export const mockClients: Client[] = [
  {
    id: uuidv4(),
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    type: "regular",
    status: "active",
    isVip: false,
    creditLimit: 1000,
    outstandingBalance: 250,
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Somewhere, USA",
    type: "vip",
    status: "active",
    isVip: true,
    creditLimit: 5000,
    outstandingBalance: 750,
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1 (555) 333-2222",
    address: "789 Pine St, Elsewhere, USA",
    type: "credit",
    status: "active",
    isVip: false,
    creditLimit: 3000,
    outstandingBalance: 3000, // Credit limit reached
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+1 (555) 444-5555",
    address: "101 Elm St, Nowhere, USA",
    type: "wholesale",
    status: "active",
    isVip: true,
    creditLimit: 10000,
    outstandingBalance: 2500,
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Client Service for Supabase
export const clientService = {
  async getAll(): Promise<Client[]> {
    // Implementation will be added later
    return [];
  },
  
  async getById(id: string): Promise<Client | null> {
    // Implementation will be added later
    return null;
  },
  
  async create(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client | null> {
    // Implementation will be added later
    return null;
  },
  
  async update(id: string, updates: Partial<Client>): Promise<Client | null> {
    // Implementation will be added later
    return null;
  },
  
  async delete(id: string): Promise<boolean> {
    // Implementation will be added later
    return false;
  },
  
  async getClientTransactions(clientId: string): Promise<ClientTransaction[]> {
    // Implementation will be added later
    return [];
  },
  
  async getClientFinancialAccount(clientId: string): Promise<ClientFinancialAccount | null> {
    // Implementation will be added later 
    return null;
  }
};
