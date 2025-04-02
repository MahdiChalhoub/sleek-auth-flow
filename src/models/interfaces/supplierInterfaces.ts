
export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  products?: string[]; // Array of product IDs
}
