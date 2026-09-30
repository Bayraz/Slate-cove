/**
 * Single place where environment variables are read.
 * Only EXPO_PUBLIC_* values exist in the client bundle, so nothing secret may
 * ever be read here. Secrets belong server-side (see README).
 */
export type DataSource = "mock" | "supabase";

const read = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const dataSource: DataSource =
  process.env.EXPO_PUBLIC_DATA_SOURCE === "supabase" ? "supabase" : "mock";

export const env = {
  dataSource,
  supabaseUrl: read(process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: read(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  aiEndpoint: read(process.env.EXPO_PUBLIC_AI_ENDPOINT),
  emergencyNumber: read(process.env.EXPO_PUBLIC_EMERGENCY_NUMBER) ?? "999",
} as const;

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
