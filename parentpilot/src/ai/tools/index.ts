import { getChildInformation } from "./getChildInformation";
import { listReminders } from "./listReminders";
import { ToolRegistry } from "./registry";
import { searchMemory } from "./searchMemory";

/**
 * Every tool the assistant may use. If it isn't in this list, the assistant
 * cannot call it. Foundation stage: read-only tools only.
 * See README, "How to add a new AI tool".
 */
export const createToolRegistry = () => new ToolRegistry([getChildInformation, searchMemory, listReminders]);

export { ToolRegistry } from "./registry";
export type { ToolContext, ToolResult, ToolName } from "./types";
export { PLANNED_TOOL_NAMES } from "./types";
