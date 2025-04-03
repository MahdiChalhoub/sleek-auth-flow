
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  businessId: string;
  status: 'active' | 'inactive' | 'pending' | 'closed';
  type: 'retail' | 'warehouse' | 'office' | 'other';
  isDefault: boolean;
  locationCode: string;
  createdAt: string;
  updatedAt: string;
  openingHours?: Record<string, string> | string;
}

export interface LocationFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  type: 'retail' | 'warehouse' | 'office' | 'other';
  isDefault: boolean;
  locationCode: string;
  openingHours?: Record<string, string> | string;
}

// Alias Location to Branch for backwards compatibility
export type Location = Branch;
