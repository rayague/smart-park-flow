import { testSupabaseConnection } from '../lib/supabase';

export default async function handler(req, res) {
  try {
    await testSupabaseConnection();
    res.status(200).json({ success: true, message: 'Connexion Supabase OK' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
