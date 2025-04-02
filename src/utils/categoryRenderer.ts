
import { Category } from '@/models/interfaces/categoryInterfaces';

// Render category name, handling both string and object formats
export const renderCategory = (category: string | Category | undefined): string => {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  return category.name || 'Uncategorized';
};

// Get category ID, handling both string and object formats
export const getCategoryId = (category: string | Category): string => {
  if (typeof category === 'string') return category;
  return category.id;
};

// Check if categories match, handling both string and object formats
export const categoriesMatch = (
  category1: Category | undefined | null,
  category2: string | Category
): boolean => {
  if (!category1) return false;
  
  const id1 = typeof category1 === 'string' ? category1 : category1.id;
  const id2 = typeof category2 === 'string' ? category2 : category2.id;
  
  return id1 === id2;
};

// Convert any category format to a string for display
export const categoryToString = (category: string | Category | undefined | null): string => {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  return category.name || 'Uncategorized';
};
