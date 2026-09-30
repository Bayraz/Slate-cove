import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getAuthService, isDemoMode } from "./index";
import type { AuthUser } from "./types";

interface AuthState {
  status: "loading" | "signedOut" | "signedIn";
  user: AuthUser | null;
  /** True when no backend is configured and the app runs on demo data. */
  isDemo: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const auth = getAuthService();
    let active = true;
    const apply = (next: AuthUser | null) => {
      if (!active) return;
      setUser(next);
      setStatus(next ? "signedIn" : "signedOut");
    };
    auth.getUser().then(apply, () => apply(null));
    const unsubscribe = auth.onChange(apply);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await getAuthService().signOut();
  }, []);

  const value = useMemo(() => ({ status, user, isDemo: isDemoMode, signOut }), [status, user, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
