
import { supabase } from '@/lib/supabase';

export const setupDatabase = async () => {
  try {
    // Check if the database functions already exist by trying to execute them
    const { error } = await supabase.rpc('update_client_balance', {
      p_client_id: '00000000-0000-0000-0000-000000000000',
      p_amount: 0
    });
    
    // If the function doesn't exist, create it
    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      console.log('Creating database functions...');
      
      // Execute a raw SQL query to create the function
      const result = await supabase.rpc('exec_sql', {
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
        `
      });
      
      if (result.error) {
        console.error('Error creating update_client_balance function:', result.error);
        // Don't throw the error, just log it
      } else {
        console.log('Successfully created update_client_balance function');
      }
    } else if (error) {
      // If we get a different error, log it but continue
      console.error('Error checking for database function:', error);
    } else {
      // Function exists
      console.log('Database functions already exist');
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    // Return false instead of throwing the error
    return false;
  }
};

// Export the init function separately
export const initializeDatabase = async () => {
  try {
    await setupDatabase();
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
};
