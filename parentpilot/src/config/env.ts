/**
 * Single place where environment variables are read.
 * Only EXPO_PUBLIC_* values exist in the client bundle, so nothing secret may
 * ever be read here. Secrets belong server-side (see README).
 */
const read = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const supabaseUrl = read(process.env.EXPO_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = read(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

const validUrl = (value: string | undefined) => {
  try {
    return value ? /^https?:$/.test(new URL(value).protocol) : false;
  } catch {
    return false;
  }
};

export const env = {
  supabaseUrl,
  supabaseAnonKey,
  aiEndpoint: read(process.env.EXPO_PUBLIC_AI_ENDPOINT),
  emergencyNumber: read(process.env.EXPO_PUBLIC_EMERGENCY_NUMBER) ?? "999",
  /** Demo mode only: start with an empty family to try onboarding without a backend. */
  demoScenario: process.env.EXPO_PUBLIC_DEMO_SCENARIO === "empty" ? ("empty" as const) : ("full" as const),
} as const;

export type ConfigStatus =
  | { mode: "live" }
  | { mode: "demo"; reason: "not_configured" | "incomplete" | "invalid_url" | "forced" };

/** Pure so it can be tested. `forceDemo` is EXPO_PUBLIC_DATA_SOURCE=mock. */
export function resolveConfig(input: { url?: string; anonKey?: string; forceDemo?: boolean }): ConfigStatus {
  if (input.forceDemo) return { mode: "demo", reason: "forced" };
  if (!input.url && !input.anonKey) return { mode: "demo", reason: "not_configured" };
  if (!input.url || !input.anonKey) return { mode: "demo", reason: "incomplete" };
  if (!validUrl(input.url)) return { mode: "demo", reason: "invalid_url" };
  return { mode: "live" };
}

export const configStatus = resolveConfig({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  forceDemo: process.env.EXPO_PUBLIC_DATA_SOURCE === "mock",
});

/**
 * "live" = real Supabase auth AND real Supabase data. "demo" = demo user AND
 * in-memory demo data. One switch for both, so demo and real data never mix.
 */
export const appMode = configStatus.mode;
export const isLive = appMode === "live";

/** A calm, non-technical explanation for the demo banner. */
export function demoReasonText(status: ConfigStatus): string | undefined {
  if (status.mode === "live") return undefined;
  switch (status.reason) {
    case "incomplete":
      return "Demo mode: the Supabase settings are incomplete (both the URL and the key are needed).";
    case "invalid_url":
      return "Demo mode: the Supabase URL isn't a valid web address.";
    default:
      return "Demo mode: sample data, not saved anywhere.";
  }
}
