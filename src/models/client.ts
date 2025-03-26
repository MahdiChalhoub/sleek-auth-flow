
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
    updatedAt: data.updatedAt || now
  };
};

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
