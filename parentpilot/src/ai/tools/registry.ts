import { z } from "zod";
import type { ToolSpec } from "../types";
import { createLogger } from "@/utils/logger";
import type { ToolContext, ToolDefinition, ToolResult } from "./types";

const log = createLogger("ai.tools");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTool = ToolDefinition<any, any>;

/** Helper so each tool gets full type inference for its input and output. */
export const defineTool = <TSchema extends z.ZodType, TOutput>(tool: ToolDefinition<TSchema, TOutput>) => tool;

export class ToolRegistry {
  private readonly tools = new Map<string, AnyTool>();

  constructor(tools: AnyTool[]) {
    for (const tool of tools) {
      if (this.tools.has(tool.name)) throw new Error(`Duplicate tool: ${tool.name}`);
      this.tools.set(tool.name, tool);
    }
  }

  has(name: string) {
    return this.tools.has(name);
  }

  /** Descriptions handed to the model. Only registered (approved) tools are ever listed. */
  specs(): ToolSpec[] {
    return [...this.tools.values()].map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: z.toJSONSchema(t.input) as Record<string, unknown>,
    }));
  }

  isWriteTool(name: string) {
    return this.tools.get(name)?.sideEffect === "write";
  }

  /**
   * The ONLY way the AI can act: look up an approved tool, validate its input,
   * enforce confirmation for writes, run it, and return a typed result.
   * Never throws; callers get a ToolResult either way.
   */
  async execute(
    name: string,
    rawInput: unknown,
    ctx: ToolContext,
    options: { confirmed?: boolean } = {},
  ): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return { ok: false, tool: name, error: { code: "unknown_tool", message: "That action isn't available." } };
    }
    const parsed = tool.input.safeParse(rawInput ?? {});
    if (!parsed.success) {
      log.warn("tool input rejected", { tool: name });
      return {
        ok: false,
        tool: name,
        error: { code: "invalid_input", message: parsed.error.issues[0]?.message ?? "Invalid input" },
      };
    }
    if (tool.sideEffect === "write" && !options.confirmed) {
      return {
        ok: false,
        tool: name,
        error: { code: "confirmation_required", message: "This needs your confirmation first." },
      };
    }
    const started = Date.now();
    try {
      const data = await tool.run(parsed.data, ctx);
      log.debug("tool ran", { tool: name, ms: Date.now() - started });
      return { ok: true, tool: tool.name, data, summary: tool.describeResult(data) };
    } catch (error) {
      log.error(`tool ${name} failed`, error);
      return { ok: false, tool: name, error: { code: "failed", message: "Something went wrong doing that." } };
    }
  }
}
