
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  children?: Category[];
  count?: number;  // Added this property to match usage in CategoryTree
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  imageUrl?: string;
}

export const useCategoryTree = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');
        
        if (categoriesError) throw categoriesError;

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, categories(name)');
        
        if (productsError) throw productsError;

        // Process categories into a tree
        const categoryTree = buildCategoryTree(categoriesData || []);
        setCategories(categoryTree);

        // Group products by category
        const productsByCat: Record<string, Product[]> = {};
        
        // Instead of using the unsupported 'group' method, manually group products
        (productsData || []).forEach((product: any) => {
          const categoryId = product.category_id || 'uncategorized';
          if (!productsByCat[categoryId]) {
            productsByCat[categoryId] = [];
          }
          productsByCat[categoryId].push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.category_id,
            imageUrl: product.image_url
          });
        });

        setProductsByCategory(productsByCat);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to build a category tree
  const buildCategoryTree = (flatCategories: any[]): Category[] => {
    const categoryMap: Record<string, Category> = {};
    const rootCategories: Category[] = [];

    // First pass: create all category objects with their IDs
    flatCategories.forEach(cat => {
      categoryMap[cat.id] = {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        parentId: cat.parent_id,
        children: []
      };
    });

    // Second pass: build the tree structure
    flatCategories.forEach(cat => {
      const category = categoryMap[cat.id];
      if (cat.parent_id && categoryMap[cat.parent_id]) {
        // This is a child category
        categoryMap[cat.parent_id].children?.push(category);
      } else {
        // This is a root category
        rootCategories.push(category);
      }
    });

    return rootCategories;
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  return { 
    categories, 
    productsByCategory, 
    loading, 
    error, 
    categoryTree: categories, // Alias for backward compatibility
    isLoading: loading, // Alias for backward compatibility
    selectedCategoryId,
    selectCategory
  };
};
