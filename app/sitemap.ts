import type { MetadataRoute } from "next";
import { AREA_PAGES } from "@/lib/areas";
import { NAV } from "@/lib/content";
import { SITE } from "@/lib/seo";

// `output: export` needs this pinned so the file is written at build time.
export const dynamic = "force-static";

/** One entry per route, driven off the same NAV list the header renders. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = NAV.map(({ href }) => ({
    url: href === "/" ? `${SITE.url}/` : `${SITE.url}${href}/`,
    lastModified: now,
    changeFrequency: href === "/" ? "weekly" : "monthly",
    priority: href === "/" ? 1 : href === "/contact" ? 0.9 : 0.8,
  }));

  // The area pages are the ones aimed at local search, so they belong here
  // as much as the main navigation does.
  const areas: MetadataRoute.Sitemap = AREA_PAGES.map((area) => ({
    url: `${SITE.url}/locations/${area.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...areas];
}
