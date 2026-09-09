/**
 * Writes the next queued blog post using the Anthropic API.
 *
 * Run by .github/workflows/weekly-post.yml on a schedule. It runs inside
 * GitHub Actions, which already has permission to push to this repository,
 * so there is no access to arrange.
 *
 * What it does:
 *   1. Reads content/TOPICS.md for the queue and the house rules.
 *   2. Reads the existing posts, so it never repeats a subject and matches
 *      the established voice.
 *   3. Asks Claude for the next unwritten topic as a complete markdown file.
 *   4. Writes it to content/blog/ and moves the topic to the Written list.
 *
 * It writes nothing and exits cleanly when the queue is empty. An empty queue
 * is a signal to add topics, not a reason to invent filler.
 *
 * Requires: ANTHROPIC_API_KEY in the environment.
 */

import fs from "node:fs";
import path from "node:path";

const MODEL = process.env.POST_MODEL || "claude-sonnet-5";
const ROOT = process.cwd();
const TOPICS_PATH = path.join(ROOT, "content", "TOPICS.md");
const BLOG_DIR = path.join(ROOT, "content", "blog");

const fail = (message) => {
  console.error(`\nweekly-post: ${message}\n`);
  process.exit(1);
};

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  fail(
    "ANTHROPIC_API_KEY is not set. Add it under the repository's " +
      "Settings > Secrets and variables > Actions.",
  );
}

const topics = fs.readFileSync(TOPICS_PATH, "utf8");

const existing = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
  .map((f) => ({ file: f, body: fs.readFileSync(path.join(BLOG_DIR, f), "utf8") }));

const today = new Date().toISOString().slice(0, 10);

// Posts sitting in an unmerged pull request are not on this branch, so without
// this the job would happily write the same topic a second time.
const pending = (process.env.PENDING_SLUGS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const prompt = `You write for Slate & Cove, a London short-let and Airbnb management company. Your readers are landlords who own property in London and the Home Counties and are deciding whether to let it short-term.

Below is the topic queue with the house rules, then every post already published. Write the next post.

=== content/TOPICS.md ===
${topics}

=== POSTS ALREADY PUBLISHED (${existing.length}) ===
${existing.map((p) => `--- ${p.file} ---\n${p.body}`).join("\n\n")}
${
  pending.length
    ? `\n=== ALSO ALREADY WRITTEN, WAITING TO BE PUBLISHED ===\nThese are written and sitting in open pull requests. Treat them as covered and do not write any of them again:\n${pending.map((s) => `- ${s}`).join("\n")}`
    : ""
}

=== YOUR TASK ===
Take the HIGHEST topic in the queue that is not already covered by a published post. Write it as a complete markdown file.

Follow the house rules in TOPICS.md exactly. The one that matters most: never state a statistic, fee, fine, threshold or date you cannot stand behind. If you are not certain of a figure, describe how the rule works instead of asserting a number. A confidently wrong number about UK tax or planning law, published on a real company's website, is far worse than a vaguer sentence. The only figures you may state as fact are the ones already used on the site: the 15% and 18% management fees, and the 90-night London limit.

Match the voice of the published posts above: plain, short sentences, British spelling, no marketing language, and willing to say when a short let is the wrong answer or when a rule is genuinely contested.

Today's date is ${today}.

Output ONLY the file, starting with the frontmatter, in this exact shape and nothing else. No preamble, no explanation, no code fences:

---
title: "..."
description: "One sentence. This becomes the Google result and the index blurb."
date: ${today}
topic: "..."
---

The post body in markdown.

Before the frontmatter, on the very first line, output the filename you want, like this:
FILENAME: some-url-slug.md

Then a blank line, then the frontmatter and body.

If every topic in the queue is already covered by a published post, output exactly QUEUE_EMPTY and nothing else.`;

console.log(`weekly-post: asking ${MODEL} for the next queued topic...`);

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model: MODEL,
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  }),
});

if (!response.ok) {
  const detail = await response.text();
  fail(`the Anthropic API returned ${response.status}.\n${detail}`);
}

const payload = await response.json();
const text = (payload.content ?? [])
  .filter((block) => block.type === "text")
  .map((block) => block.text)
  .join("")
  .trim();

if (!text) fail("the API returned no text.");

if (text.startsWith("QUEUE_EMPTY")) {
  console.log(
    "weekly-post: every queued topic is already written. Nothing to do.\n" +
      "Add topics to content/TOPICS.md to start it again.",
  );
  // Written to the step summary so the run is legible in GitHub's UI.
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY || "/dev/null", "Queue empty, no post written.\n");
  process.exit(0);
}

const match = text.match(/^FILENAME:\s*([a-z0-9-]+\.md)\s*\n+([\s\S]+)$/);
if (!match) fail(`could not read a FILENAME line from the response. Got:\n${text.slice(0, 400)}`);

const [, filename, body] = match;
const target = path.join(BLOG_DIR, filename);

if (fs.existsSync(target)) fail(`${filename} already exists. Refusing to overwrite a published post.`);
if (pending.includes(filename.replace(/\.md$/, ""))) {
  fail(`${filename} is already written and waiting in an open pull request.`);
}

// The build enforces these too, but failing here gives a clearer message.
for (const field of ["title:", "description:", "date:", "topic:"]) {
  if (!body.includes(field)) fail(`the generated post has no ${field} in its frontmatter.`);
}
if (body.includes("—")) fail("the generated post contains an em dash, which the house rules forbid.");

fs.writeFileSync(target, body.endsWith("\n") ? body : `${body}\n`);
console.log(`weekly-post: wrote content/blog/${filename}`);

// Move the topic across, so the next run picks a different one.
const title = body.match(/title:\s*"([^"]+)"/)?.[1] ?? filename;
const updated = topics.replace(
  /^## Written\n/m,
  `## Written\n\n- ${title} (\`${filename}\`)`,
);
if (updated !== topics) {
  fs.writeFileSync(TOPICS_PATH, updated);
  console.log("weekly-post: added it to the Written list in content/TOPICS.md");
}

// Hand the workflow what it needs for the branch name and PR title.
const out = process.env.GITHUB_OUTPUT;
if (out) {
  fs.appendFileSync(out, `slug=${filename.replace(/\.md$/, "")}\n`);
  fs.appendFileSync(out, `title=${title.replace(/\n/g, " ")}\n`);
  fs.appendFileSync(out, `wrote=true\n`);
}
