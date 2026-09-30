import { isSupabaseConfigured } from "@/config/env";
import { createDemoAuthService } from "./demoAuthService";
import { createSupabaseAuthService } from "./supabaseAuthService";
import type { AuthService } from "./types";

export const isDemoMode = !isSupabaseConfigured;

let service: AuthService | undefined;
export const getAuthService = (): AuthService =>
  (service ??= isSupabaseConfigured ? createSupabaseAuthService() : createDemoAuthService());

export type { AuthService, AuthUser, AuthResult } from "./types";
