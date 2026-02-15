import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { User } from '../types';

// =================================================================================
// IMPORTANT: ACTION REQUIRED - PLEASE READ CAREFULLY
// =================================================================================
// The previous connection issues, including the "aistudio.google.com refused to connect"
// error, are being caused by incorrect Supabase project details.
//
// Please follow these steps to fix the application:
//
// 1. Go to your Supabase project dashboard: https://app.supabase.com/
// 2. Select the correct project for this app.
// 3. In the left sidebar, navigate to 'Project Settings' (the gear icon).
// 4. Click on 'API' in the settings menu.
// 5. Under 'Project API keys', you will find your 'Project URL' and your 'anon' 'public' key.
// 6. Copy the 'Project URL' and paste it into the `supabaseUrl` variable below,
//    replacing 'YOUR_SUPABASE_PROJECT_URL'.
// 7. Copy the 'anon' 'public' key and paste it into the `supabaseAnonKey` variable below,
//    replacing 'YOUR_SUPABASE_ANON_KEY'.
//
// Your app will not function correctly until these values are updated.
// =================================================================================

const supabaseUrl = 'https://pvhdilntpbmizvcxjwne.supabase.co'; // <-- PASTE YOUR SUPABASE URL HERE
const supabaseAnonKey = 'sb_publishable_rZJ2fEQpyL3il6ZXfVZ9EQ_DeNZQcEc'; // <-- PASTE YOUR SUPABASE ANON KEY HERE

// This flag will be used in the main App component to check if credentials are set.
// FIX: The original check for placeholder values is no longer needed
// since the Supabase credentials have been provided. This resolves the
// TypeScript error about comparing two different string literals.
export const isSupabaseConfigured = 
    supabaseUrl &&
    supabaseAnonKey;

// Conditionally create the Supabase client.
// If not configured, `supabase` will be null, and the app will show an error page.
let supabaseInstance: SupabaseClient | null = null;
if (isSupabaseConfigured) {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (error) {
        console.error("Error creating Supabase client. Please check if the URL is correct.", error);
    }
} else {
    console.error("Supabase URL or Anon Key is not configured. Please update services/supabaseClient.ts");
}

export const supabase = supabaseInstance;

export const getProfile = async (userId: string): Promise<User | null> => {
    // Gracefully handle the case where Supabase is not configured.
    if (!supabase) {
        console.error("getProfile failed: Supabase client is not initialized.");
        return null;
    }
    
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    
    // It's normal for this to error if no profile is found yet for a new user.
    // We only want to log other, unexpected errors.
    if (error && error.message !== 'JSON object requested, multiple (or no) rows returned') {
        console.error("Error fetching profile:", error);
        return null;
    }

    return data;
}