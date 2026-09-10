import { POSTS } from "@/lib/blog";
import { SITE, canonicalUrl } from "@/lib/seo";

// Served as a static file by `output: "export"`, the same way robots.txt is.
export const dynamic = "force-static";

/**
 * An RSS feed of the posts.
 *
 * This is what lets anything else read the blog without us writing an
 * integration for it: Buffer, Zapier, Make, IFTTT and the rest all take a feed
 * URL and can post from it to LinkedIn, a Facebook page or Instagram. Building
 * the feed once avoids building and maintaining three separate API
 * integrations, each with its own tokens to refresh.
 *
 * It is also how readers subscribe, and how some AI crawlers discover new
 * posts sooner than they would by recrawling the sitemap.
 */

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** RFC 822, which is what RSS wants rather than ISO. */
const rfc822 = (iso: string) => new Date(`${iso}T09:00:00Z`).toUTCString();

function body() {
  const items = POSTS.map((post) => {
    const url = canonicalUrl(`/blog/${post.slug}`);
    // The summary points make a far better social post than a truncated
    // opening paragraph, so they are what goes in the description.
    const description = post.summary.length
      ? `${post.description}\n\n${post.summary.map((p) => `• ${p}`).join("\n")}`
      : post.description;

    return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.updated ?? post.date)}</pubDate>
      <category>${escape(post.topic)}</category>
      <description>${escape(description)}</description>
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2000/atom">
  <channel>
    <title>${escape(SITE.name)}: for landlords</title>
    <link>${SITE.url}/blog/</link>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Guides for London landlords on short-let rules, tax, running costs and what a property can realistically earn.</description>
    <language>en-GB</language>
    <lastBuildDate>${POSTS.length ? rfc822(POSTS[0].updated ?? POSTS[0].date) : new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

export function GET() {
  return new Response(body(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
