import type { SupabaseClient } from "@supabase/supabase-js";
import { DataError } from "@/data/repositories";
import { toChild, toReminder, reminderPatchRow } from "@/data/supabase/mappers";
import { createSupabaseRepositories, toDataError } from "@/data/supabase/supabaseRepositories";

type Call = { table: string; ops: [string, unknown[]][] };
type Reply = { data: unknown; error: { code?: string; message: string } | null };

/** Records every query so tests can assert exactly what would be sent to PostgREST. */
function fakeClient(replies: Record<string, Reply | (() => Reply | Promise<Reply>)>, userId: string | null = "u1") {
  const calls: Call[] = [];
  const builder = (table: string) => {
    const call: Call = { table, ops: [] };
    calls.push(call);
    const proxy: unknown = new Proxy(
      {},
      {
        get(_t, prop: string) {
          if (prop === "then") {
            return (resolve: (v: Reply) => void, reject: (e: unknown) => void) => {
              const r = replies[table] ?? { data: null, error: null };
              Promise.resolve(typeof r === "function" ? r() : r).then(resolve, reject);
            };
          }
          return (...args: unknown[]) => {
            call.ops.push([prop, args]);
            return proxy;
          };
        },
      },
    );
    return proxy;
  };
  const client = {
    from: (table: string) => builder(table),
    rpc: (fn: string, args: unknown) => {
      const p = builder(`rpc:${fn}`) as { rpc: (...a: unknown[]) => unknown };
      (calls[calls.length - 1] as Call).ops.push(["args", [args]]);
      return p;
    },
    auth: { getSession: async () => ({ data: { session: userId ? { user: { id: userId } } : null } }) },
  } as unknown as SupabaseClient;
  return { client, calls };
}

const eqArgs = (call: Call) => call.ops.filter(([n]) => n === "eq").map(([, a]) => a);
const FAM = "fam-1";

describe("row mapping", () => {
  it("maps children (date of birth is a calendar date) and handles nulls", () => {
    expect(toChild({ id: "c", family_id: FAM, name: "Emma", date_of_birth: "2026-07-15", important_notes: null, feeding: null, sleep: null })).toEqual({
      id: "c", familyId: FAM, name: "Emma", dateOfBirth: "2026-07-15", importantNotes: [], feeding: undefined, sleep: undefined,
    });
  });
  it("maps reminders, including recurrence and completion", () => {
    const r = toReminder({ id: "r", family_id: FAM, child_id: null, title: "t", description: null, due_at: "2026-10-01T09:00:00Z", recurrence: { frequency: "daily", interval: 1 }, completed_at: null, notification_scheduled_at: null });
    expect(r).toMatchObject({ familyId: FAM, recurrence: { frequency: "daily" }, completedAt: undefined, notificationScheduledAt: undefined });
  });
  it("sends only the fields being updated", () => {
    expect(reminderPatchRow({ title: "New" })).toEqual({ title: "New" });
    expect(reminderPatchRow({ recurrence: null, description: null })).toEqual({ recurrence: null, description: null });
  });
});

describe("error translation", () => {
  it.each([
    [{ code: "42501", message: 'new row violates row-level security policy for table "memories"' }, "forbidden"],
    [{ code: "PGRST116", message: "no rows" }, "not_found"],
    [{ code: "23503", message: "violates foreign key constraint" }, "invalid"],
    [{ code: "22023", message: "date of birth cannot be in the future" }, "invalid"],
    [{ message: "TypeError: Network request failed" }, "network"],
    [{ code: "XX000", message: "boom" }, "unknown"],
  ])("%j -> %s, with no database text in the message", (err, code) => {
    const e = toDataError(err);
    expect(e).toBeInstanceOf(DataError);
    expect(e.code).toBe(code);
    expect(e.message).not.toMatch(/row-level|foreign key|boom|TypeError|violates/i);
  });
});

