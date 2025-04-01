
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from '@/models/supplier';
import { tableSource } from '@/utils/supabaseUtils';
import { assertType } from '@/utils/typeUtils';

type DbSupplier = {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

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
    
    return (data || []).map(item => {
      const dbSupplier = assertType<DbSupplier>(item);
      return {
        id: dbSupplier.id,
        name: dbSupplier.name,
        contactPerson: dbSupplier.contact_person || '',
        email: dbSupplier.email || '',
        phone: dbSupplier.phone || '',
        address: dbSupplier.address || '',
        notes: dbSupplier.notes,
        products: [] // Default empty array for products
      };
    });
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
    
    const dbSupplier = assertType<DbSupplier>(data);
    return {
      id: dbSupplier.id,
      name: dbSupplier.name,
      contactPerson: dbSupplier.contact_person || '',
      email: dbSupplier.email || '',
      phone: dbSupplier.phone || '',
      address: dbSupplier.address || '',
      notes: dbSupplier.notes,
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
    
    const dbSupplier = assertType<DbSupplier>(data);
    return {
      id: dbSupplier.id,
      name: dbSupplier.name,
      contactPerson: dbSupplier.contact_person || '',
      email: dbSupplier.email || '',
      phone: dbSupplier.phone || '',
      address: dbSupplier.address || '',
      notes: dbSupplier.notes,
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
    
    const dbSupplier = assertType<DbSupplier>(data);
    return {
      id: dbSupplier.id,
      name: dbSupplier.name,
      contactPerson: dbSupplier.contact_person || '',
      email: dbSupplier.email || '',
      phone: dbSupplier.phone || '',
      address: dbSupplier.address || '',
      notes: dbSupplier.notes,
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
