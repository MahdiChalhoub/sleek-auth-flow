
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock categories data for development
export const mockCategories: Category[] = [
  { 
    id: 'cat-1', 
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat-2', 
    name: 'Clothing',
    description: 'Apparel and fashion items',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat-3', 
    name: 'Food & Beverages',
    description: 'Consumable items',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat-4', 
    name: 'Office Supplies',
    description: 'Items for office use',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
