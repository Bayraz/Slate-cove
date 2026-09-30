import { z } from "zod";
import { createToolRegistry, type ToolContext } from "@/ai/tools";
import { defineTool, ToolRegistry } from "@/ai/tools/registry";
import { createMockRepositories } from "@/data/mock/mockRepositories";
import { MOCK_FAMILY_ID } from "@/data/mock/mockData";

const now = new Date("2026-09-30T09:00:00");
const ctx: ToolContext = {
  familyId: MOCK_FAMILY_ID,
  caregiverId: "c1",
  repos: createMockRepositories(() => now),
  now: () => now,
};

describe("ToolRegistry", () => {
  const registry = createToolRegistry();

  it("only exposes registered tools, with JSON schemas", () => {
    const names = registry.specs().map((s) => s.name);
    expect(names.sort()).toEqual(["get_child_information", "list_reminders", "search_memory"]);
    expect(registry.specs()[0]?.inputSchema).toHaveProperty("type", "object");
  });

  it("rejects unknown tools", async () => {
    const res = await registry.execute("delete_everything", {}, ctx);
    expect(res).toMatchObject({ ok: false, error: { code: "unknown_tool" } });
  });

  it("validates input before running", async () => {
    const res = await registry.execute("search_memory", { query: "" }, ctx);
    expect(res).toMatchObject({ ok: false, error: { code: "invalid_input" } });
  });

  it("runs read tools against the family-scoped repositories", async () => {
    const res = await registry.execute("get_child_information", {}, ctx);
    expect(res).toMatchObject({ ok: true });
    expect(JSON.stringify(res)).toContain("11 weeks old");
    const other = await registry.execute("list_reminders", {}, { ...ctx, familyId: "someone-elses-family" });
    expect(other).toMatchObject({ ok: true, data: { reminders: [] } });
  });

  it("requires confirmation for write tools and never runs them unconfirmed", async () => {
    const run = jest.fn(async () => ({ saved: true }));
    const writer = new ToolRegistry([
      defineTool({
        name: "save_memory",
        description: "test",
        input: z.object({ content: z.string() }),
        sideEffect: "write",
        run,
        describeResult: () => "Saved",
      }),
    ]);
    const blocked = await writer.execute("save_memory", { content: "x" }, ctx);
    expect(blocked).toMatchObject({ ok: false, error: { code: "confirmation_required" } });
    expect(run).not.toHaveBeenCalled();
    const allowed = await writer.execute("save_memory", { content: "x" }, ctx, { confirmed: true });
    expect(allowed.ok).toBe(true);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("turns tool exceptions into failed results instead of throwing", async () => {
    const broken = new ToolRegistry([
      defineTool({
        name: "list_reminders",
        description: "t",
        input: z.object({}),
        sideEffect: "read",
        run: async () => {
          throw new Error("boom");
        },
        describeResult: () => "",
      }),
    ]);
    expect(await broken.execute("list_reminders", {}, ctx)).toMatchObject({ ok: false, error: { code: "failed" } });
  });
});
