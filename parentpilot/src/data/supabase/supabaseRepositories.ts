import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { searchMemories } from "@/domain/memorySearch";
import { createLogger } from "@/utils/logger";
import { DataError, type FamilyContext, type Repositories } from "../repositories";
import {
  memoryInsertRow, reminderInsertRow, reminderPatchRow,
  toAppointment, toCaregiver, toChild, toFamily, toMemory, toReminder,
  type AppointmentRow, type CaregiverRow, type ChildRow, type FamilyRow, type MemoryRow, type ReminderRow,
} from "./mappers";

const log = createLogger("data");

/** Translates a PostgREST/network error into a DataError with a calm message. Never leaks SQL text. */
export function toDataError(error: Pick<PostgrestError, "code" | "message"> | { message?: string; code?: string }): DataError {
  const code = error.code ?? "";
  log.warn("query failed", { code });
  if (code === "42501" || code === "PGRST301" || code === "28000") {
    return new DataError("forbidden", "You don't have access to that. Try signing in again.");
  }
  if (code === "PGRST116") return new DataError("not_found", "We couldn't find that.");
  if (code === "23503" || code === "23514" || code === "22023" || code === "22007") {
    return new DataError("invalid", "Something in that didn't look right. Please check it and try again.");
  }
  if (!code && /fetch|network|timeout|offline/i.test(error.message ?? "")) {
    return new DataError("network", "We couldn't reach ParentPilot. Check your connection and try again.");
  }
  return new DataError("unknown", "Something went wrong. Please try again.");
}

/** Every query either yields data or throws a DataError. Thrown fetch failures are mapped too. */
async function run<T>(query: PromiseLike<{ data: T | null; error: PostgrestError | null }>): Promise<T | null> {
  try {
    const { data, error } = await query;
    if (error) throw toDataError(error);
    return data;
  } catch (e) {
    if (e instanceof DataError) throw e;
    throw toDataError({ message: e instanceof Error ? e.message : String(e) });
  }
}

/** For inserts that must return their row. */
async function runOne<T>(query: PromiseLike<{ data: unknown; error: PostgrestError | null }>): Promise<T> {
  const data = await run<unknown>(query);
  if (!data) throw new DataError("unknown", "Something went wrong. Please try again.");
  return data as T;
}

const MAX_MEMORIES = 500;

/**
 * Supabase-backed repositories. All queries run as the signed-in user with the
 * public anon key, so Postgres row-level security is the real access control.
 * Each query also filters by family_id explicitly (defence in depth, and so
 * queries stay correct if a user ever belongs to more than one family).
 */
export function createSupabaseRepositories(client: SupabaseClient): Repositories {
  const currentUserId = async (): Promise<string> => {
    const { data } = await client.auth.getSession();
    const id = data.session?.user.id;
    if (!id) throw new DataError("forbidden", "You're signed out. Please sign in again.");
    return id;
  };

  const contextFor = async (userId: string, familyId?: string): Promise<FamilyContext | null> => {
    let q = client
      .from("caregivers")
      .select("id, family_id, user_id, display_name, role, can_edit, can_manage_family, families!inner(id, name, created_at)")
      .eq("user_id", userId);
    if (familyId) q = q.eq("family_id", familyId);
    const row = await run(q.order("created_at", { ascending: true }).limit(1).maybeSingle());
    if (!row) return null;
    const { families, ...caregiver } = row as unknown as CaregiverRow & { families: FamilyRow | FamilyRow[] };
    const family = Array.isArray(families) ? families[0] : families;
    if (!family) return null;
    return { family: toFamily(family), caregiver: toCaregiver(caregiver) };
  };

  const listChildren = async (familyId: string) =>
    ((await run(client.from("children").select("*").eq("family_id", familyId).order("date_of_birth").order("created_at"))) as ChildRow[] | null ?? []).map(toChild);

  return {
    family: {
      getContextForUser: (userId) => contextFor(userId),
      listChildren,
      async onboard(input) {
        const familyId = await run(
          client.rpc("onboard_family", {
            my_display_name: input.displayName,
            child_name: input.childName,
            child_date_of_birth: input.childDateOfBirth,
          }),
        );
        if (typeof familyId !== "string") throw new DataError("unknown", "Something went wrong. Please try again.");
        const context = await contextFor(await currentUserId(), familyId);
        if (!context) throw new DataError("unknown", "Your family was created but we couldn't load it. Please try again.");
        return context;
      },
      async addChild(familyId, input) {
        return toChild(
          await runOne<ChildRow>(
            client.from("children").insert({ family_id: familyId, name: input.name, date_of_birth: input.dateOfBirth }).select("*").single(),
          ),
        );
      },
    },
    appointments: {
      async listUpcoming(familyId, from, limit = 10) {
        const startOfDay = new Date(from);
        startOfDay.setHours(0, 0, 0, 0);
        const rows = await run(
          client.from("appointments").select("*").eq("family_id", familyId)
            .gte("starts_at", startOfDay.toISOString()).order("starts_at").limit(limit),
        );
        return ((rows as AppointmentRow[] | null) ?? []).map(toAppointment);
      },
    },
    memories: {
      async list(familyId) {
        const rows = await run(
          client.from("memories").select("*").eq("family_id", familyId).order("created_at", { ascending: false }).limit(MAX_MEMORIES),
        );
        return ((rows as MemoryRow[] | null) ?? []).map(toMemory);
      },
      async search(familyId, query, limit = 5) {
        // Same ranking as demo mode. TODO(stage: memory): move to Postgres full-text search once families have many memories.
        const rows = await run(
          client.from("memories").select("*").eq("family_id", familyId).order("created_at", { ascending: false }).limit(MAX_MEMORIES),
        );
        return searchMemories(((rows as MemoryRow[] | null) ?? []).map(toMemory), query, limit);
      },
      async create(familyId, input) {
        return toMemory(await runOne<MemoryRow>(client.from("memories").insert(memoryInsertRow(familyId, input)).select("*").single()));
      },
    },
    reminders: {
      async list(familyId, options) {
        let q = client.from("reminders").select("*").eq("family_id", familyId);
        if (!options?.includeCompleted) q = q.is("completed_at", null);
        const rows = await run(q.order("due_at"));
        return ((rows as ReminderRow[] | null) ?? []).map(toReminder);
      },
      async create(familyId, input) {
        return toReminder(await runOne<ReminderRow>(client.from("reminders").insert(reminderInsertRow(familyId, input)).select("*").single()));
      },
      async update(familyId, reminderId, patch) {
        const row = await run(
          client.from("reminders").update(reminderPatchRow(patch)).eq("id", reminderId).eq("family_id", familyId).select("*").maybeSingle(),
        );
        if (!row) throw new DataError("not_found", "We couldn't find that reminder.");
        return toReminder(row as ReminderRow);
      },
      async complete(familyId, reminderId, at = new Date()) {
        const row = await run(
          client.from("reminders").update({ completed_at: at.toISOString() }).eq("id", reminderId).eq("family_id", familyId).select("*").maybeSingle(),
        );
        if (!row) throw new DataError("not_found", "We couldn't find that reminder.");
        return toReminder(row as ReminderRow);
      },
      async delete(familyId, reminderId) {
        const rows = await run(client.from("reminders").delete().eq("id", reminderId).eq("family_id", familyId).select("id"));
        if (!rows || (rows as unknown[]).length === 0) throw new DataError("not_found", "We couldn't find that reminder.");
      },
    },
  };
}
