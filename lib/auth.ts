import { supabase } from './supabase';

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function upsertProfile(profile: {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
    role?: 'USER' | 'MANAGER' | 'ADMIN';
    avatar_url?: string | null;
}) {
    const { data, error } = await supabase
        .from('profiles')
        .upsert(
            {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                phone: profile.phone ?? null,
                role: profile.role ?? 'USER',
                avatar_url: profile.avatar_url ?? null,
                updated_at: new Date().toISOString(),
            } as any,
            { onConflict: 'id' }
        )
        .select('*')
        .single();

    if (error) throw error;
    return data;
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, metadata?: {
    name?: string;
    role?: 'USER' | 'MANAGER' | 'ADMIN';
}) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
        },
    });

    if (error) throw error;
    return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Get the current user session
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
}

/**
 * Get the current session
 */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
}

/**
 * Get user profile from profiles table
 */
export async function getProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
}
