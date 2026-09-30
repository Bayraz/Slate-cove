import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";
import { env, isLive } from "@/config/env";

let client: SupabaseClient | undefined;

/**
 * Lazily creates the Supabase client with the public anon key ONLY.
 * The service-role key must never exist in this app: row-level security, not
 * key secrecy, is what protects family data.
 * Throws if not in live mode; check `isLive` first.
 */
export function getSupabase(): SupabaseClient {
  if (!isLive || !env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.");
  }
  if (!client) {
    const created = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    // On native, only refresh tokens while the app is in the foreground (Supabase's recommendation).
    if (Platform.OS !== "web") {
      AppState.addEventListener("change", (state) => {
        if (state === "active") created.auth.startAutoRefresh();
        else created.auth.stopAutoRefresh();
      });
    }
    client = created;
  }
  return client;
}
