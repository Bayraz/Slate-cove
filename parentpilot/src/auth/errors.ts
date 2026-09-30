import type { AuthFailure, AuthResult } from "./types";

const MESSAGES: Record<AuthFailure, string> = {
  invalid_credentials: "That email and password don't match.",
  existing_account: "An account with that email already exists. Try signing in instead.",
  email_not_confirmed: "Please confirm your email first. Check your inbox for our message.",
  weak_password: "Please choose a stronger password (at least 8 characters).",
  network: "We couldn't reach ParentPilot. Check your connection and try again.",
  rate_limited: "Too many attempts. Please wait a minute and try again.",
  unknown: "Something went wrong. Please try again.",
};

export const failure = (reason: AuthFailure): AuthResult => ({ ok: false, reason, message: MESSAGES[reason] });

interface ErrorLike {
  name?: string;
  code?: string;
  status?: number;
  message?: string;
}

/** Maps a Supabase AuthError (or a thrown fetch error) to a calm, non-technical failure. Pure. */
export function classifyAuthError(error: ErrorLike | null | undefined): AuthFailure {
  if (!error) return "unknown";
  if (error.name === "AuthRetryableFetchError" || error.status === 0 || /network|fetch failed|failed to fetch/i.test(error.message ?? "")) {
    return "network";
  }
  switch (error.code) {
    case "invalid_credentials":
      return "invalid_credentials";
    case "user_already_exists":
    case "email_exists":
      return "existing_account";
    case "email_not_confirmed":
      return "email_not_confirmed";
    case "weak_password":
      return "weak_password";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "rate_limited";
  }
  if (error.status === 429) return "rate_limited";
  return "unknown";
}
