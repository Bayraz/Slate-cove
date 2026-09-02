import type { MetadataRoute } from "next";
import { NAV } from "@/lib/content";
import { SITE } from "@/lib/seo";

// `output: export` needs this pinned so the file is written at build time.
export const dynamic = "force-static";

/** One entry per route, driven off the same NAV list the header renders. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return NAV.map(({ href }) => ({
    url: href === "/" ? `${SITE.url}/` : `${SITE.url}${href}/`,
    lastModified: now,
    changeFrequency: href === "/" ? "weekly" : "monthly",
    priority: href === "/" ? 1 : href === "/contact" ? 0.9 : 0.8,
  }));
}
