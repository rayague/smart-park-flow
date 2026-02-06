import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction de test de connexion
export async function testSupabaseConnection() {
  const { data, error } = await supabase.from('test').select('*').limit(1);
  if (error) {
    throw new Error('Erreur de connexion à Supabase : ' + error.message);
  }
  return data;
}
