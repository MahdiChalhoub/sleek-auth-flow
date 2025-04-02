
export interface Business {
  id: string;
  name: string;
  active: boolean;
  createdAt?: string;
}

export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
  businessId?: string;
}
