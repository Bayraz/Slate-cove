import type { MetadataRoute } from "next";
import { AREA_PAGES } from "@/lib/areas";
import { POSTS } from "@/lib/blog";
import { FOOTER_EXTRA, NAV } from "@/lib/content";
import { SERVICE_PAGES } from "@/lib/services";
import { SITE } from "@/lib/seo";

// `output: export` needs this pinned so the file is written at build time.
export const dynamic = "force-static";

/** One entry per route. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // The home page is listed on its own rather than taken from NAV. The header
  // no longer carries a "Home" link, because the logo is the convention, and
  // deriving the sitemap from the navigation quietly dropped the root when it
  // went.
  const home: MetadataRoute.Sitemap = [
    {
      url: `${SITE.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const pages: MetadataRoute.Sitemap = [...NAV, ...FOOTER_EXTRA].map(({ href }) => ({
    url: `${SITE.url}${href}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: href === "/contact" || href === "/submit-property" ? 0.9 : 0.8,
  }));

  // One page per service. These are the pages that answer "what does an
  // Airbnb management company actually do", so they matter as much as the
  // area pages do for local search.
  const services: MetadataRoute.Sitemap = SERVICE_PAGES.map((service) => ({
    url: `${SITE.url}/services/${service.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // The area pages are the ones aimed at local search, so they belong here
  // as much as the main navigation does.
  const areas: MetadataRoute.Sitemap = AREA_PAGES.map((area) => ({
    url: `${SITE.url}/locations/${area.slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Posts carry their own dates, so search engines see a real revision
  // history rather than every URL claiming to have changed at build time.
  const posts: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}/`,
    lastModified: new Date(`${post.updated ?? post.date}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...home, ...pages, ...services, ...areas, ...posts];
}
