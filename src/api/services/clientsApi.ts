
import { supabase } from '@/integrations/supabase/client';
import { Client, createClient } from '@/models/client';
import { tableSource } from '@/utils/supabaseUtils';

// Clients API
export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const { data, error } = await supabase
      .from(tableSource('clients'))
      .select('*');
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
    
    return (data || []).map(item => createClient({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },
  
  getById: async (id: string): Promise<Client | null> => {
    const { data, error } = await supabase
      .from(tableSource('clients'))
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    return createClient({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  },
  
  create: async (client: Omit<Client, 'id'>): Promise<Client> => {
    const { data, error } = await supabase
      .from(tableSource('clients'))
      .insert([{
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        loyalty_points: client.financialAccount?.availableCredit || 0
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }
    
    return createClient({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  },
  
  update: async (id: string, updates: Partial<Client>): Promise<Client> => {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.email) dbUpdates.email = updates.email;
    if (updates.phone) dbUpdates.phone = updates.phone;
    if (updates.address) dbUpdates.address = updates.address;
    if (updates.financialAccount?.availableCredit !== undefined) {
      dbUpdates.loyalty_points = updates.financialAccount.availableCredit;
    }
    
    const { data, error } = await supabase
      .from(tableSource('clients'))
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
    
    return createClient({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: data.created_at,
      updatedAt: data.updated_at
    });
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(tableSource('clients'))
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  }
};
