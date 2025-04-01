
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from '@/models/supplier';
import { tableSource } from '@/utils/supabaseUtils';

// Suppliers API
export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const { data, error } = await supabase
      .from(tableSource('suppliers'))
      .select('*');
    
    if (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      contactPerson: item.contact_person || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
      notes: item.notes,
      products: [] // Default empty array for products
    }));
  },
  
  getById: async (id: string): Promise<Supplier | null> => {
    const { data, error } = await supabase
      .from(tableSource('suppliers'))
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching supplier ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      contactPerson: data.contact_person || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes,
      products: [] // Default empty array for products
    };
  },
  
  create: async (supplier: Omit<Supplier, 'id'>): Promise<Supplier> => {
    const { data, error } = await supabase
      .from(tableSource('suppliers'))
      .insert([{
        name: supplier.name,
        contact_person: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        notes: supplier.notes
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      contactPerson: data.contact_person || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes,
      products: [] // Default empty array for products
    };
  },
  
  update: async (id: string, updates: Partial<Supplier>): Promise<Supplier> => {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.contactPerson) dbUpdates.contact_person = updates.contactPerson;
    if (updates.email) dbUpdates.email = updates.email;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.address) dbUpdates.address = updates.address;
    if (updates.notes) dbUpdates.notes = updates.notes;
    
    const { data, error } = await supabase
      .from(tableSource('suppliers'))
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating supplier ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      contactPerson: data.contact_person || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      notes: data.notes,
      products: [] // Default empty array for products
    };
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(tableSource('suppliers'))
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting supplier ${id}:`, error);
      throw error;
    }
  }
};
