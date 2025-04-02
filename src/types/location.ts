
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  businessId: string;
  status: 'active' | 'inactive' | 'pending';
  type: 'retail' | 'warehouse' | 'office' | 'other';
  isDefault: boolean;
  locationCode: string;
  createdAt: string;
  updatedAt: string;
  openingHours?: Record<string, any>;
}

export interface LocationFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  type: 'retail' | 'warehouse' | 'office' | 'other';
  isDefault: boolean;
  locationCode: string;
  openingHours?: Record<string, any>;
}
