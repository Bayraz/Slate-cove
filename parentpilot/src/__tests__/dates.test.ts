import { formatAge, greetingFor } from "@/utils/dates";

const now = new Date("2026-09-30T09:00:00");
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();

describe("formatAge", () => {
  it("uses days, weeks, months and years", () => {
    expect(formatAge(daysAgo(1), now)).toBe("1 day old");
    expect(formatAge(daysAgo(5), now)).toBe("5 days old");
    expect(formatAge(daysAgo(77), now)).toBe("11 weeks old");
    expect(formatAge("2026-04-15T00:00:00", now)).toBe("5 months old");
    expect(formatAge("2025-07-30T00:00:00", now)).toBe("1 year, 2 months old");
    expect(formatAge("2023-01-01T00:00:00", now)).toBe("3 years old");
  });
  it("returns empty for invalid or future dates", () => {
    expect(formatAge("nope", now)).toBe("");
    expect(formatAge("2027-01-01", now)).toBe("");
  });
});

describe("greetingFor", () => {
  it("varies by time of day", () => {
    expect(greetingFor(new Date("2026-01-01T08:00:00"))).toBe("Good morning");
    expect(greetingFor(new Date("2026-01-01T14:00:00"))).toBe("Good afternoon");
    expect(greetingFor(new Date("2026-01-01T20:00:00"))).toBe("Good evening");
  });
});
