
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'regular' | 'vip' | 'credit'; // Add required property
  status: 'active' | 'inactive';      // Add required property
  loyaltyPoints?: number;
  financialAccount?: {
    totalDue: number;
    availableCredit: number;
  };
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
    loyaltyPoints: data.loyaltyPoints || 0,
    financialAccount: data.financialAccount || {
      totalDue: 0,
      availableCredit: 0
    },
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
}
