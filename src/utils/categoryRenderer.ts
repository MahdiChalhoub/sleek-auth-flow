
import { Category } from '@/models/category';

export function renderCategory(category: Category | string | { id: string, name: string } | undefined | null): string {
  if (!category) return 'Uncategorized';
  
  if (typeof category === 'string') {
    return category;
  }
  
  return category.name || 'Uncategorized';
}

export function getCategoryId(category: Category | string | { id: string, name: string } | undefined): string {
  if (!category) return '';
  
  if (typeof category === 'string') {
    return category;
  }
  
  return category.id || '';
}

export function categoriesMatch(
  cat1: Category | string | { id: string, name: string } | undefined | null,
  cat2: Category | string | { id: string, name: string } | undefined | null
): boolean {
  if (!cat1 || !cat2) return false;
  
  const id1 = getCategoryId(cat1 as any);
  const id2 = getCategoryId(cat2 as any);
  
  return id1 === id2;
}
