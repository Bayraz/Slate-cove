/**
 * PREVIEW ASSISTANT: NOT A REAL AI.
 *
 * A tiny keyword router so the full pipeline (interpret -> approved tool ->
 * result -> explain) can be exercised end to end before a model is connected.
 * It only ever chooses READ-ONLY tools, only explains data a tool returned,
 * and says plainly when it can't do something. The UI labels it "Preview".
 * Replace with a server-side model provider; nothing else needs to change.
 */
import { formatTime } from "@/utils/dates";
import type { ChildInfoOutput } from "../tools/getChildInformation";
import type { ListRemindersOutput } from "../tools/listReminders";
import type { SearchMemoryOutput } from "../tools/searchMemory";
import { healthReply } from "../safety";
import type { AiProvider, ProviderRequest, ProviderStep, ToolExchange } from "../types";

const UNSUPPORTED_INTENT =
  /^\s*(please\s+)?(remember\b|remind me|add\b|create\b|set\b|save\b|log\b|book\b|delete\b|cancel\b|update\b|change\b|find\b|search\b|order\b|buy\b|when was\b)/i;
const LIST_REMINDERS = /\b(reminders?|to-?dos?|coming up|need to do)\b/i;
const CHILD_INFO = /\b(how old|age|about (her|him|them|the baby)|tell me about|child details|baby details)\b/i;
const MEMORY = /\b(who is|who's|what did i|did i (say|tell|save)|saved|remember|prefer|notes?|bottle|health visitor|doctor)\b/i;

const NOT_YET =
  "That isn't connected yet, so I haven't done it, and nothing has been saved, set or changed. " +
  "Right now, in this preview, I can look up your reminders, your child's saved details and things you've asked me to remember.";

const shortDate = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  return d.toDateString() === today.toDateString()
    ? formatTime(iso)
    : `${d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}`;
};

const bullets = (lines: string[]) => lines.map((l) => `• ${l}`).join("\n");

function explain(exchange: ToolExchange): string {
  const { result } = exchange;
  if (!result.ok) return `I couldn't do that: ${result.error.message} Nothing has been changed.`;
  switch (result.tool) {
    case "list_reminders": {
      const { reminders } = result.data as ListRemindersOutput;
      if (!reminders.length) return "You don't have any open reminders.";
      return `Here are your open reminders:\n${bullets(reminders.map((r) => `${r.title}, ${shortDate(r.dueAt)}${r.recurring ? " (repeats)" : ""}`))}`;
    }
    case "get_child_information": {
      const { children } = result.data as ChildInfoOutput;
      if (!children.length) return "I don't have any saved details for a child yet.";
      return children
        .map((c) => {
          const lines = [`${c.name} is ${c.age}.`];
          if (c.importantNotes.length) lines.push(...c.importantNotes.map((n) => `• ${n}`));
          if (c.feeding) lines.push(`Feeding (as you've told me): ${c.feeding}`);
          if (c.sleep) lines.push(`Sleep (as you've told me): ${c.sleep}`);
          return lines.join("\n");
        })
        .join("\n\n");
    }
    case "search_memory": {
      const { matches } = result.data as SearchMemoryOutput;
      if (!matches.length) return "I couldn't find anything you've saved about that.";
      return `Here's what you've saved:\n${bullets(matches.map((m) => m.content))}`;
    }
    default:
      return "Done.";
  }
}

export const previewProvider: AiProvider = {
  id: "preview",
  isPreview: true,
  async next(request: ProviderRequest): Promise<ProviderStep> {
    const last = request.toolExchanges.at(-1);
    if (last) return { type: "message", text: explain(last) };

    if (request.healthTopic) return { type: "message", text: healthReply() };

    const text = [...request.messages].reverse().find((m) => m.role === "user")?.text ?? "";
    if (UNSUPPORTED_INTENT.test(text)) return { type: "message", text: NOT_YET };
    if (LIST_REMINDERS.test(text)) return { type: "tool_call", name: "list_reminders", input: {} };
    if (CHILD_INFO.test(text)) return { type: "tool_call", name: "get_child_information", input: {} };
    if (MEMORY.test(text)) return { type: "tool_call", name: "search_memory", input: { query: text.slice(0, 200) } };
    return { type: "message", text: NOT_YET };
  },
};
