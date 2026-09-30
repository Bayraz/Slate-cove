import { z } from "zod";
import { defineTool } from "./registry";

export interface ListRemindersOutput {
  reminders: { title: string; dueAt: string; recurring: boolean }[];
}

export const listReminders = defineTool({
  name: "list_reminders",
  description: "List the family's reminders, soonest first. Open reminders only unless asked otherwise. Read-only.",
  input: z.object({ includeCompleted: z.boolean().default(false) }),
  sideEffect: "read",
  async run(input, ctx): Promise<ListRemindersOutput> {
    const reminders = await ctx.repos.reminders.list(ctx.familyId, { includeCompleted: input.includeCompleted });
    return { reminders: reminders.map((r) => ({ title: r.title, dueAt: r.dueAt, recurring: Boolean(r.recurrence) })) };
  },
  describeResult: () => "Looked at your reminders",
});
