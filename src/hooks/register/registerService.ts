
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Register, PaymentMethod, DiscrepancyResolution } from '@/models/transaction';
import { DatabaseRegister, mapToAppModel, mapToDbModel } from './mappers';

export async function fetchRegisters(): Promise<Register[]> {
  const { data, error } = await supabase
    .from('register_sessions')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) {
    toast.error(`Error fetching register sessions: ${error.message}`);
    throw error;
  }
  
  return (data || []).map(register => mapToAppModel(register as DatabaseRegister));
}

export async function getRegisterById(id: string): Promise<Register | null> {
  const { data, error } = await supabase
    .from('register_sessions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code !== 'PGRST116') {
      toast.error(`Error fetching register: ${error.message}`);
    }
    return null;
  }
  
  return mapToAppModel(data as DatabaseRegister);
}

export async function createRegister(register: Omit<Register, 'id'>): Promise<Register> {
  const dbModel = mapToDbModel(register as Register);
  
  // Fix: Ensure the required 'name' property is included in the insert
  if (!dbModel.name) {
    // If name is missing, add a default name or use a value from register
    dbModel.name = register.name || 'New Register';
  }
  
  // Ensure the object has all required properties
  const insertObject = {
    name: dbModel.name,
    is_open: dbModel.is_open !== undefined ? dbModel.is_open : false,
    opening_balance: dbModel.opening_balance || { cash: 0, card: 0, bank: 0, wave: 0, mobile: 0, not_specified: 0 },
    current_balance: dbModel.current_balance || { cash: 0, card: 0, bank: 0, wave: 0, mobile: 0, not_specified: 0 },
    expected_balance: dbModel.expected_balance || { cash: 0, card: 0, bank: 0, wave: 0, mobile: 0, not_specified: 0 },
    ...dbModel
  };
  
  const { data, error } = await supabase
    .from('register_sessions')
    .insert(insertObject)
    .select()
    .single();
  
  if (error) {
    toast.error(`Error creating register: ${error.message}`);
    throw error;
  }
  
  return mapToAppModel(data as DatabaseRegister);
}

export async function updateRegister(id: string, updates: Partial<Register>): Promise<Register> {
  const dbUpdates = mapToDbModel(updates as Register);
  
  const { data, error } = await supabase
    .from('register_sessions')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    toast.error(`Error updating register: ${error.message}`);
    throw error;
  }
  
  return mapToAppModel(data as DatabaseRegister);
}
