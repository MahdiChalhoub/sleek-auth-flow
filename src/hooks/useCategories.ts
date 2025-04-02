
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Category } from '@/models/interfaces/categoryInterfaces';
import { useCategoryTree } from './useCategoryTree';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // We'll use the existing category tree hook for data
  const categoryTreeHook = useCategoryTree();
  
  useEffect(() => {
    if (!categoryTreeHook.loading && categoryTreeHook.categories) {
      // Flatten the category tree for the dropdown
      const flattenCategories = (cats: Category[]): Category[] => {
        return cats.reduce((acc: Category[], cat) => {
          acc.push(cat);
          if (cat.children && cat.children.length > 0) {
            acc = [...acc, ...flattenCategories(cat.children)];
          }
          return acc;
        }, []);
      };
      
      setCategories(flattenCategories(categoryTreeHook.categories));
      setIsLoading(false);
    }
    
    if (categoryTreeHook.error) {
      setError(new Error(categoryTreeHook.error));
      setIsLoading(false);
    }
  }, [categoryTreeHook.categories, categoryTreeHook.loading, categoryTreeHook.error]);
  
  return {
    categories,
    isLoading,
    error,
    refresh: categoryTreeHook.fetchData
  };
};

export default useCategories;
