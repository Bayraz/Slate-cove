import type { Reminder } from "@/domain/models";
import { createReminderInput, type CreateReminderInput } from "@/domain/validation";

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
