/** Client-side id for local/optimistic objects. The database assigns real ids. */
export const localId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
