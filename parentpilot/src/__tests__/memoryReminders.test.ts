import { createMockRepositories } from "@/data/mock/mockRepositories";
import { MOCK_FAMILY_ID } from "@/data/mock/mockData";
import { listMemories, saveMemory, searchFamilyMemories } from "@/services/memoryService";
import { completeReminder, createReminder, deleteReminder, listReminders, notificationStatus, updateReminder } from "@/services/reminderService";

const now = new Date("2026-09-30T09:00:00");
const repos = () => createMockRepositories({ now: () => now, instant: true });

describe("memory persistence", () => {
  it("saves structured memories and retrieves them and searches them", async () => {
    const r = repos();
    const saved = await saveMemory(r, MOCK_FAMILY_ID, { kind: "medical_guidance", content: "Doctor asked us to monitor feeding.", tags: ["feeding"], childId: "mock-child-emma" });
    expect(saved).toMatchObject({ ok: true, data: { kind: "medical_guidance", source: "parent", familyId: MOCK_FAMILY_ID } });
    expect((await listMemories(r, MOCK_FAMILY_ID)).map((m) => m.content)).toContain("Doctor asked us to monitor feeding.");
    expect((await searchFamilyMemories(r, MOCK_FAMILY_ID, "monitor feeding"))[0]?.content).toMatch(/monitor feeding/);
  });
  it("validates input and rejects another family's child", async () => {
    const r = repos();
    expect(await saveMemory(r, MOCK_FAMILY_ID, { kind: "general", content: "   " })).toMatchObject({ ok: false });
    expect(await saveMemory(r, MOCK_FAMILY_ID, { kind: "nonsense", content: "x" })).toMatchObject({ ok: false });
    expect(await saveMemory(r, MOCK_FAMILY_ID, { kind: "general", content: "x", childId: "a-stranger's-child" })).toMatchObject({ ok: false });
  });
  it("keeps one family's memories out of another's", async () => {
    const r = repos();
    await saveMemory(r, MOCK_FAMILY_ID, { kind: "general", content: "private note" });
    expect(await listMemories(r, "other-family")).toEqual([]);
  });
});

describe("reminders: create, list, update, complete, delete", () => {
  it("runs the full lifecycle", async () => {
    const r = repos();
    const made = await createReminder(r, MOCK_FAMILY_ID, { title: "Call the GP", dueAt: "2026-10-01T09:00:00.000Z" });
    expect(made.ok).toBe(true);
    const id = made.ok ? made.data.id : "";
    expect((await listReminders(r, MOCK_FAMILY_ID)).some((x) => x.id === id)).toBe(true);

    const updated = await updateReminder(r, MOCK_FAMILY_ID, id, { title: "Call the GP surgery", recurrence: { frequency: "weekly", interval: 1 } });
    expect(updated).toMatchObject({ ok: true, data: { title: "Call the GP surgery", recurrence: { frequency: "weekly" }, dueAt: "2026-10-01T09:00:00.000Z" } });

    const done = await completeReminder(r, MOCK_FAMILY_ID, id, now);
    expect(done).toMatchObject({ ok: true, data: { completedAt: now.toISOString() } });
    expect((await listReminders(r, MOCK_FAMILY_ID)).some((x) => x.id === id)).toBe(false); // open only
    expect((await listReminders(r, MOCK_FAMILY_ID, true)).some((x) => x.id === id)).toBe(true);

    expect(await deleteReminder(r, MOCK_FAMILY_ID, id)).toMatchObject({ ok: true });
    expect((await listReminders(r, MOCK_FAMILY_ID, true)).some((x) => x.id === id)).toBe(false);
    expect(await deleteReminder(r, MOCK_FAMILY_ID, id)).toMatchObject({ ok: false });
  });
  it("validates input", async () => {
    const r = repos();
    expect(await createReminder(r, MOCK_FAMILY_ID, { title: "", dueAt: "2026-10-01T09:00:00.000Z" })).toMatchObject({ ok: false });
    expect(await createReminder(r, MOCK_FAMILY_ID, { title: "x", dueAt: "not a date" })).toMatchObject({ ok: false });
    expect(await updateReminder(r, MOCK_FAMILY_ID, "x", {})).toMatchObject({ ok: false });
  });
  it("cannot touch another family's reminder", async () => {
    const r = repos();
    const [mine] = await listReminders(r, MOCK_FAMILY_ID);
    expect(await updateReminder(r, "other-family", mine!.id, { title: "Hacked" })).toMatchObject({ ok: false });
    expect(await completeReminder(r, "other-family", mine!.id)).toMatchObject({ ok: false });
    expect(await deleteReminder(r, "other-family", mine!.id)).toMatchObject({ ok: false });
    expect((await listReminders(r, MOCK_FAMILY_ID)).find((x) => x.id === mine!.id)?.title).not.toBe("Hacked");
  });
  it("never claims a notification was scheduled: nothing schedules one yet", async () => {
    const r = repos();
    const made = await createReminder(r, MOCK_FAMILY_ID, { title: "x", dueAt: "2026-10-01T09:00:00.000Z" });
    expect(made.ok && notificationStatus(made.data)).toBe("not_scheduled");
  });
});
