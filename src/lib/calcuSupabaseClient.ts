
import { createClient } from '@supabase/supabase-js';

// Access environment variables in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Key missing in VITE environment variables. Persistence will not work.');
}

// Create a single supabase client for interacting with your database
export const calcuSupabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '');
