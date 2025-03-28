export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type: string; // Added missing field
  status: string; // Added missing field
  loyaltyPoints?: number; // Added missing field that was referenced
  isVip?: boolean;
  createdAt: string;
  updatedAt: string;
  // Other client properties
  outstanding_balance?: number;
  credit_limit?: number;
  tags?: string[];
  notes?: string;
}

// Default values for new clients
export const defaultClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  email: '',
  phone: '',
  address: '',
  type: 'regular', // Default value for the new field
  status: 'active', // Default value for the new field
  loyaltyPoints: 0,
  isVip: false,
  outstanding_balance: 0,
  credit_limit: 0
};
