import { searchMemories } from "@/domain/memorySearch";
import type { Appointment, Caregiver, Child, Family, Memory, Reminder } from "@/domain/models";
import { DataError, type Repositories } from "../repositories";
import { buildMockData } from "./mockData";
import { localId } from "@/utils/id";

interface Options {
  now?: () => Date;
  /** Start with no family at all, to exercise onboarding without a backend. */
  empty?: boolean;
  /** Skip the artificial latency (tests). */
  instant?: boolean;
}

interface Store {
  families: Family[];
  caregivers: Caregiver[];
  children: Child[];
  appointments: Appointment[];
  reminders: Reminder[];
  memories: Memory[];
}

/**
 * In-memory implementation of the repository contracts, for DEMO mode and tests.
 * Writes live only for the lifetime of the app session: nothing is persisted.
 * Every method is scoped by familyId exactly like the Supabase implementation,
 * so family isolation is exercised here too.
 */
export function createMockRepositories(options: Options | (() => Date) = {}): Repositories {
  const opts: Options = typeof options === "function" ? { now: options } : options;
  const now = opts.now ?? (() => new Date());
  const delay = () => (opts.instant ? Promise.resolve() : new Promise<void>((r) => setTimeout(r, 150))); // exercise loading states

  const seed = buildMockData(now());
  const store: Store = opts.empty
    ? { families: [], caregivers: [], children: [], appointments: [], reminders: [], memories: [] }
    : {
        families: [seed.family],
        caregivers: seed.caregivers,
        children: seed.children,
        appointments: seed.appointments,
        reminders: seed.reminders,
        memories: seed.memories,
      };

  const findReminder = (familyId: string, id: string) => {
    const r = store.reminders.find((x) => x.id === id && x.familyId === familyId);
    if (!r) throw new DataError("not_found", "We couldn't find that reminder.");
    return r;
  };
  const assertChildInFamily = (familyId: string, childId?: string) => {
    if (childId && !store.children.some((c) => c.id === childId && c.familyId === familyId)) {
      throw new DataError("invalid", "That child isn't part of this family.");
    }
  };
  const contextFor = (familyId: string) => {
    const family = store.families.find((f) => f.id === familyId);
    const caregiver = store.caregivers.find((c) => c.familyId === familyId);
    if (!family || !caregiver) throw new DataError("not_found", "We couldn't find your family.");
    return { family, caregiver };
  };

  return {
    family: {
      async getContextForUser() {
        // Demo data ignores identity: the demo user owns whatever family exists.
        await delay();
        const caregiver = store.caregivers[0];
        return caregiver ? contextFor(caregiver.familyId) : null;
      },
      async listChildren(familyId) {
        await delay();
        return store.children
          .filter((c) => c.familyId === familyId)
          .sort((a, b) => a.dateOfBirth.localeCompare(b.dateOfBirth));
      },
      async onboard(input) {
        await delay();
        const existing = store.caregivers[0];
        if (existing) return contextFor(existing.familyId); // idempotent, like the database function
        const createdAt = now().toISOString();
        const family: Family = { id: localId("fam"), name: `${input.displayName}'s family`, createdAt };
        const caregiver: Caregiver = {
          id: localId("cg"),
          familyId: family.id,
          userId: "mock-user",
          displayName: input.displayName,
          role: "owner",
          permissions: { canEdit: true, canManageFamily: true },
        };
        store.families.push(family);
        store.caregivers.push(caregiver);
        store.children.push({
          id: localId("child"),
          familyId: family.id,
          name: input.childName,
          dateOfBirth: input.childDateOfBirth,
          importantNotes: [],
        });
        return { family, caregiver };
      },
      async addChild(familyId, input) {
        await delay();
        contextFor(familyId);
        const child: Child = { id: localId("child"), familyId, name: input.name, dateOfBirth: input.dateOfBirth, importantNotes: [] };
        store.children.push(child);
        return child;
      },
    },
    appointments: {
      async listUpcoming(familyId, from, limit = 10) {
        await delay();
        // Include anything from the start of the given day so "today" survives past its start time.
        const startOfDay = new Date(from);
        startOfDay.setHours(0, 0, 0, 0);
        return store.appointments
          .filter((a) => a.familyId === familyId && new Date(a.startsAt) >= startOfDay)
          .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
          .slice(0, limit);
      },
    },
    memories: {
      async list(familyId) {
        await delay();
        return store.memories.filter((m) => m.familyId === familyId);
      },
      async search(familyId, query, limit = 5) {
        await delay();
        return searchMemories(store.memories.filter((m) => m.familyId === familyId), query, limit);
      },
      async create(familyId, input) {
        await delay();
        assertChildInFamily(familyId, input.childId);
        const memory: Memory = {
          id: localId("mem"),
          familyId,
          childId: input.childId,
          kind: input.kind,
          content: input.content,
          tags: input.tags,
          source: "parent",
          createdAt: now().toISOString(),
        };
        store.memories.push(memory);
        return memory;
      },
    },
    reminders: {
      async list(familyId, options) {
        await delay();
        return store.reminders
          .filter((r) => r.familyId === familyId && (options?.includeCompleted || !r.completedAt))
          .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
      },
      async create(familyId, input) {
        await delay();
        assertChildInFamily(familyId, input.childId);
        const reminder: Reminder = { id: localId("rem"), familyId, ...input };
        store.reminders.push(reminder);
        return reminder;
      },
      async update(familyId, reminderId, patch) {
        await delay();
        const current = findReminder(familyId, reminderId);
        if (patch.childId) assertChildInFamily(familyId, patch.childId);
        const next: Reminder = {
          ...current,
          ...(patch.title !== undefined && { title: patch.title }),
          ...(patch.dueAt !== undefined && { dueAt: patch.dueAt }),
          description: patch.description === undefined ? current.description : (patch.description ?? undefined),
          childId: patch.childId === undefined ? current.childId : (patch.childId ?? undefined),
          recurrence: patch.recurrence === undefined ? current.recurrence : (patch.recurrence ?? undefined),
        };
        store.reminders[store.reminders.indexOf(current)] = next;
        return next;
      },
      async complete(familyId, reminderId, at = now()) {
        await delay();
        const current = findReminder(familyId, reminderId);
        const next = { ...current, completedAt: at.toISOString() };
        store.reminders[store.reminders.indexOf(current)] = next;
        return next;
      },
      async delete(familyId, reminderId) {
        await delay();
        store.reminders.splice(store.reminders.indexOf(findReminder(familyId, reminderId)), 1);
      },
    },
  };
}
