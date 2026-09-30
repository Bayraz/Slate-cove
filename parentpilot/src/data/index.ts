import { env } from "@/config/env";
import { createLogger } from "@/utils/logger";
import { createMockRepositories } from "./mock/mockRepositories";
import type { Repositories } from "./repositories";

const log = createLogger("data");

let instance: Repositories | undefined;

/**
 * The one place that decides where data comes from.
 * TODO(stage: backend): when dataSource === "supabase", return
 * createSupabaseRepositories(getSupabase()). Until it exists we fall back to
 * mock data and say so loudly rather than silently pretending.
 */
export function getRepositories(): Repositories {
  if (!instance) {
    if (env.dataSource === "supabase") {
      log.warn("Supabase repositories are not implemented yet; using mock demo data.");
    }
    instance = createMockRepositories();
  }
  return instance;
}

export const isUsingMockData = true; // flips when real repositories land
export type { Repositories } from "./repositories";
