import type { z } from "zod";
import type { Repositories } from "@/data/repositories";

/** Names of every tool the product will eventually support. Only some are implemented. */
export const PLANNED_TOOL_NAMES = [
  "get_child_information",
  "save_memory",
  "search_memory",
  "create_reminder",
  "list_reminders",
  "update_reminder",
  "delete_reminder",
  "get_calendar_events",
  "create_calendar_event",
  "update_calendar_event",
  "delete_calendar_event",
  "log_baby_event",
  "get_baby_history",
  "search_trusted_information",
  "search_products",
  "search_community",
] as const;
export type ToolName = (typeof PLANNED_TOOL_NAMES)[number];

/**
 * Everything a tool is allowed to touch. Tools get repositories already
 * scoped by the family below, NOT a database client. There is no way to run
 * arbitrary queries from inside a tool.
 */
export interface ToolContext {
  familyId: string;
  caregiverId: string;
  repos: Repositories;
  now: () => Date;
}

export interface ToolDefinition<TSchema extends z.ZodType = z.ZodType, TOutput = unknown> {
  name: ToolName;
  /** Written for the model: when to use this tool. */
  description: string;
  /** Validated with zod BEFORE run() is called. Model output is untrusted input. */
  input: TSchema;
  /**
   * "read" tools may run freely. "write" tools change state and require the
   * caller to pass `confirmed: true` (i.e. the parent approved it in the UI).
   */
  sideEffect: "read" | "write";
  run(input: z.output<TSchema>, ctx: ToolContext): Promise<TOutput>;
  /** Short past-tense line shown to the parent, only after the tool actually ran. */
  describeResult(output: TOutput): string;
}

export type ToolErrorCode = "unknown_tool" | "invalid_input" | "confirmation_required" | "failed";

export type ToolResult =
  | { ok: true; tool: ToolName; data: unknown; summary: string }
  | { ok: false; tool: string; error: { code: ToolErrorCode; message: string } };
