import type { Repositories } from "@/data";
import type { Reminder } from "@/domain/models";
import { createReminderInput, updateReminderInput, type CreateReminderInput } from "@/domain/validation";
import { toFailure, type ServiceResult } from "./familyService";

/**
 * Anything that can really schedule a native notification (expo-notifications
 * in a later stage). Until one exists, `unavailableScheduler` is used and NO
 * notification is ever reported as scheduled.
 */
export interface NotificationScheduler {
  schedule(reminder: Reminder): Promise<{ scheduled: true; at: string } | { scheduled: false; reason: string }>;
  cancel(reminderId: string): Promise<void>;
}

export const unavailableScheduler: NotificationScheduler = {
  schedule: async () => ({ scheduled: false, reason: "Notifications aren't set up yet." }),
  cancel: async () => {},
};

/** Truthful notification status for display: based only on what the scheduler recorded. */
export const notificationStatus = (reminder: Reminder): "scheduled" | "not_scheduled" =>
  reminder.notificationScheduledAt ? "scheduled" : "not_scheduled";

export function validateNewReminder(raw: unknown) {
  return createReminderInput.safeParse(raw) as
    | { success: true; data: CreateReminderInput }
    | { success: false; error: import("zod").ZodError };
}


/**
 * Reminder CRUD. NOTE: this only stores reminders. No notification is scheduled
 * or sent (push notifications are a later phase), so nothing here may be
 * described to a parent as "you'll be notified".
 */
export async function createReminder(repos: Repositories, familyId: string, raw: unknown): Promise<ServiceResult<Reminder>> {
  const parsed = createReminderInput.safeParse(raw);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check that." };
  try {
    return { ok: true, data: await repos.reminders.create(familyId, parsed.data) };
  } catch (e) {
    return toFailure(e);
  }
}

export const listReminders = (repos: Repositories, familyId: string, includeCompleted = false) =>
  repos.reminders.list(familyId, { includeCompleted });

export async function updateReminder(repos: Repositories, familyId: string, id: string, raw: unknown): Promise<ServiceResult<Reminder>> {
  const parsed = updateReminderInput.safeParse(raw);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check that." };
  try {
    return { ok: true, data: await repos.reminders.update(familyId, id, parsed.data) };
  } catch (e) {
    return toFailure(e);
  }
}

export async function completeReminder(repos: Repositories, familyId: string, id: string, at?: Date): Promise<ServiceResult<Reminder>> {
  try {
    return { ok: true, data: await repos.reminders.complete(familyId, id, at) };
  } catch (e) {
    return toFailure(e);
  }
}

export async function deleteReminder(repos: Repositories, familyId: string, id: string): Promise<ServiceResult<null>> {
  try {
    await repos.reminders.delete(familyId, id);
    return { ok: true, data: null };
  } catch (e) {
    return toFailure(e);
  }
}
