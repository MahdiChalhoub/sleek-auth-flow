
// Re-export the Category type from useCategoryTree
import { Category } from '@/hooks/useCategoryTree';
export { Category };

export interface CategoryWithProducts extends Category {
  productCount: number;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parentId?: string;
}

export interface CategoryFilterOptions {
  searchTerm?: string;
  parentOnly?: boolean;
  sort?: 'name' | 'productCount';
  order?: 'asc' | 'desc';
}
