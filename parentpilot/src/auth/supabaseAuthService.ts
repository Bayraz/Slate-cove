import type { AuthError, Session, User } from "@supabase/supabase-js";
import { getSupabase } from "@/data/supabase/client";
import { createLogger } from "@/utils/logger";
import { classifyAuthError, failure } from "./errors";
import type { AuthResult, AuthService, AuthUser } from "./types";

const log = createLogger("auth");

const toUser = (user: User | null | undefined): AuthUser | null =>
  user ? { id: user.id, email: user.email ?? undefined } : null;

const toResult = (error: AuthError | null): AuthResult => {
  if (!error) return { ok: true };
  const reason = classifyAuthError(error);
  log.warn("auth request failed", { status: error.status, code: error.code, reason });
  return failure(reason);
};

/** Any thrown error (offline, DNS, etc.) becomes a calm failure, never a crash. */
async function guarded(run: () => Promise<AuthResult>): Promise<AuthResult> {
  try {
    return await run();
  } catch (error) {
    log.error("auth request threw", error);
    return failure(classifyAuthError(error as Error));
  }
}

/**
 * Whether a sign-up response means "an account already exists".
 * With email confirmation ON, Supabase hides existing accounts by returning a
 * user with no identities (and no error) to prevent email enumeration. We must
 * not treat that as a successful new sign-up.
 */
export const isObfuscatedExistingUser = (user: Pick<User, "identities"> | null): boolean =>
  !!user && Array.isArray(user.identities) && user.identities.length === 0;

export function interpretSignUp(data: { user: Pick<User, "identities"> | null; session: Session | null }): AuthResult {
  if (isObfuscatedExistingUser(data.user)) return failure("existing_account");
  // No session means the project requires email confirmation before the account is usable.
  return data.session ? { ok: true } : { ok: true, needsEmailConfirmation: true };
}

export function createSupabaseAuthService(): AuthService {
  const auth = () => getSupabase().auth;
  return {
    async getUser() {
      try {
        // Restores the stored session and refreshes it if it has expired.
        const { data, error } = await auth().getSession();
        if (error) log.warn("session restore failed", { code: error.code, status: error.status });
        return toUser(data.session?.user);
      } catch (error) {
        log.error("session restore threw", error);
        return null;
      }
    },
    onChange(listener) {
      // Fires on sign-in, sign-out and when a refresh fails (expired session).
      const { data } = auth().onAuthStateChange((_event, session) => listener(toUser(session?.user)));
      return () => data.subscription.unsubscribe();
    },
    signUp: (email, password) =>
      guarded(async () => {
        const { data, error } = await auth().signUp({ email, password });
        return error ? toResult(error) : interpretSignUp(data);
      }),
    signIn: (email, password) =>
      guarded(async () => toResult((await auth().signInWithPassword({ email, password })).error)),
    signOut: () => guarded(async () => toResult((await auth().signOut()).error)),
    requestPasswordReset: (email) => guarded(async () => toResult((await auth().resetPasswordForEmail(email)).error)),
  };
}
