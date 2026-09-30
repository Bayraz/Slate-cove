import { env } from "@/config/env";
import { createLogger } from "@/utils/logger";
import type { AiProvider } from "../types";
import { previewProvider } from "./previewProvider";

const log = createLogger("ai.provider");

/**
 * TODO(stage: ai): when env.aiEndpoint is set, return a provider that calls
 * the server-side function (which holds the model API key, applies
 * SAFETY_POLICY_PROMPT and returns ProviderSteps). Not built yet, so we never
 * pretend: without it the honest preview provider is used.
 */
export function getAiProvider(): AiProvider {
  if (env.aiEndpoint) log.warn("EXPO_PUBLIC_AI_ENDPOINT is set but no remote provider is implemented yet.");
  return previewProvider;
}
