
import supabase from '@/lib/supabase';
import type { Database } from './types';

// Re-export the supabase instance from the central location
export { supabase };

// This file is kept for backward compatibility
// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
