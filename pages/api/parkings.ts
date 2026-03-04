import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use service role key if available for administrative actions, 
// otherwise use anon key. On the server, we prefer service role to ensure 
// we can insert the record even if RLS is strict, but we must verify the user.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PATCH') {
        try {
            const { id, name, address, city, totalSpots, pricePerHour, hasEvCharging, openingHours } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'Missing parking ID' });
            }

            const updateData: any = {};
            if (name !== undefined) updateData.name = name;
            if (address !== undefined) updateData.address = address;
            if (city !== undefined) updateData.city = city;

            if (totalSpots !== undefined) {
                // Fetch current data to preserve occupancy logic
                const { data: current } = await supabase
                    .from('parkings')
                    .select('total_spots, available_spots')
                    .eq('id', id)
                    .single();

                if (current) {
                    const occupied = Math.max(0, current.total_spots - current.available_spots);
                    updateData.total_spots = totalSpots;
                    // Available cannot exceed new total, and we preserve occupied spots if possible
                    updateData.available_spots = Math.max(0, totalSpots - occupied);
                } else {
                    updateData.total_spots = totalSpots;
                    updateData.available_spots = totalSpots; // Fallback
                }
            }

            if (pricePerHour !== undefined) updateData.price_per_hour = pricePerHour;
            if (hasEvCharging !== undefined) updateData.has_ev_charging = hasEvCharging;
            if (openingHours?.open !== undefined) updateData.opening_time = openingHours.open;
            if (openingHours?.close !== undefined) updateData.closing_time = openingHours.close;

            const { data, error } = await supabase
                .from('parkings')
                .update(updateData)
                .eq('id', id)
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

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, address, city, totalSpots, pricePerHour, hasEvCharging, openingHours, managerId } = req.body;

        // Basic validation
        if (!name || !address || !city || !managerId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const { data, error } = await supabase
            .from('parkings')
            .insert({
                name,
                address,
                city,
                total_spots: totalSpots,
                available_spots: totalSpots,
                price_per_hour: pricePerHour,
                has_ev_charging: hasEvCharging,
                opening_time: openingHours.open,
                closing_time: openingHours.close,
                status: 'ACTIVE',
                manager_id: managerId,
                latitude: 0,
                longitude: 0,
                rating: 0,
                images: [],
                amenities: [],
            })
            .select()
            .single();

        if (error) {
            console.error('Database insertion error:', error);
            return res.status(500).json({ message: error.message });
        }

        const parking = data;

        // Automatically generate spots
        if (totalSpots > 0) {
            const spotsToInsert = Array.from({ length: totalSpots }, (_, i) => ({
                parking_id: parking.id,
                number: `P-${(i + 1).toString().padStart(3, '0')}`,
                type: 'REGULAR' as const,
                status: 'AVAILABLE' as const,
                floor: 0,
            }));

            const { error: spotsError } = await supabase
                .from('spots')
                .insert(spotsToInsert);

            if (spotsError) {
                console.error('Error generating spots:', spotsError);
                // We don't fail the whole request since the parking was created, 
                // but we log it for the "Generate Spots" button to handle.
            }
        }

        return res.status(201).json(parking);
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}
