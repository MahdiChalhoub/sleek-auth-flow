
import { supabase } from '@/lib/supabase';

export const createUpdateClientBalanceFunction = async () => {
  // Execute a raw SQL query to create the function
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
    CREATE OR REPLACE FUNCTION public.update_client_balance(
      p_client_id UUID, 
      p_amount NUMERIC
    ) RETURNS VOID AS $$
    BEGIN
      UPDATE public.clients 
      SET outstanding_balance = COALESCE(outstanding_balance, 0) + p_amount,
          updated_at = NOW()
      WHERE id = p_client_id;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE OR REPLACE FUNCTION public.create_update_client_balance_function()
    RETURNS VOID AS $$
    BEGIN
      -- This function exists to be called via RPC to ensure the update_client_balance function exists
      -- It will create the function if needed but if it already exists it does nothing
    END;
    $$ LANGUAGE plpgsql;
    `
  });
  
  if (error) {
    console.error('Error creating update_client_balance function:', error);
    throw error;
  }
};

export const initializeDatabaseFunctions = async () => {
  try {
    await createUpdateClientBalanceFunction();
    console.log('Database functions initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database functions:', error);
  }
};
