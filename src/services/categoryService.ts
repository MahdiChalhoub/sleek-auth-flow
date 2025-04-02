
import { supabase } from '@/lib/supabase';
import { Category } from '@/models/interfaces/categoryInterfaces';

const getAll = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data as Category[] || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const getById = async (id: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Item not found
      }
      throw error;
    }
    
    return data as Category;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    return null;
  }
};

const createMany = async (categories: Category[]): Promise<Category[]> => {
  try {
    // Ensure all categories have the required name property
    const validCategories = categories.filter(cat => cat.name).map(cat => ({
      name: cat.name,
      description: cat.description,
      id: cat.id
    }));
    
    if (validCategories.length === 0) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert(validCategories)
      .select();
    
    if (error) throw error;
    
    return data as Category[] || [];
  } catch (error) {
    console.error('Error creating categories:', error);
    return [];
  }
};

const update = async (id: string, category: Partial<Category>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        description: category.description
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Category;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    return null;
  }
};

const remove = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    return false;
  }
};

export const categoriesService = {
  getAll,
  getById,
  createMany,
  update,
  remove
};

// For backwards compatibility
export { getAll, getById, createMany as createCategories, update as updateCategory, remove as deleteCategory };
