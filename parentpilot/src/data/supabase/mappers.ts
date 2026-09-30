/**
 * Pure row <-> domain mapping. Database rows are snake_case; the domain is camelCase.
 * Kept free of any Supabase import so it is trivially testable.
 */
import type { Appointment, Caregiver, CaregiverRole, Child, Family, FeedingInfo, Memory, MemoryKind, Recurrence, Reminder, SleepInfo } from "@/domain/models";
import type { CreateMemoryInput, CreateReminderInput, UpdateReminderInput } from "@/domain/validation";

export interface FamilyRow { id: string; name: string; created_at: string }
export interface CaregiverRow {
  id: string; family_id: string; user_id: string | null; display_name: string; role: string;
  can_edit: boolean; can_manage_family: boolean;
}
export interface ChildRow {
  id: string; family_id: string; name: string; date_of_birth: string; important_notes: string[] | null;
  feeding: FeedingInfo | null; sleep: SleepInfo | null;
}
export interface AppointmentRow {
  id: string; family_id: string; child_id: string | null; title: string; starts_at: string;
  location: string | null; notes: string | null;
}
export interface MemoryRow {
  id: string; family_id: string; child_id: string | null; kind: string; content: string; tags: string[] | null;
  source: string; created_at: string;
}
export interface ReminderRow {
  id: string; family_id: string; child_id: string | null; title: string; description: string | null; due_at: string;
  recurrence: Recurrence | null; completed_at: string | null; notification_scheduled_at: string | null;
}

const opt = <T>(v: T | null | undefined): T | undefined => (v ?? undefined);

export const toFamily = (r: FamilyRow): Family => ({ id: r.id, name: r.name, createdAt: r.created_at });

export const toCaregiver = (r: CaregiverRow): Caregiver => ({
  id: r.id,
  familyId: r.family_id,
  userId: opt(r.user_id),
  displayName: r.display_name,
  role: r.role as CaregiverRole,
  permissions: { canEdit: r.can_edit, canManageFamily: r.can_manage_family },
});

export const toChild = (r: ChildRow): Child => ({
  id: r.id,
  familyId: r.family_id,
  name: r.name,
  dateOfBirth: r.date_of_birth, // a calendar date: YYYY-MM-DD
  importantNotes: r.important_notes ?? [],
  feeding: opt(r.feeding),
  sleep: opt(r.sleep),
});

export const toAppointment = (r: AppointmentRow): Appointment => ({
  id: r.id,
  familyId: r.family_id,
  childId: opt(r.child_id),
  title: r.title,
  startsAt: r.starts_at,
  location: opt(r.location),
  notes: opt(r.notes),
});

export const toMemory = (r: MemoryRow): Memory => ({
  id: r.id,
  familyId: r.family_id,
  childId: opt(r.child_id),
  kind: r.kind as MemoryKind,
  content: r.content,
  tags: r.tags ?? [],
  source: r.source === "assistant_confirmed" ? "assistant_confirmed" : "parent",
  createdAt: r.created_at,
});

export const toReminder = (r: ReminderRow): Reminder => ({
  id: r.id,
  familyId: r.family_id,
  childId: opt(r.child_id),
  title: r.title,
  description: opt(r.description),
  dueAt: r.due_at,
  recurrence: opt(r.recurrence),
  completedAt: opt(r.completed_at),
  notificationScheduledAt: opt(r.notification_scheduled_at),
});

export const memoryInsertRow = (familyId: string, input: CreateMemoryInput) => ({
  family_id: familyId,
  child_id: input.childId ?? null,
  kind: input.kind,
  content: input.content,
  tags: input.tags,
  source: "parent" as const,
});

export const reminderInsertRow = (familyId: string, input: CreateReminderInput) => ({
  family_id: familyId,
  child_id: input.childId ?? null,
  title: input.title,
  description: input.description ?? null,
  due_at: input.dueAt,
  recurrence: input.recurrence ?? null,
});

/** Only the fields present in the patch are sent, so an update never clobbers other columns. */
export function reminderPatchRow(patch: UpdateReminderInput): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.dueAt !== undefined) row.due_at = patch.dueAt;
  if (patch.childId !== undefined) row.child_id = patch.childId;
  if (patch.recurrence !== undefined) row.recurrence = patch.recurrence;
  return row;
}
