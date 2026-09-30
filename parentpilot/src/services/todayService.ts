import type { Repositories } from "@/data";
import type { Appointment, Child, Memory, Reminder } from "@/domain/models";
import { formatAge, isSameLocalDay } from "@/utils/dates";

export interface TodaySummary {
  children: { id: string; name: string; ageLabel: string }[];
  appointments: Appointment[];
  reminders: Reminder[];
  /** One saved note worth surfacing today (a saved question wins over other notes). */
  savedNote?: Memory;
}

const MAX_REMINDERS = 3;

/** Pure: decides what actually matters today. Kept separate from fetching so it is easy to test. */
export function buildTodaySummary(
  input: { children: Child[]; appointments: Appointment[]; reminders: Reminder[]; memories: Memory[] },
  now: Date,
): TodaySummary {
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const reminders = input.reminders
    .filter((r) => !r.completedAt && new Date(r.dueAt) <= endOfToday)
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    .slice(0, MAX_REMINDERS);

  const newestFirst = [...input.memories].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const savedNote = newestFirst.find((m) => m.kind === "question") ?? newestFirst.find((m) => m.kind === "medical_guidance");

  return {
    children: input.children.map((c) => ({ id: c.id, name: c.name, ageLabel: formatAge(c.dateOfBirth, now) })),
    appointments: input.appointments.filter((a) => isSameLocalDay(new Date(a.startsAt), now)),
    reminders,
    savedNote,
  };
}

export async function loadToday(repos: Repositories, familyId: string, children: Child[], now = new Date()) {
  const [appointments, reminders, memories] = await Promise.all([
    repos.appointments.listUpcoming(familyId, now),
    repos.reminders.list(familyId),
    repos.memories.list(familyId),
  ]);
  return buildTodaySummary({ children, appointments, reminders, memories }, now);
}

/** "Emma is 11 weeks old." / "Emma and Noah are 11 weeks old." / one line each when ages differ. */
export function childrenSentence(children: TodaySummary["children"]): string {
  if (children.length === 0) return "";
  const ages = new Set(children.map((c) => c.ageLabel));
  if (children.length > 1 && ages.size === 1) {
    const names = children.map((c) => c.name);
    const joined = names.length === 2 ? names.join(" and ") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
    return `${joined} are ${children[0]?.ageLabel}.`;
  }
  return children.map((c) => `${c.name} is ${c.ageLabel}.`).join(" ");
}
