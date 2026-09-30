const DAY_MS = 86_400_000;

/** "11 weeks old", "5 months old", "1 year, 2 months old". Pure: pass `now` for tests. */
export function formatAge(dateOfBirth: string, now: Date = new Date()): string {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime()) || dob > now) return "";
  const days = Math.floor((now.getTime() - dob.getTime()) / DAY_MS);
  if (days < 14) return days === 1 ? "1 day old" : `${days} days old`;
  if (days < 84) return `${Math.floor(days / 7)} weeks old`;

  let months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
  if (now.getDate() < dob.getDate()) months -= 1;
  if (months < 24) {
    if (months < 12) return `${months} months old`;
    const rest = months - 12;
    return rest === 0 ? "1 year old" : `1 year, ${rest} month${rest === 1 ? "" : "s"} old`;
  }
  return `${Math.floor(months / 12)} years old`;
}

export function greetingFor(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
