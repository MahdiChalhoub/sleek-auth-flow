
export interface Supplier {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  contact_person?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierFormData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  contact_person?: string;
  notes?: string;
}
