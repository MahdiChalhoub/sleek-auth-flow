
import { supabase } from '@/lib/supabase';
import { Category } from '@/models/interfaces/categoryInterfaces';

export async function getCategories(): Promise<Category[]> {
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
}

export async function getCategoryById(id: string): Promise<Category | null> {
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
}

export async function createCategories(categories: Category[]): Promise<Category[]> {
  try {
    const categoriesToCreate = categories.map(cat => ({
      name: cat.name,
      description: cat.description,
      id: cat.id
    }));
    
    const { data, error } = await supabase
      .from('categories')
      .insert(categoriesToCreate)
      .select();
    
    if (error) throw error;
    
    return data as Category[] || [];
  } catch (error) {
    console.error('Error creating categories:', error);
    return [];
  }
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category | null> {
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
}

export async function deleteCategory(id: string): Promise<boolean> {
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
}
