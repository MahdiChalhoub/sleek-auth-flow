
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type: string;
  status: string;
  loyaltyPoints?: number;
  isVip?: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional fields for compatibility
  city?: string;
  country?: string;
  lastVisit?: string;
  credit_limit?: number;
  outstanding_balance?: number;
  tags?: string[];
  notes?: string;
  // Financial account related fields
  financialAccount?: {
    totalDue?: number;
    totalPaid?: number;
    availableCredit?: number;
  };
}

// Default values for new clients
export const defaultClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  email: '',
  phone: '',
  address: '',
  type: 'regular',
  status: 'active',
  loyaltyPoints: 0,
  isVip: false,
  outstanding_balance: 0,
  credit_limit: 0
};

// Add ClientTransaction interface that was missing
export interface ClientTransaction {
  id: string;
  clientId: string;
  type: string;
  referenceId: string;
  date: string;
  amount: number;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to create a client (to replace the missing createClient function)
export function createClient(data: Partial<Client>): Client {
  return {
    id: data.id || '',
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    type: data.type || 'regular',
    status: data.status || 'active',
    loyaltyPoints: data.loyaltyPoints || 0,
    isVip: data.isVip || false,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    city: data.city,
    country: data.country,
    lastVisit: data.lastVisit,
    credit_limit: data.credit_limit || 0,
    outstanding_balance: data.outstanding_balance || 0,
    tags: data.tags || [],
    notes: data.notes,
    financialAccount: data.financialAccount || {
      totalDue: data.outstanding_balance || 0,
      totalPaid: 0,
      availableCredit: data.loyaltyPoints || 0
    }
  };
}
