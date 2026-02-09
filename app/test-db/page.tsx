'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDB() {
    const [status, setStatus] = useState<string>('Testing connection...');
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function checkConnection() {
            try {
                // Try to fetch profiles from the database
                // Using count to avoid RLS recursion issues

                const { count, error: countError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                if (countError) {
                    throw countError;
                }

                setStatus('Connected successfully!');
                setData({ message: `Database connected! Found ${count} profile(s) in the database.` });
            } catch (err: any) {
                setError(err.message || 'Unknown error');
                setStatus('Connection failed');
            }
        }

        checkConnection();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>

            <div className="mb-4">
                <strong>Status:</strong> <span className={status.includes('failed') ? 'text-red-500' : 'text-green-500'}>{status}</span>
            </div>

            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {data && (
                <div className="p-4 bg-gray-100 rounded overflow-auto">
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
