
import { createClient } from '@supabase/supabase-js';

// Use the same configuration that we have in integrations/supabase/client.ts
const supabaseUrl = "https://xvnoxduraiasvxjnaqvm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bm94ZHVyYWlhc3Z4am5hcXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTc4MzIsImV4cCI6MjA1ODM5MzgzMn0.ULbO1_G_1I4h83utyLlRCZE9AKkHO5d4_dUgZe9xq4M";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize database stored procedures
export const initializeDatabase = async () => {
  // Check if our database function exists
  try {
    const { data, error } = await supabase.rpc('update_client_balance', { 
      p_client_id: '00000000-0000-0000-0000-000000000000',
      p_amount: 0
    });
    
    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      console.log('Creating database functions...');
      await createDatabaseFunctions();
    }
  } catch (error) {
    console.error('Error checking database functions:', error);
    // Try to create them anyway
    await createDatabaseFunctions();
  }
};

async function createDatabaseFunctions() {
  const { error } = await supabase.rpc('create_update_client_balance_function');
  
  if (error) {
    console.error('Error creating database functions:', error);
    
    // If the RPC doesn't exist, we need to create the function using raw SQL
    // This is handled in a separate SQL migration
  }
}
