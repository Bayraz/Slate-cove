import { appMode, env } from "@/config/env";
import { createLogger } from "@/utils/logger";
import { createMockRepositories } from "./mock/mockRepositories";
import type { Repositories } from "./repositories";
import { getSupabase } from "./supabase/client";
import { createSupabaseRepositories } from "./supabase/supabaseRepositories";

const log = createLogger("data");

let instance: Repositories | undefined;

/**
 * The one place that decides where data comes from.
 *  - live: Supabase, as the signed-in user (RLS enforced by Postgres)
 *  - demo: in-memory sample data, never persisted
 * The mode is decided once from configuration and covers auth AND data together,
 * so sample data is never mixed with a real user's data.
 */
export function getRepositories(): Repositories {
  if (!instance) {
    if (appMode === "live") {
      instance = createSupabaseRepositories(getSupabase());
    } else {
      log.info("Running in demo mode with sample data.");
      instance = createMockRepositories({ empty: env.demoScenario === "empty" });
    }
  }
  return instance;
}

export type { FamilyContext, Repositories } from "./repositories";
export { DataError } from "./repositories";
