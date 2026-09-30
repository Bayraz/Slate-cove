/**
 * DEMO DATA ONLY. Not production data, not persisted, never synced.
 * Dates are generated relative to "now" so the demo always reads well
 * (e.g. Emma is always 11 weeks old and the appointment is always today).
 */
import type { Appointment, Caregiver, Child, Family, Memory, Reminder } from "@/domain/models";

export const MOCK_USER_ID = "mock-user-sarah";
export const MOCK_FAMILY_ID = "mock-family-1";

const DAY = 86_400_000;

const atToday = (now: Date, hours: number, minutes = 0) => {
  const d = new Date(now);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export function buildMockData(now: Date = new Date()) {
  const family: Family = {
    id: MOCK_FAMILY_ID,
    name: "The Miller family",
    createdAt: new Date(now.getTime() - 80 * DAY).toISOString(),
  };

  const caregivers: Caregiver[] = [
    {
      id: "mock-caregiver-sarah",
      familyId: family.id,
      userId: MOCK_USER_ID,
      displayName: "Sarah",
      role: "owner",
      permissions: { canEdit: true, canManageFamily: true },
    },
  ];

  const children: Child[] = [
    {
      id: "mock-child-emma",
      familyId: family.id,
      name: "Emma",
      dateOfBirth: new Date(now.getTime() - 11 * 7 * DAY).toISOString(),
      importantNotes: ["Prefers the green bottle"],
      feeding: { method: "mixed", notes: "Roughly every 3 hours during the day" },
      sleep: { notes: "Longest stretch is about 4 hours at night" },
    },
  ];

  const appointments: Appointment[] = [
    {
      id: "mock-appt-1",
      familyId: family.id,
      childId: "mock-child-emma",
      title: "Health visitor appointment",
      startsAt: atToday(now, 10, 30),
      location: "Riverside Family Clinic",
      notes: "Jane is the health visitor",
    },
  ];

  const reminders: Reminder[] = [
    {
      id: "mock-rem-1",
      familyId: family.id,
      title: "Pack changing bag",
      dueAt: atToday(now, 20, 0),
    },
    {
      id: "mock-rem-2",
      familyId: family.id,
      childId: "mock-child-emma",
      title: "Vitamin D drops",
      dueAt: atToday(now, 9, 0),
      recurrence: { frequency: "daily", interval: 1 },
    },
    {
      id: "mock-rem-3",
      familyId: family.id,
      title: "Book 12-week check",
      dueAt: new Date(now.getTime() + 3 * DAY).toISOString(),
    },
  ];

  const memories: Memory[] = [
    {
      id: "mock-mem-1",
      familyId: family.id,
      childId: "mock-child-emma",
      kind: "child_note",
      content: "Emma doesn't like the blue bottle.",
      tags: ["bottle", "feeding"],
      source: "parent",
      createdAt: new Date(now.getTime() - 20 * DAY).toISOString(),
    },
    {
      id: "mock-mem-2",
      familyId: family.id,
      kind: "contact",
      content: "My health visitor is Jane.",
      tags: ["health visitor", "jane"],
      source: "parent",
      createdAt: new Date(now.getTime() - 14 * DAY).toISOString(),
    },
    {
      id: "mock-mem-3",
      familyId: family.id,
      kind: "preference",
      content: "I prefer appointments in the morning.",
      tags: ["appointments", "morning"],
      source: "parent",
      createdAt: new Date(now.getTime() - 9 * DAY).toISOString(),
    },
    {
      id: "mock-mem-4",
      familyId: family.id,
      childId: "mock-child-emma",
      kind: "question",
      content: "Ask about feeding: is every 3 hours still right at this age?",
      tags: ["feeding", "ask health visitor"],
      source: "parent",
      createdAt: new Date(now.getTime() - 2 * DAY).toISOString(),
    },
  ];

  return { family, caregivers, children, appointments, reminders, memories };
}
