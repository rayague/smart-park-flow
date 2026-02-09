import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // Only throw in browser/runtime if missing, to allow build to pass if just type checking
  if (typeof window !== 'undefined') {
    console.error('Supabase environment variables are not set.');
  }
}

export const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '');

