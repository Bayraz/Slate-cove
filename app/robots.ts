import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// `output: export` needs this pinned so the file is written at build time.
export const dynamic = "force-static";

/**
 * Nothing here is private, so everything is crawlable.
 *
 * The AI crawlers are listed explicitly rather than left to the wildcard.
 * They are separate user-agents that some hosts and CDNs block by default,
 * and being readable by them is the whole point of wanting to show up in
 * AI answers — a blocked crawler means the assistant cannot cite you.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Answer engines and AI assistants.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
