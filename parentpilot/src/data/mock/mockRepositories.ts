import { searchMemories } from "@/domain/memorySearch";
import type { Repositories } from "../repositories";
import { buildMockData } from "./mockData";

/** In-memory, read-only demo implementation of the repository contracts. */
export function createMockRepositories(now: () => Date = () => new Date()): Repositories {
  const data = () => buildMockData(now());
  const delay = () => new Promise<void>((r) => setTimeout(r, 150)); // exercise loading states

  return {
    family: {
      async getContextForUser() {
        // Demo data ignores identity: every user gets the demo family.
        await delay();
        const d = data();
        const caregiver = d.caregivers[0];
        return caregiver ? { family: d.family, caregiver } : null;
      },
      async listChildren(familyId) {
        await delay();
        return data().children.filter((c) => c.familyId === familyId);
      },
    },
    appointments: {
      async listUpcoming(familyId, from, limit = 10) {
        await delay();
        // Include anything from the start of the given day so "today" survives past its start time.
        const startOfDay = new Date(from);
        startOfDay.setHours(0, 0, 0, 0);
        return data()
          .appointments.filter((a) => a.familyId === familyId && new Date(a.startsAt) >= startOfDay)
          .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
          .slice(0, limit);
      },
    },
    memories: {
      async list(familyId) {
        await delay();
        return data().memories.filter((m) => m.familyId === familyId);
      },
      async search(familyId, query, limit = 5) {
        await delay();
        return searchMemories(
          data().memories.filter((m) => m.familyId === familyId),
          query,
          limit,
        );
      },
    },
    reminders: {
      async list(familyId, options) {
        await delay();
        return data()
          .reminders.filter((r) => r.familyId === familyId && (options?.includeCompleted || !r.completedAt))
          .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
      },
    },
  };
}
