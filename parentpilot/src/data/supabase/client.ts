import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/config/env";

let client: SupabaseClient | undefined;

/** Lazily creates the Supabase client. Throws if env is not configured; check `isSupabaseConfigured` first. */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured || !env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.");
  }
  client ??= createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}
