import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { spotId, status, type } = req.body;

        if (!spotId) {
            return res.status(400).json({ message: 'Missing spotId' });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (type) updateData.type = type;
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('spots')
            .update(updateData)
            .eq('id', spotId)
            .select()
            .single();

        if (error) {
            console.error('Database update error:', error);
            return res.status(500).json({ message: error.message });
        }

        return res.status(200).json(data);
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}
