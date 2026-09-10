// The blog, read from the markdown files in content/blog at build time.
//
// Posts are markdown rather than typed content modules like content.ts and
// areas.ts, because these are long-form prose: headings, links and lists in a
// .md file are far easier to write and revise than nested objects. Everything
// still resolves at build time, so `output: export` emits plain HTML and no
// parser reaches the browser.
//
// To add a post: drop a .md file into content/blog with the frontmatter below.
// The filename becomes the URL. Nothing else needs changing; the index page,
// sitemap and llms.txt all read from here. A filename starting with an
// underscore is skipped, so an unfinished draft can sit in the directory.
//
// The queue of topics still to write lives in content/TOPICS.md, outside this
// directory so it is never mistaken for a post.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  /** Used as the meta description and the index page standfirst. */
  description: string;
  /** ISO date, e.g. 2026-09-09. Sorted on, and shown to the reader. */
  date: string;
  /** ISO date of the last substantive revision, if there has been one. */
  updated?: string;
  /** Short label grouping the post on the index, e.g. "Rules and tax". */
  topic: string;
  /**
   * Three or four takeaways, shown in a box above the article. For a reader
   * who wants the answer without the detail, and the part an AI assistant is
   * most likely to quote. Optional, since the earliest posts predate it.
   */
  summary: string[];
  /** The rendered body, as HTML. */
  html: string;
  /** Reading time in whole minutes, rounded up, minimum one. */
  minutes: number;
};

type Frontmatter = {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  updated?: unknown;
  topic?: unknown;
  summary?: unknown;
};

const DIR = path.join(process.cwd(), "content", "blog");

const asString = (v: unknown): string | undefined => {
  if (typeof v === "string") return v.trim() || undefined;
  // js-yaml parses a bare 2026-09-09 as a Date, so normalise it back.
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return undefined;
};

function read(file: string): Post {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  // A post missing any of these would ship with an empty title or no date in
  // its schema, which is worse than failing the build.
  const title = asString(fm.title);
  const description = asString(fm.description);
  const date = asString(fm.date);
  const topic = asString(fm.topic);
  const missing = [
    !title && "title",
    !description && "description",
    !date && "date",
    !topic && "topic",
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(`content/blog/${file} is missing frontmatter: ${missing.join(", ")}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date!)) {
    throw new Error(`content/blog/${file} has date "${date}", expected YYYY-MM-DD`);
  }

  const summary = Array.isArray(fm.summary)
    ? fm.summary.map(asString).filter((v): v is string => Boolean(v))
    : [];

  const words = content.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: title!,
    description: description!,
    date: date!,
    updated: asString(fm.updated),
    topic: topic!,
    summary,
    html: marked.parse(content, { async: false }) as string,
    minutes: Math.max(1, Math.round(words / 200)),
  };
}

/** Every post, newest first. */
export const POSTS: Post[] = (() => {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    // A leading underscore parks a draft in place without publishing it.
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(read)
    .sort((a, b) => b.date.localeCompare(a.date));
})();

export const POST_BY_SLUG = new Map(POSTS.map((p) => [p.slug, p]));

/** The most recent posts other than this one, for the read-next links. */
export function otherPosts(slug: string, count = 3): Post[] {
  return POSTS.filter((p) => p.slug !== slug).slice(0, count);
}

/** e.g. "9 September 2026". */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
