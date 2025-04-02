
export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  businessId: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  type?: string;
  isDefault?: boolean;
  managerId?: string;
  latitude?: number;
  longitude?: number;
  locationCode?: string;
}
