
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'regular' | 'vip' | 'credit' | 'wholesale';
  status: 'active' | 'inactive';
  isVip?: boolean;
  creditLimit?: number;
  outstandingBalance?: number;
  lastVisit?: string;
  notes?: string;
  tags?: string[];
  city?: string;
  country?: string;
  loyaltyPoints?: number;
  financialAccount?: {
    totalDue: number;
    availableCredit: number;
    totalPaid?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClientTransaction {
  id: string;
  clientId: string;
  type: 'invoice' | 'payment' | 'return' | 'credit' | 'debit';
  referenceId: string;
  date: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export function createClient(data: Partial<Client>): Client {
  return {
    id: data.id || '',
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    type: data.type || 'regular',
    status: data.status || 'active',
    isVip: data.isVip || false,
    creditLimit: data.creditLimit,
    outstandingBalance: data.outstandingBalance || 0,
    lastVisit: data.lastVisit,
    notes: data.notes,
    tags: data.tags || [],
    city: data.city,
    country: data.country,
    loyaltyPoints: data.loyaltyPoints || 0,
    financialAccount: data.financialAccount || {
      totalDue: 0,
      availableCredit: 0,
      totalPaid: 0
    },
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
}
