
import { supabase } from '@/integrations/supabase/client';
import { Client, createClient } from '@/models/client';
import { assertType } from '@/utils/typeUtils';

type DbClient = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
};

// Clients API
export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
    
    return (data || []).map(item => {
      const dbClient = assertType<DbClient>(item);
      return createClient({
        id: dbClient.id,
        name: dbClient.name,
        email: dbClient.email || '',
        phone: dbClient.phone || '',
        address: dbClient.address || '',
        type: 'regular', // Default type
        status: 'active', // Default status
        createdAt: dbClient.created_at,
        updatedAt: dbClient.updated_at,
        financialAccount: {
          availableCredit: dbClient.loyalty_points || 0,
          totalDue: 0 // Default value
        }
      });
    });
  },
  
  getById: async (id: string): Promise<Client | null> => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
    
    if (!data) return null;
    
    const dbClient = assertType<DbClient>(data);
    return createClient({
      id: dbClient.id,
      name: dbClient.name,
      email: dbClient.email || '',
      phone: dbClient.phone || '',
      address: dbClient.address || '',
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: dbClient.created_at,
      updatedAt: dbClient.updated_at,
      financialAccount: {
        availableCredit: dbClient.loyalty_points || 0,
        totalDue: 0 // Default value
      }
    });
  },
  
  create: async (client: Omit<Client, 'id'>): Promise<Client> => {
    const { data, error } = await supabase
      .from('clients')
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
    
    const dbClient = assertType<DbClient>(data);
    return createClient({
      id: dbClient.id,
      name: dbClient.name,
      email: dbClient.email || '',
      phone: dbClient.phone || '',
      address: dbClient.address || '',
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: dbClient.created_at,
      updatedAt: dbClient.updated_at,
      financialAccount: {
        availableCredit: dbClient.loyalty_points || 0,
        totalDue: 0 // Default value
      }
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
      .from('clients')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
    
    const dbClient = assertType<DbClient>(data);
    return createClient({
      id: dbClient.id,
      name: dbClient.name,
      email: dbClient.email || '',
      phone: dbClient.phone || '',
      address: dbClient.address || '',
      type: 'regular', // Default type
      status: 'active', // Default status
      createdAt: dbClient.created_at,
      updatedAt: dbClient.updated_at,
      financialAccount: {
        availableCredit: dbClient.loyalty_points || 0,
        totalDue: 0 // Default value
      }
    });
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  }
};
