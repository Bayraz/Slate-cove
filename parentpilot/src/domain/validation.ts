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

// ---- Family / children ------------------------------------------------------

/** A calendar date as YYYY-MM-DD. */
export const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Use a valid date");

const name = (label: string) => z.string().trim().min(1, `Please enter ${label}`).max(60, "That's a bit long");

export const addChildInput = z.object({
  name: name("your child's name"),
  dateOfBirth: dateOnly,
});
export type AddChildInput = z.infer<typeof addChildInput>;

/** The only things we ask a new parent: what to call them, and their first child. */
export const onboardingInput = z.object({
  displayName: name("your name"),
  childName: name("your child's name"),
  childDateOfBirth: dateOnly,
});
export type OnboardingInput = z.infer<typeof onboardingInput>;

// ---- Reminders (update) -----------------------------------------------------

export const updateReminderInput = z
  .object({
    title: z.string().trim().min(1).max(140),
    description: z.string().trim().max(1000).nullable(),
    dueAt: isoDateTime,
    childId: z.string().nullable(),
    recurrence: recurrenceSchema.nullable(),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, "Nothing to update");
export type UpdateReminderInput = z.infer<typeof updateReminderInput>;
