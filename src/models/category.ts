
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const mockCategories: Category[] = [
  {
    id: "cat-001",
    name: "Electronics",
    description: "Electronic devices and accessories",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "cat-002",
    name: "Home Appliances",
    description: "Appliances for home use",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "cat-003",
    name: "Furniture",
    description: "Home and office furniture",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function getCategoryById(categories: Category[], id?: string): Category | null {
  if (!id) return null;
  return categories.find(category => category.id === id) || null;
}
