
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  children?: Category[]; // For hierarchical categories
}
