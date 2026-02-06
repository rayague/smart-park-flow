
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function SupabaseTestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function checkConnection() {
      try {
        // On tente de récupérer une table existante (remplace 'test' par une table réelle si besoin)
        const { data, error } = await supabase.from('test').select('*').limit(1);
        if (error) throw error;
        setStatus('success');
        setMessage('Connexion Supabase réussie !');
      } catch (err) {
        setStatus('error');
        setMessage('Erreur de connexion : ' + (err.message || err));
      }
    }
    checkConnection();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Test connexion Supabase</h1>
      <p>Status : {status}</p>
      <p>{message}</p>
    </div>
  );
}
