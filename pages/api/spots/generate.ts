import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { parkingId, totalSpots } = req.body;

        if (!parkingId || !totalSpots) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if spots already exist to avoid duplicates
        const { count } = await supabase
            .from('spots')
            .select('*', { count: 'exact', head: true })
            .eq('parking_id', parkingId);

        if (count && count > 0) {
            return res.status(400).json({ message: 'Spots already exist for this parking.' });
        }

        const spotsToInsert = Array.from({ length: totalSpots }, (_, i) => ({
            parking_id: parkingId,
            number: `P-${(i + 1).toString().padStart(3, '0')}`,
            type: 'REGULAR' as const,
            status: 'AVAILABLE' as const,
            floor: 0,
        }));

        const { data, error } = await supabase
            .from('spots')
            .insert(spotsToInsert)
            .select();

        if (error) {
            console.error('Database insertion error:', error);
            return res.status(500).json({ message: error.message });
        }

        return res.status(201).json(data);
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}
