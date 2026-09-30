import { z } from "zod";
import { formatAge } from "@/utils/dates";
import { defineTool } from "./registry";

export interface ChildInfoOutput {
  children: {
    name: string;
    age: string;
    importantNotes: string[];
    feeding?: string;
    sleep?: string;
  }[];
}

export const getChildInformation = defineTool({
  name: "get_child_information",
  description:
    "Get saved details about the family's children (name, age, important notes, feeding and sleep info). " +
    "Optionally filter by child name. Read-only.",
  input: z.object({ childName: z.string().trim().max(80).optional() }),
  sideEffect: "read",
  async run(input, ctx): Promise<ChildInfoOutput> {
    const children = await ctx.repos.family.listChildren(ctx.familyId);
    const wanted = input.childName?.toLowerCase();
    return {
      children: children
        .filter((c) => !wanted || c.name.toLowerCase() === wanted)
        .map((c) => ({
          name: c.name,
          age: formatAge(c.dateOfBirth, ctx.now()),
          importantNotes: c.importantNotes,
          feeding: [c.feeding?.method, c.feeding?.notes].filter(Boolean).join(" · ") || undefined,
          sleep: c.sleep?.notes,
        })),
    };
  },
  describeResult: (out) => (out.children.length ? "Looked at your child's saved details" : "Checked saved child details"),
});
