
import { supabase } from '@/lib/supabase';

export const setupDatabase = async () => {
  // Create the update_client_balance function if it doesn't exist
  const { error } = await supabase.rpc('create_update_client_balance_function', {}, { count: 'exact' });
  
  if (error && error.message !== 'function create_update_client_balance_function() does not exist') {
    console.error('Error setting up database functions:', error);
  } else {
    // If the function doesn't exist, create it using raw SQL
    await supabase.rpc('create_update_client_balance_function');
  }
};

// Call this function when the app initializes
export const initializeDatabase = () => {
  setupDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
  });
};
