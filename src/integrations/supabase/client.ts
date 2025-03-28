
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xvnoxduraiasvxjnaqvm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bm94ZHVyYWlhc3Z4am5hcXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTc4MzIsImV4cCI6MjA1ODM5MzgzMn0.ULbO1_G_1I4h83utyLlRCZE9AKkHO5d4_dUgZe9xq4M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
