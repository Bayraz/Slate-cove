export interface AuthUser {
  id: string;
  email?: string;
}

/** Why a request failed, so the UI can respond sensibly. `message` is always safe to show a parent. */
export type AuthFailure = "invalid_credentials" | "existing_account" | "email_not_confirmed" | "weak_password" | "network" | "rate_limited" | "unknown";

export type AuthResult =
  | { ok: true; /** Sign-up succeeded but the project requires the email to be confirmed before sign-in. */ needsEmailConfirmation?: boolean }
  | { ok: false; reason: AuthFailure; message: string };

export interface AuthService {
  /** Current user if a valid session exists (restores a stored session on app start). */
  getUser(): Promise<AuthUser | null>;
  /** Subscribe to session changes (sign in/out, expiry). Returns an unsubscribe function. */
  onChange(listener: (user: AuthUser | null) => void): () => void;
  signUp(email: string, password: string): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<AuthResult>;
  requestPasswordReset(email: string): Promise<AuthResult>;
}
