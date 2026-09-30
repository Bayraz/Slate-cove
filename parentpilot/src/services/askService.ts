import { runAssistantTurn, type AssistantReply } from "@/ai/orchestrator";
import { getAiProvider } from "@/ai/providers";
import { createToolRegistry } from "@/ai/tools";
import type { ChatMessage } from "@/ai/types";
import type { Repositories } from "@/data";
import { localId } from "@/utils/id";

export const MAX_MESSAGE_LENGTH = 1000;

export type ValidatedMessage = { ok: true; text: string } | { ok: false; message: string };

export function validateUserMessage(raw: string): ValidatedMessage {
  const text = raw.trim();
  if (!text) return { ok: false, message: "Type a message first." };
  if (text.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, message: `That's a bit long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.` };
  }
  return { ok: true, text };
}

export const newMessage = (role: ChatMessage["role"], text: string, extra: Partial<ChatMessage> = {}): ChatMessage => ({
  id: localId("msg"),
  role,
  text,
  createdAt: new Date().toISOString(),
  ...extra,
});

/** Wires the AI provider, tool registry and family-scoped context together for the UI. */
export function createAssistant(scope: { familyId: string; caregiverId: string; repos: Repositories }) {
  const provider = getAiProvider();
  const registry = createToolRegistry();
  const context = { ...scope, now: () => new Date() };
  return {
    isPreview: provider.isPreview,
    reply: (history: ChatMessage[]): Promise<AssistantReply> => runAssistantTurn(history, { provider, registry, context }),
  };
}

/** Starter prompts. Only ones the current assistant can genuinely handle; grow as tools land. */
export function suggestedPrompts(childName?: string): string[] {
  return [
    "What reminders do I have?",
    childName ? `How old is ${childName}?` : "Tell me about my baby",
    "What did I save about my health visitor?",
  ];
}
