import type { Memory } from "./models";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "is", "are", "was", "my", "me", "i", "we", "our",
  "what", "who", "when", "does", "do", "did", "about", "for", "in", "on", "it", "that", "this", "with",
]);

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));

/**
 * Simple relevance search over structured memories (content, tags, kind).
 * Deliberately dependency-free. A Postgres full-text/embedding implementation
 * can replace this behind MemoryRepository without touching callers.
 */
export function searchMemories(memories: Memory[], query: string, limit = 5): Memory[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  return memories
    .map((memory) => {
      const content = tokenize(memory.content);
      const tags = memory.tags.map((t) => t.toLowerCase());
      let score = 0;
      for (const term of terms) {
        if (content.includes(term)) score += 2;
        else if (content.some((c) => c.startsWith(term) || term.startsWith(c))) score += 1;
        if (tags.includes(term)) score += 3;
        if (memory.kind.replace("_", " ").includes(term)) score += 1;
      }
      return { memory, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.memory.createdAt.localeCompare(a.memory.createdAt))
    .slice(0, limit)
    .map((r) => r.memory);
}
