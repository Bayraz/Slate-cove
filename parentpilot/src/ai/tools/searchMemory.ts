import { z } from "zod";
import type { MemoryKind } from "@/domain/models";
import { memoryKindSchema } from "@/domain/validation";
import { defineTool } from "./registry";

export interface SearchMemoryOutput {
  matches: { content: string; kind: MemoryKind; savedOn: string }[];
}

export const searchMemory = defineTool({
  name: "search_memory",
  description:
    "Search the things this family has asked ParentPilot to remember (preferences, contacts, notes about the children, saved questions). Read-only.",
  input: z.object({
    query: z.string().trim().min(1, "What should I look for?").max(200),
    limit: z.number().int().min(1).max(10).default(5),
    kind: memoryKindSchema.optional(),
  }),
  sideEffect: "read",
  async run(input, ctx): Promise<SearchMemoryOutput> {
    const found = await ctx.repos.memories.search(ctx.familyId, input.query, input.limit);
    return {
      matches: found
        .filter((m) => !input.kind || m.kind === input.kind)
        .map((m) => ({ content: m.content, kind: m.kind, savedOn: m.createdAt })),
    };
  },
  describeResult: () => "Searched what you've saved",
});
