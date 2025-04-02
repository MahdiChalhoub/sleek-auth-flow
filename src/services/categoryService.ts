
import { supabase } from '@/lib/supabase';
import { Category } from '@/models/interfaces/categoryInterfaces';

const getAll = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
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

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    return null;
  }
};

const create = async (category: Partial<Category>): Promise<Category | null> => {
  try {
    // Make sure name is provided since it's required in the db schema
    if (!category.name) {
      throw new Error('Category name is required');
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

const update = async (id: string, category: Partial<Category>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
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
    console.error(`Error deleting category with ID ${id}:`, error);
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
