import { MOCK_USER_ID } from "@/data/mock/mockData";
import type { AuthService, AuthUser } from "./types";

/**
 * Used ONLY when Supabase is not configured. There are no credentials and no
 * real account: the app simply runs as the demo parent. Sign-out is a no-op.
 */
export function createDemoAuthService(): AuthService {
  const user: AuthUser = { id: MOCK_USER_ID };
  return {
    getUser: async () => user,
    onChange: () => () => {},
    signUp: async () => ({ ok: true }),
    signIn: async () => ({ ok: true }),
    signOut: async () => ({ ok: true }),
    requestPasswordReset: async () => ({ ok: true }),
  };
}
