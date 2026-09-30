import { createMockRepositories } from "@/data/mock/mockRepositories";
import { buildTodaySummary, loadToday } from "@/services/todayService";
import { completeOnboarding, addChild } from "@/services/familyService";
import { createReminder } from "@/services/reminderService";
import { saveMemory } from "@/services/memoryService";

const now = new Date("2026-09-30T09:30:00");
const empty = { children: [], appointments: [], reminders: [], memories: [] };

describe("Today: empty states", () => {
  it("a brand-new family has nothing to show, and nothing invented", () => {
    const s = buildTodaySummary(empty, now);
    expect(s).toMatchObject({ children: [], appointments: [], reminders: [], savedNote: undefined });
  });

  it("right after onboarding: the real child, no fake appointments/reminders/notes", async () => {
    const repos = createMockRepositories({ now: () => now, empty: true, instant: true });
    const res = await completeOnboarding(repos, { displayName: "Sarah", childName: "Emma", childDateOfBirth: "2026-07-15" });
    if (!res.ok) throw new Error("onboarding failed");
    const kids = await repos.family.listChildren(res.data.family.id);
    const s = await loadToday(repos, res.data.family.id, kids, now);
    expect(s.children).toEqual([{ id: kids[0]!.id, name: "Emma", ageLabel: "11 weeks old" }]);
    expect(s.appointments).toEqual([]);
    expect(s.reminders).toEqual([]);
    expect(s.savedNote).toBeUndefined();
  });

  it("shows only what the parent actually saved", async () => {
    const repos = createMockRepositories({ now: () => now, empty: true, instant: true });
    const res = await completeOnboarding(repos, { displayName: "Sarah", childName: "Emma", childDateOfBirth: "2026-07-15" });
    if (!res.ok) throw new Error("onboarding failed");
    const fid = res.data.family.id;
    await createReminder(repos, fid, { title: "Pack changing bag", dueAt: new Date("2026-09-30T20:00:00").toISOString() });
    await createReminder(repos, fid, { title: "Next week", dueAt: new Date("2026-10-08T20:00:00").toISOString() });
    await saveMemory(repos, fid, { kind: "question", content: "Ask about feeding" });
    const s = await loadToday(repos, fid, await repos.family.listChildren(fid), now);
    expect(s.reminders.map((r) => r.title)).toEqual(["Pack changing bag"]);
    expect(s.savedNote?.content).toBe("Ask about feeding");
  });
});

describe("Today: multiple children", () => {
  it("names the child on each item when there is more than one, and not when there is one", async () => {
    const repos = createMockRepositories({ now: () => now, empty: true, instant: true });
    const res = await completeOnboarding(repos, { displayName: "Sarah", childName: "Emma", childDateOfBirth: "2026-07-15" });
    if (!res.ok) throw new Error("onboarding failed");
    const fid = res.data.family.id;
    const [emma] = await repos.family.listChildren(fid);
    const due = new Date("2026-09-30T10:00:00").toISOString();
    await createReminder(repos, fid, { title: "Vitamin D", dueAt: due, childId: emma!.id });

    let kids = await repos.family.listChildren(fid);
    expect((await loadToday(repos, fid, kids, now)).reminders[0]).not.toHaveProperty("childName");

    const twin = await addChild(repos, fid, { name: "Ella", dateOfBirth: "2026-07-15" });
    if (!twin.ok) throw new Error("addChild failed");
    await createReminder(repos, fid, { title: "Weigh-in", dueAt: due, childId: twin.data.id });
    kids = await repos.family.listChildren(fid);
    const s = await loadToday(repos, fid, kids, now);
    expect(s.children.map((c) => c.name).sort()).toEqual(["Ella", "Emma"]);
    expect(Object.fromEntries(s.reminders.map((r) => [r.title, r.childName]))).toEqual({ "Vitamin D": "Emma", "Weigh-in": "Ella" });
  });
});
