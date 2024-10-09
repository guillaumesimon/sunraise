import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use client-side storage for session persistence
const isBrowser = typeof window !== 'undefined'; // Check if it's running on the browser

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // This ensures sessions are persisted
    storage: isBrowser ? localStorage : null, // Only use localStorage on the client side
  },
});
