
export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string | null;
  business_id?: string;
  created_at?: string;
  updated_at?: string;
  color?: string;
  icon?: string;
  slug?: string;
}

// Mock categories for development purposes
export const mockCategories: Category[] = [
  {
    id: "cat-001",
    name: "Electronics",
    description: "Electronic devices and components",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    color: "#4CAF50",
    icon: "smartphone"
  },
  {
    id: "cat-002",
    name: "Home Appliances",
    description: "Kitchen and household appliances",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    color: "#2196F3",
    icon: "home"
  },
  {
    id: "cat-003",
    name: "Furniture",
    description: "Home and office furniture",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    color: "#9C27B0",
    icon: "chair"
  }
];
