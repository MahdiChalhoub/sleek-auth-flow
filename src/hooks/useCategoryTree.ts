
import { useState, useEffect, useMemo } from "react";
import { CategoryNode } from "@/components/inventory/CategoryTree";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  level?: number;
  count?: number;
}

interface CategoryCount {
  category_id: string;
  count: string;
}

export const useCategoryTree = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        // Fetch categories from Supabase
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) throw new Error(error.message);
        
        // Fetch product counts per category - fixed query
        const { data: categoryCounts, error: countsError } = await supabase
          .from('products')
          .select('category_id, count(*)')
          .groupBy('category_id');
          
        if (countsError) throw new Error(countsError.message);
        
        // Create a map of category ID to product count
        const countMap = new Map();
        (categoryCounts as CategoryCount[] || []).forEach((item) => {
          countMap.set(item.category_id, parseInt(item.count));
        });
        
        // Add product count to each category
        const categoriesWithCount = data?.map((category) => ({
          ...category,
          count: countMap.get(category.id) || 0,
        })) || [];
        
        setCategories(categoriesWithCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching categories:', err);
        // Use empty array to prevent UI crashes
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Transform flat category list into a hierarchical tree structure
  const categoryTree = useMemo(() => {
    if (!categories.length) return [];
    
    const idMap: Record<string, CategoryNode> = {};
    const root: CategoryNode[] = [];
    
    // First pass: create nodes
    categories.forEach(category => {
      idMap[category.id] = {
        id: category.id,
        name: category.name,
        parentId: category.parent_id,
        level: category.level || 0,
        count: category.count,
        children: []
      };
    });
    
    // Second pass: create hierarchy
    categories.forEach(category => {
      const node = idMap[category.id];
      
      if (category.parent_id && idMap[category.parent_id]) {
        // If the category has a parent and the parent exists, add it as a child
        idMap[category.parent_id].children = idMap[category.parent_id].children || [];
        idMap[category.parent_id].children?.push(node);
      } else {
        // If it doesn't have a parent, it's a root category
        root.push(node);
      }
    });
    
    return root;
  }, [categories]);

  // Handle category selection
  const selectCategory = (category: CategoryNode) => {
    setSelectedCategoryId(category.id);
  };

  return {
    categoryTree,
    isLoading,
    error,
    selectedCategoryId,
    selectCategory,
    setSelectedCategoryId,
    flatCategories: categories
  };
};
