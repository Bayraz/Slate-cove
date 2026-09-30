import { DataError } from "@/data/repositories";
import { createMockRepositories } from "@/data/mock/mockRepositories";
import { addChild, completeOnboarding } from "@/services/familyService";
import { parseDateOfBirth } from "@/utils/dateOfBirth";

const now = new Date("2026-09-30T09:00:00");
const fresh = () => createMockRepositories({ now: () => now, empty: true, instant: true });
const input = { displayName: "Sarah", childName: "Emma", childDateOfBirth: "2026-07-15" };

describe("onboarding: family + caregiver + child", () => {
  it("a new user has no family yet", async () => {
    expect(await fresh().family.getContextForUser("u1")).toBeNull();
  });

  it("creates the family, the owner caregiver and the child together, and they can be retrieved", async () => {
    const repos = fresh();
    const res = await completeOnboarding(repos, input);
    expect(res.ok).toBe(true);
    const ctx = await repos.family.getContextForUser("u1");
    expect(ctx?.family.name).toBe("Sarah's family");
    expect(ctx?.caregiver).toMatchObject({ displayName: "Sarah", role: "owner", permissions: { canEdit: true, canManageFamily: true } });
    const kids = await repos.family.listChildren(ctx!.family.id);
    expect(kids).toHaveLength(1);
    expect(kids[0]).toMatchObject({ name: "Emma", dateOfBirth: "2026-07-15", familyId: ctx!.family.id });
  });

  it("is idempotent: onboarding twice (double tap, retry) never makes a second family or child", async () => {
    const repos = fresh();
    const a = await completeOnboarding(repos, input);
    const b = await completeOnboarding(repos, { ...input, childName: "Someone else" });
    expect(a.ok && b.ok && a.data.family.id === b.data.family.id).toBe(true);
    expect(await repos.family.listChildren(a.ok ? a.data.family.id : "")).toHaveLength(1);
  });

  it("validates input with friendly messages and creates nothing when invalid", async () => {
    const repos = fresh();
    expect(await completeOnboarding(repos, { ...input, displayName: "   " })).toMatchObject({ ok: false, message: expect.stringMatching(/your name/i) });
    expect(await completeOnboarding(repos, { ...input, childName: "" })).toMatchObject({ ok: false });
    expect(await completeOnboarding(repos, { ...input, childDateOfBirth: "yesterday" })).toMatchObject({ ok: false });
    expect(await repos.family.getContextForUser("u1")).toBeNull();
  });

  it("turns repository failures into a calm message", async () => {
    const repos = fresh();
    repos.family.onboard = async () => {
      throw new DataError("network", "We couldn't reach ParentPilot. Check your connection and try again.");
    };
    expect(await completeOnboarding(repos, input)).toEqual({ ok: false, message: "We couldn't reach ParentPilot. Check your connection and try again." });
    repos.family.onboard = async () => {
      throw new Error("select * from secret_table failed");
    };
    const res = await completeOnboarding(repos, input);
    expect(res.ok === false && res.message).not.toMatch(/secret_table/);
  });
});

describe("multiple children", () => {
  it("supports twins and more, in a stable order", async () => {
    const repos = fresh();
    const res = await completeOnboarding(repos, input);
    const familyId = res.ok ? res.data.family.id : "";
    await addChild(repos, familyId, { name: "Ella", dateOfBirth: "2026-07-15" });
    await addChild(repos, familyId, { name: "Leo", dateOfBirth: "2023-03-01" });
    const kids = await repos.family.listChildren(familyId);
    expect(kids.map((k) => k.name)).toEqual(["Leo", "Emma", "Ella"]);
    expect(new Set(kids.map((k) => k.id)).size).toBe(3);
    expect(kids.every((k) => k.familyId === familyId)).toBe(true);
  });

  it("validates a new child", async () => {
    const repos = fresh();
    const res = await completeOnboarding(repos, input);
    expect(await addChild(repos, res.ok ? res.data.family.id : "", { name: "", dateOfBirth: "2026-01-01" })).toMatchObject({ ok: false });
  });
});

describe("family isolation at the repository contract", () => {
  it("another family id returns nothing and cannot be written to", async () => {
    const repos = createMockRepositories({ now: () => now, instant: true }); // demo family exists
    expect(await repos.family.listChildren("someone-elses-family")).toEqual([]);
    expect(await repos.memories.list("someone-elses-family")).toEqual([]);
    expect(await repos.reminders.list("someone-elses-family")).toEqual([]);
    expect(await repos.appointments.listUpcoming("someone-elses-family", now)).toEqual([]);
    await expect(repos.family.addChild("someone-elses-family", { name: "X", dateOfBirth: "2026-01-01" })).rejects.toMatchObject({ code: "not_found" });
    const [mine] = await repos.reminders.list("mock-family-1");
    await expect(repos.reminders.complete("someone-elses-family", mine!.id)).rejects.toMatchObject({ code: "not_found" });
    await expect(repos.reminders.delete("someone-elses-family", mine!.id)).rejects.toMatchObject({ code: "not_found" });
  });
});

describe("parseDateOfBirth", () => {
  const now2 = new Date("2026-09-30T12:00:00");
  it("accepts real dates", () => expect(parseDateOfBirth("15", "7", "2026", now2)).toEqual({ ok: true, iso: "2026-07-15" }));
  it("accepts today", () => expect(parseDateOfBirth("30", "9", "2026", now2)).toEqual({ ok: true, iso: "2026-09-30" }));
  it.each([
    ["", "7", "2026"], ["15", "", "2026"], ["15", "7", ""],
    ["31", "2", "2026"], ["0", "7", "2026"], ["15", "13", "2026"],
    ["1", "10", "2026"], ["15", "7", "26"], ["aa", "7", "2026"], ["1", "1", "2000"],
  ])("rejects %s/%s/%s", (d, m, y) => expect(parseDateOfBirth(d, m, y, now2).ok).toBe(false));
});
