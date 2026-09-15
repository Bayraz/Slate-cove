"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The two offers that are not "we will manage your property", at the foot of
 * every page.
 *
 * Deliberately quiet, and deliberately not a band. The property form directly
 * above it is the one thing this site is for, and two calls to action of equal
 * weight split the reader's attention rather than doubling the chances: a
 * second block with its own heading and button would take conversions off the
 * form rather than adding to it.
 *
 * It earns its place because it speaks to somebody the form cannot serve at
 * all. An estate agent has no property of their own to submit, and neither
 * does a friend of a landlord. A secondary call to action aimed at a different
 * reader is not competition; one aimed at the same reader is.
 *
 * It is typographic rather than boxed for the same reason a house style beats
 * a banner: anything shaped like an advert is filtered out before it is read,
 * and that habit is strongest in exactly this position on the page.
 */
/**
 * The pages that carry these offers in full. Linking somebody to the section
 * they are already reading is worse than showing nothing.
 */
const WHERE_IT_ALREADY_LIVES = ["/", "/partners", "/blog", "/refer"];

const WAYS = [
  {
    href: "/refer",
    title: "Refer a property, take £275",
    note: "Introduce a landlord and take £275 when the property goes live. Estate agents have a choice of terms.",
  },
  {
    href: "/how-it-works",
    title: "What we actually do",
    note: "The eight things we handle on a managed short let, each explained properly rather than in a sentence.",
  },
] as const;

export default function WaysToWork() {
  const pathname = usePathname();
  const path = pathname.replace(/\/+$/, "") || "/";

  // Not on the pages that carry the terms in full, where it would be a link
  // to the section the reader is already in.
  if (WHERE_IT_ALREADY_LIVES.includes(path)) return null;

  // A link to the page you are on is not a way to work with us.
  const ways = WAYS.filter((way) => way.href !== path);
  if (ways.length === 0) return null;

  return (
    <section className="ways" aria-labelledby="ways-title">
      <div className="wrap ways__inner">
        <h2 className="ways__title" id="ways-title">
          Two other ways to work with us
        </h2>
        <ul className="ways__list">
          {ways.map(({ href, title, note }) => (
            <li className="way" key={href}>
              <Link className="way__link" href={href}>
                {title}
              </Link>
              <span className="way__note">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
