
import { Category } from '@/models/category';

export const renderCategory = (category: Category | undefined | string): string => {
  if (!category) return 'Uncategorized';
  
  if (typeof category === 'string') {
    return category;
  }
  
  return category.name || 'Uncategorized';
};

export const getCategoryId = (category: Category | undefined | string): string => {
  if (!category) return '';
  
  if (typeof category === 'string') {
    return category;
  }
  
  return category.id || '';
};

export const categoriesMatch = (
  category1: Category | undefined | string,
  category2: Category | undefined | string
): boolean => {
  if (!category1 && !category2) return true;
  if (!category1 || !category2) return false;
  
  const id1 = getCategoryId(category1);
  const id2 = getCategoryId(category2);
  
  return id1 === id2;
};
