import { guardActionClaims, screenMessage } from "@/ai/safety";

describe("screenMessage", () => {
  it.each([
    "She's not breathing properly",
    "he is unresponsive and floppy",
    "I think she's having a seizure",
    "the baby is choking",
    "his lips are turning blue",
    "she swallowed a button battery",
  ])("flags emergency: %s", (text) => expect(screenMessage(text).level).toBe("emergency"));

  it.each(["I want to hurt myself", "I keep thinking about harming the baby"])("flags crisis: %s", (text) =>
    expect(screenMessage(text).level).toBe("crisis"),
  );

  it.each(["Emma has a fever", "how much calpol can I give", "is this rash normal?"])(
    "flags health topic: %s",
    (text) => expect(screenMessage(text).level).toBe("health"),
  );

  it.each(["What reminders do I have?", "How old is Emma?", "Remind me to pack the changing bag"])(
    "leaves everyday messages alone: %s",
    (text) => expect(screenMessage(text).level).toBe("none"),
  );
});

describe("guardActionClaims", () => {
  it("replaces claims of actions that didn't happen", () => {
    for (const text of ["I've set a reminder for tonight.", "Done, I've saved that.", "Your reminder is set.", "All done!"]) {
      expect(guardActionClaims(text, 0)).toMatch(/can't confirm/);
    }
  });
  it("lets honest text and confirmed actions through", () => {
    expect(guardActionClaims("I can't set reminders yet.", 0)).toBe("I can't set reminders yet.");
    expect(guardActionClaims("I've saved that.", 1)).toBe("I've saved that.");
  });
});
