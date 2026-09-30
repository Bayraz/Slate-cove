import { z } from "zod";

/** Input validation shared by services and AI tools. */
export const isoDateTime = z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Must be a valid date/time");

export const memoryKindSchema = z.enum([
  "preference",
  "contact",
  "child_note",
  "medical_guidance",
  "question",
  "general",
]);

export const recurrenceSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly"]),
  interval: z.number().int().min(1).max(365),
  until: isoDateTime.optional(),
});

export const createReminderInput = z.object({
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().max(1000).optional(),
  dueAt: isoDateTime,
  childId: z.string().optional(),
  recurrence: recurrenceSchema.optional(),
});
export type CreateReminderInput = z.infer<typeof createReminderInput>;

export const createMemoryInput = z.object({
  kind: memoryKindSchema,
  content: z.string().trim().min(1).max(2000),
  childId: z.string().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
});
export type CreateMemoryInput = z.infer<typeof createMemoryInput>;
