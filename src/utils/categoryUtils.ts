
import { Category } from '@/models/category';

export function formatCategory(category: Category | null | undefined): string {
  return category?.name || 'Uncategorized';
}

export function getCategoryById(categories: Category[], id?: string): Category | null {
  if (!id) return null;
  return categories.find(c => c.id === id) || null;
}
