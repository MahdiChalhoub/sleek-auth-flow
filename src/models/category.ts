
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    description: 'Electronic products and gadgets',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-2',
    name: 'Clothing',
    description: 'Apparel and fashion items',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-3',
    name: 'Food & Beverage',
    description: 'Consumable products',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(cat => cat.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return mockCategories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
};
