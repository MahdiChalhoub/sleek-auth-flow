
import { createClient } from '@supabase/supabase-js';

// Use the same configuration that we have in integrations/supabase/client.ts
const supabaseUrl = "https://xvnoxduraiasvxjnaqvm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bm94ZHVyYWlhc3Z4am5hcXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTc4MzIsImV4cCI6MjA1ODM5MzgzMn0.ULbO1_G_1I4h83utyLlRCZE9AKkHO5d4_dUgZe9xq4M";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the initialization function from setupDatabase module, don't call it here
import { initializeDatabase as initDb } from '@/api/setupDatabase';

// Export the function without circular dependency
export const initializeDatabase = initDb;
