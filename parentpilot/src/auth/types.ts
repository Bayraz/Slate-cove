export interface AuthUser {
  id: string;
  email?: string;
}

export type AuthResult = { ok: true } | { ok: false; message: string };

export interface AuthService {
  /** Current user if a session exists. */
  getUser(): Promise<AuthUser | null>;
  /** Subscribe to session changes. Returns an unsubscribe function. */
  onChange(listener: (user: AuthUser | null) => void): () => void;
  signUp(email: string, password: string): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<AuthResult>;
  requestPasswordReset(email: string): Promise<AuthResult>;
}
