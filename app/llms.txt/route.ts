import {
  AREAS,
  CONTACT,
  FAQ,
  MANAGEMENT_FEES,
  FOOTER_EXTRA,
  NAV,
  SERVICES,
  STEPS,
} from "@/lib/content";
import { AREA_PAGES } from "@/lib/areas";
import { POSTS } from "@/lib/blog";
import { SITE } from "@/lib/seo";

// Served as a static file by `output: "export"`, the same way robots.txt is.
export const dynamic = "force-static";

/**
 * A plain-language brief for AI assistants, generated from lib/content.ts so
 * it cannot drift from the site. Previously this was a hand-written file in
 * public/, which meant a pricing or coverage change silently left it stale.
 */
function body() {
  const url = (path: string) => `${SITE.url}${path === "/" ? "/" : `${path}/`}`;

  return `# ${SITE.name}

> ${SITE.description}

Slate & Cove manages short lets end to end, so the owner has no day-to-day
involvement. Landlords typically earn 30-40% more than a standard long-term
tenancy.

## Pricing

- Full-time plan: ${MANAGEMENT_FEES.fullTime} of net revenue. The property is available all year
  round on a minimum six-month commitment.
- Flexible plan: ${MANAGEMENT_FEES.flexible} of net revenue. 30-day rolling contract, block out any
  dates you need, no minimum availability.
- Commission is calculated on net revenue after platform fees. VAT may apply.
- No setup fees. Cleaning, maintenance and consumables are passed through at
  cost and are not covered by the management fee.

## What is included

${SERVICES.map((s) => `- ${s.title}: ${s.copy}`).join("\n")}

Listings run on Airbnb, Booking.com, Vrbo, Expedia and Blueground. Short-let
compliance, including the 90-night rule, is tracked.

## How it works

${STEPS.map((s) => `${s.num}. ${s.title}: ${s.copy}`).join("\n\n")}

## Areas covered

${AREAS.map((a) => `${a.title}: ${a.places.join(", ")}.`).join("\n")}

## Common questions

${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Pages

${[...NAV, ...FOOTER_EXTRA].map((n) => `- [${n.label}](${url(n.href)})`).join("\n")}

## Area pages

Each area has its own page covering the local property stock and who books it:

${AREA_PAGES.map((a) => `- ${a.name}: ${url(`/locations/${a.slug}`)}`).join("\n")}

## For landlords

Longer answers to the questions landlords ask before signing anything:

${POSTS.length
    ? POSTS.map((p) => `- ${p.title} (${p.date}): ${url(`/blog/${p.slug}`)}\n  ${p.description}`).join("\n")
    : "- None published yet."}

## Contact

Email: ${CONTACT.email}
Telephone: ${CONTACT.telephone}
Office: ${CONTACT.addressLines.join(", ")}
Hours: ${CONTACT.hoursLines.join("; ")}
`;
}

export function GET() {
  return new Response(body(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
