import { isLive } from "@/config/env";
import { createDemoAuthService } from "./demoAuthService";
import { createSupabaseAuthService } from "./supabaseAuthService";
import type { AuthService } from "./types";

export const isDemoMode = !isLive;

let service: AuthService | undefined;
export const getAuthService = (): AuthService => (service ??= isLive ? createSupabaseAuthService() : createDemoAuthService());

export type { AuthService, AuthUser, AuthResult, AuthFailure } from "./types";
