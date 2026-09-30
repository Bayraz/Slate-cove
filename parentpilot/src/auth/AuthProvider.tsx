import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getAuthService, isDemoMode } from "./index";
import type { AuthUser } from "./types";

interface AuthState {
  status: "loading" | "signedOut" | "signedIn";
  user: AuthUser | null;
  /** True when no backend is configured and the app runs on demo data. */
  isDemo: boolean;
  /** Set when a signed-in session ended without the parent choosing to sign out (e.g. expired). */
  notice?: "session_ended";
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [notice, setNotice] = useState<AuthState["notice"]>();
  const wasSignedIn = useRef(false);
  const choseToSignOut = useRef(false);

  useEffect(() => {
    const auth = getAuthService();
    let active = true;
    const apply = (next: AuthUser | null) => {
      if (!active) return;
      if (!next && wasSignedIn.current && !choseToSignOut.current) setNotice("session_ended");
      if (next) setNotice(undefined);
      wasSignedIn.current = !!next;
      if (!next) choseToSignOut.current = false;
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
    choseToSignOut.current = true;
    const result = await getAuthService().signOut();
    if (!result.ok) choseToSignOut.current = false;
  }, []);

  const value = useMemo(() => ({ status, user, notice, isDemo: isDemoMode, signOut }), [status, user, notice, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
