import { MOCK_FAMILY_ID, buildMockData } from "@/data/mock/mockData";
import { searchMemories } from "@/domain/memorySearch";
import { buildTodaySummary, childrenSentence } from "@/services/todayService";

const now = new Date("2026-09-30T09:30:00");

describe("buildTodaySummary", () => {
  const d = buildMockData(now);
  const summary = buildTodaySummary(d, now);

  it("shows only what matters today", () => {
    expect(summary.children).toEqual([{ id: "mock-child-emma", name: "Emma", ageLabel: "11 weeks old" }]);
    expect(summary.appointments.map((a) => a.title)).toEqual(["Health visitor appointment"]);
    // due today or overdue; not the reminder due in 3 days
    expect(summary.reminders.map((r) => r.title)).toEqual(["Vitamin D drops", "Pack changing bag"]);
    expect(summary.savedNote?.kind).toBe("question");
  });

  it("omits completed reminders", () => {
    const done = d.reminders.map((r) => ({ ...r, completedAt: now.toISOString() }));
    expect(buildTodaySummary({ ...d, reminders: done }, now).reminders).toEqual([]);
  });
});

describe("childrenSentence", () => {
  it("handles one child, twins and different ages", () => {
    const c = (name: string, ageLabel: string) => ({ id: name, name, ageLabel });
    expect(childrenSentence([c("Emma", "11 weeks old")])).toBe("Emma is 11 weeks old.");
    expect(childrenSentence([c("Emma", "11 weeks old"), c("Noah", "11 weeks old")])).toBe("Emma and Noah are 11 weeks old.");
    expect(childrenSentence([c("Emma", "11 weeks old"), c("Leo", "3 years old")])).toBe("Emma is 11 weeks old. Leo is 3 years old.");
    expect(childrenSentence([])).toBe("");
  });
});

describe("searchMemories", () => {
  const { memories } = buildMockData(now);
  it("finds structured memories by content and tags", () => {
    expect(searchMemories(memories, "who is my health visitor")[0]?.content).toContain("Jane");
    expect(searchMemories(memories, "blue bottle")[0]?.content).toContain("blue bottle");
    expect(searchMemories(memories, "xyzzy")).toEqual([]);
  });
  it("uses a family id", () => expect(memories.every((m) => m.familyId === MOCK_FAMILY_ID)).toBe(true));
});
