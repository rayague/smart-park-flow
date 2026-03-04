import { NextApiRequest, NextApiResponse } from 'next';
import { testSupabaseConnection } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await testSupabaseConnection();
    res.status(200).json({ success: true, message: 'Connexion Supabase OK' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