describe("Supabase repositories", () => {
  it("scopes every family query by family_id", async () => {
    const { client, calls } = fakeClient({});
    const repos = createSupabaseRepositories(client);
    await repos.family.listChildren(FAM);
    await repos.appointments.listUpcoming(FAM, new Date());
    await repos.memories.list(FAM);
    await repos.memories.search(FAM, "bottle");
    await repos.reminders.list(FAM);
    const scoped = calls.filter((c) => c.table !== "caregivers");
    expect(scoped).toHaveLength(5);
    for (const c of scoped) expect(eqArgs(c)).toContainEqual(["family_id", FAM]);
  });

  it("lists only open reminders unless asked", async () => {
    const { client, calls } = fakeClient({});
    const repos = createSupabaseRepositories(client);
    await repos.reminders.list(FAM);
    await repos.reminders.list(FAM, { includeCompleted: true });
    expect(calls[0]!.ops.some(([n, a]) => n === "is" && a[0] === "completed_at")).toBe(true);
    expect(calls[1]!.ops.some(([n]) => n === "is")).toBe(false);
  });

  it("onboards through the single atomic database function, then loads the family", async () => {
    const { client, calls } = fakeClient({
      "rpc:onboard_family": { data: "fam-new", error: null },
      caregivers: {
        data: { id: "cg", family_id: "fam-new", user_id: "u1", display_name: "Sarah", role: "owner", can_edit: true, can_manage_family: true, families: { id: "fam-new", name: "Sarah's family", created_at: "2026-09-30T00:00:00Z" } },
        error: null,
      },
    });
    const ctx = await createSupabaseRepositories(client).family.onboard({ displayName: "Sarah", childName: "Emma", childDateOfBirth: "2026-07-15" });
    expect(ctx.family).toMatchObject({ id: "fam-new", name: "Sarah's family" });
    expect(ctx.caregiver).toMatchObject({ displayName: "Sarah", role: "owner", userId: "u1", permissions: { canEdit: true } });
    const rpc = calls.find((c) => c.table === "rpc:onboard_family")!;
    expect(rpc.ops.find(([n]) => n === "args")![1][0]).toEqual({ my_display_name: "Sarah", child_name: "Emma", child_date_of_birth: "2026-07-15" });
    // exactly one write path: no separate family/child inserts from the client
    expect(calls.filter((c) => c.ops.some(([n]) => n === "insert"))).toHaveLength(0);
  });

  it("reports the signed-out state instead of querying with no user", async () => {
    const { client } = fakeClient({ "rpc:onboard_family": { data: "f", error: null } }, null);
    await expect(createSupabaseRepositories(client).family.onboard({ displayName: "S", childName: "E", childDateOfBirth: "2026-07-15" })).rejects.toMatchObject({ code: "forbidden" });
  });

  it("returns null context when the user has no family (shows onboarding)", async () => {
    const { client } = fakeClient({ caregivers: { data: null, error: null } });
    expect(await createSupabaseRepositories(client).family.getContextForUser("u1")).toBeNull();
  });

  it("an update/complete/delete of a reminder RLS hides reports not_found", async () => {
    const { client } = fakeClient({ reminders: { data: null, error: null } });
    const repos = createSupabaseRepositories(client);
    await expect(repos.reminders.update(FAM, "r", { title: "x" })).rejects.toMatchObject({ code: "not_found" });
    await expect(repos.reminders.complete(FAM, "r")).rejects.toMatchObject({ code: "not_found" });
    const { client: c2 } = fakeClient({ reminders: { data: [], error: null } });
    await expect(createSupabaseRepositories(c2).reminders.delete(FAM, "r")).rejects.toMatchObject({ code: "not_found" });
  });

  it("surfaces an RLS violation on insert as a calm 'forbidden'", async () => {
    const { client } = fakeClient({ memories: { data: null, error: { code: "42501", message: 'new row violates row-level security policy for table "memories"' } } });
    const p = createSupabaseRepositories(client).memories.create("other-family", { kind: "general", content: "x", tags: [] });
    await expect(p).rejects.toMatchObject({ code: "forbidden", message: expect.not.stringMatching(/row-level/) });
  });

  it("maps a thrown fetch failure to a network error", async () => {
    const { client } = fakeClient({ children: () => { throw new TypeError("Network request failed"); } });
    await expect(createSupabaseRepositories(client).family.listChildren(FAM)).rejects.toMatchObject({ code: "network" });
  });

  it("scopes updates and deletes by family as well as id", async () => {
    const row = { id: "r", family_id: FAM, child_id: null, title: "t", description: null, due_at: "2026-10-01T09:00:00Z", recurrence: null, completed_at: null, notification_scheduled_at: null };
    const { client, calls } = fakeClient({ reminders: { data: row, error: null } });
    await createSupabaseRepositories(client).reminders.update(FAM, "r", { title: "t" });
    expect(eqArgs(calls[0]!)).toEqual(expect.arrayContaining([["id", "r"], ["family_id", FAM]]));
  });
});
