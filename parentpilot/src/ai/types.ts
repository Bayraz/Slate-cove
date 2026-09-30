export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
  /** Tools that REALLY ran to produce this reply (never inferred from the text). */
  toolActivity?: ToolActivity[];
  tone?: "normal" | "safety" | "error";
}

export interface ToolActivity {
  tool: string;
  ok: boolean;
  /** Human-readable, e.g. "Looked at your reminders". Only shown if the tool actually ran. */
  summary: string;
}

/** JSON-schema description of a tool, handed to the model provider. */
export interface ToolSpec {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface ToolExchange {
  name: string;
  input: unknown;
  /** The registry's result, exactly as returned. */
  result: import("./tools/types").ToolResult;
}

export interface ProviderRequest {
  messages: ChatMessage[];
  tools: ToolSpec[];
  /** Tool calls already made this turn and what they returned. */
  toolExchanges: ToolExchange[];
  /** True when the safety screen flagged a health-related topic. */
  healthTopic: boolean;
}

export type ProviderStep =
  | { type: "message"; text: string }
  | { type: "tool_call"; name: string; input: unknown };

/**
 * Anything that can interpret a request and either ask for an approved tool
 * or produce a final message. A real LLM provider (running server-side so the
 * API key never ships in the app) implements this same interface.
 */
export interface AiProvider {
  id: string;
  /** Preview providers are not a real AI; the UI says so. */
  isPreview: boolean;
  next(request: ProviderRequest): Promise<ProviderStep>;
}
