import type { AuthError, User } from "@supabase/supabase-js";
import { getSupabase } from "@/data/supabase/client";
import { createLogger } from "@/utils/logger";
import type { AuthResult, AuthService, AuthUser } from "./types";

const log = createLogger("auth");

const toUser = (user: User | null | undefined): AuthUser | null =>
  user ? { id: user.id, email: user.email ?? undefined } : null;

// Show calm, non-technical messages. Never echo raw backend errors to the parent.
const friendly = (error: AuthError | null): AuthResult => {
  if (!error) return { ok: true };
  log.warn("auth request failed", { status: error.status, code: error.code });
  if (error.code === "invalid_credentials") return { ok: false, message: "That email and password don't match." };
  if (error.code === "user_already_exists") return { ok: false, message: "An account with that email already exists." };
  if (error.code === "weak_password") return { ok: false, message: "Please choose a stronger password." };
  return { ok: false, message: "Something went wrong. Please try again." };
};

export function createSupabaseAuthService(): AuthService {
  const supabase = () => getSupabase();
  return {
    async getUser() {
      const { data } = await supabase().auth.getSession();
      return toUser(data.session?.user);
    },
    onChange(listener) {
      const { data } = supabase().auth.onAuthStateChange((_event, session) => listener(toUser(session?.user)));
      return () => data.subscription.unsubscribe();
    },
    async signUp(email, password) {
      const { error } = await supabase().auth.signUp({ email, password });
      return friendly(error);
    },
    async signIn(email, password) {
      const { error } = await supabase().auth.signInWithPassword({ email, password });
      return friendly(error);
    },
    async signOut() {
      const { error } = await supabase().auth.signOut();
      return friendly(error);
    },
    async requestPasswordReset(email) {
      // TODO(stage: auth): set redirectTo to the app's deep link and build the "set new password" screen.
      const { error } = await supabase().auth.resetPasswordForEmail(email);
      return friendly(error);
    },
  };
}
