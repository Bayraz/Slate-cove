import { createLogger } from "@/utils/logger";
import { crisisReply, emergencyReply, guardActionClaims, screenMessage } from "./safety";
import type { ToolRegistry } from "./tools";
import type { ToolContext } from "./tools/types";
import type { AiProvider, ChatMessage, ToolActivity, ToolExchange } from "./types";

const log = createLogger("ai");
const MAX_TOOL_CALLS = 3;

export interface AssistantReply {
  text: string;
  tone: NonNullable<ChatMessage["tone"]>;
  toolActivity: ToolActivity[];
}

export interface OrchestratorDeps {
  provider: AiProvider;
  registry: ToolRegistry;
  context: ToolContext;
}

/**
 * One assistant turn:
 *   safety screen -> provider interprets -> approved tool runs -> result returns
 *   -> provider explains -> honesty guard -> reply.
 * The provider never sees repositories; it can only name a registered tool.
 */
export async function runAssistantTurn(history: ChatMessage[], deps: OrchestratorDeps): Promise<AssistantReply> {
  const { provider, registry, context } = deps;
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastUser) return { text: "What can I take care of?", tone: "normal", toolActivity: [] };

  const screen = screenMessage(lastUser.text);
  if (screen.level === "emergency") return { text: emergencyReply(), tone: "safety", toolActivity: [] };
  if (screen.level === "crisis") return { text: crisisReply(), tone: "safety", toolActivity: [] };

  const toolExchanges: ToolExchange[] = [];
  const toolActivity: ToolActivity[] = [];
  let successfulWrites = 0;

  try {
    for (let i = 0; i <= MAX_TOOL_CALLS; i++) {
      const step = await provider.next({
        messages: history,
        tools: registry.specs(),
        toolExchanges,
        healthTopic: screen.level === "health",
      });

      if (step.type === "message") {
        return {
          text: guardActionClaims(step.text, successfulWrites),
          tone: "normal",
          toolActivity,
        };
      }
      if (i === MAX_TOOL_CALLS) break;

      // Write tools are never auto-confirmed here: a parent must approve them in the UI (future stage).
      const result = await registry.execute(step.name, step.input, context);
      toolExchanges.push({ name: step.name, input: step.input, result });
      toolActivity.push({ tool: step.name, ok: result.ok, summary: result.ok ? result.summary : "Couldn't complete that" });
      if (result.ok && registry.isWriteTool(step.name)) successfulWrites += 1;
    }
    log.warn("tool call limit reached");
    return { text: "I couldn't finish that. Nothing has been changed.", tone: "error", toolActivity };
  } catch (error) {
    log.error("assistant turn failed", error);
    return { text: "Sorry, something went wrong on my side. Nothing has been changed. Please try again.", tone: "error", toolActivity };
  }
}
