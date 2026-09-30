export type DobResult = { ok: true; iso: string } | { ok: false; message: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Turns day / month / year text fields into YYYY-MM-DD. Friendly messages, no
 * date-picker dependency. Rejects impossible dates (31 Feb), the future, and
 * children older than 18 (this app is for young families).
 */
export function parseDateOfBirth(day: string, month: string, year: string, now: Date = new Date()): DobResult {
  const d = Number(day.trim());
  const m = Number(month.trim());
  const y = Number(year.trim());
  if (!day.trim() || !month.trim() || !year.trim() || ![d, m, y].every(Number.isInteger)) {
    return { ok: false, message: "Please enter the day, month and year." };
  }
  if (year.trim().length !== 4) return { ok: false, message: "Please use a 4-digit year, like 2026." };
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    return { ok: false, message: "That date doesn't look right. Please check it." };
  }
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  if (date.getTime() > today) return { ok: false, message: "That date is in the future." };
  if (y < now.getFullYear() - 18) return { ok: false, message: "That date looks too long ago. Please check the year." };
  return { ok: true, iso: `${y}-${pad(m)}-${pad(d)}` };
}
