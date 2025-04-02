
export interface Business {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  taxId?: string;
  website?: string;
  status: string;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
  logoUrl?: string;
  description?: string;
  type?: string;
  country?: string;
  currency?: string;
  active?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  businessId: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  type?: string;
  isDefault?: boolean;
  managerId?: string;
  openingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  latitude?: number;
  longitude?: number;
}

export const mockBranches: Branch[] = [
  {
    id: 'branch-1',
    name: 'Main Store',
    address: '123 Main St, New York, NY',
    phone: '555-123-4567',
    businessId: 'business-1',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    email: 'main@example.com',
    type: 'retail',
    isDefault: true,
    openingHours: {
      monday: '9:00-18:00',
      tuesday: '9:00-18:00',
      wednesday: '9:00-18:00',
      thursday: '9:00-18:00',
      friday: '9:00-18:00',
      saturday: '10:00-16:00',
      sunday: 'Closed'
    }
  },
  {
    id: 'branch-2',
    name: 'Downtown Location',
    address: '456 Market St, San Francisco, CA',
    phone: '555-987-6543',
    businessId: 'business-1',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    email: 'downtown@example.com',
    type: 'warehouse',
    isDefault: false
  }
];
