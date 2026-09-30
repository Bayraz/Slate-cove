import { runAssistantTurn } from "@/ai/orchestrator";
import { previewProvider } from "@/ai/providers/previewProvider";
import { createToolRegistry, type ToolContext } from "@/ai/tools";
import type { AiProvider, ChatMessage } from "@/ai/types";
import { MOCK_FAMILY_ID } from "@/data/mock/mockData";
import { createMockRepositories } from "@/data/mock/mockRepositories";

const now = new Date("2026-09-30T09:00:00");
const context: ToolContext = {
  familyId: MOCK_FAMILY_ID,
  caregiverId: "c1",
  repos: createMockRepositories(() => now),
  now: () => now,
};
const registry = createToolRegistry();
const say = (text: string): ChatMessage[] => [{ id: "1", role: "user", text, createdAt: now.toISOString() }];
const turn = (text: string, provider: AiProvider = previewProvider) =>
  runAssistantTurn(say(text), { provider, registry, context });

describe("runAssistantTurn", () => {
  it("answers emergencies with fixed guidance and never reaches the provider", async () => {
    const provider: AiProvider = { id: "spy", isPreview: false, next: jest.fn() };
    const reply = await turn("she's not breathing", provider);
    expect(reply.tone).toBe("safety");
    expect(reply.text).toContain("999");
    expect(provider.next).not.toHaveBeenCalled();
  });

  it("does not answer health questions itself", async () => {
    const reply = await turn("Emma has a fever, how much calpol?");
    expect(reply.text).toMatch(/can't diagnose/);
    expect(reply.text).toMatch(/111/);
    expect(reply.toolActivity).toEqual([]);
  });

  it("runs an approved read tool and explains the real result", async () => {
    const reply = await turn("What reminders do I have?");
    expect(reply.toolActivity).toEqual([{ tool: "list_reminders", ok: true, summary: "Looked at your reminders" }]);
    expect(reply.text).toContain("Pack changing bag");
  });

  it("finds saved memories", async () => {
    const reply = await turn("Who is my health visitor?");
    expect(reply.text).toContain("Jane");
  });

  it("says plainly it can't do unsupported actions, and reports no tool activity", async () => {
    for (const text of ["Remind me tonight to pack the changing bag", "Remember that the doctor wants us to monitor this", "Add the baby clinic to my calendar"]) {
      const reply = await turn(text);
      expect(reply.text).toMatch(/haven't done it|nothing has been saved/i);
      expect(reply.toolActivity).toEqual([]);
    }
  });

  it("blocks a provider that claims an action no tool performed", async () => {
    const liar: AiProvider = { id: "liar", isPreview: false, next: async () => ({ type: "message", text: "I've set a reminder for tonight." }) };
    expect((await turn("remind me", liar)).text).toMatch(/can't confirm/);
  });

  it("refuses tools the provider invents, without changing anything", async () => {
    let calls = 0;
    const rogue: AiProvider = {
      id: "rogue",
      isPreview: false,
      next: async () => (calls++ === 0 ? { type: "tool_call", name: "drop_database", input: {} } : { type: "message", text: "Sorry, I couldn't do that." }),
    };
    const reply = await turn("hi", rogue);
    expect(reply.toolActivity).toEqual([{ tool: "drop_database", ok: false, summary: "Couldn't complete that" }]);
  });

  it("survives provider errors with an honest message", async () => {
    const broken: AiProvider = { id: "broken", isPreview: false, next: async () => { throw new Error("network"); } };
    const reply = await turn("hello", broken);
    expect(reply.tone).toBe("error");
    expect(reply.text).toMatch(/Nothing has been changed/);
  });
});
