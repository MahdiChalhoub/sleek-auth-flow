
import { supabase } from '@/lib/supabase';
import { Category } from '@/models/interfaces/categoryInterfaces';

// Get all categories
export const getAll = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};

// Get a category by ID
export const getById = async (id: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch category with ID ${id}:`, error);
    return null;
  }
};

// Create a new category
export const create = async (category: { name: string; description?: string }): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to create category:', error);
    return null;
  }
};

// Update an existing category
export const update = async (id: string, updates: { name?: string; description?: string }): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to update category with ID ${id}:`, error);
    return null;
  }
};

// Delete a category
export const remove = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete category with ID ${id}:`, error);
    return false;
  }
};

export const categoriesService = {
  getAll,
  getById,
  create,
  update,
  remove
};
