"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { REFERRAL } from "@/lib/content";

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
const WHERE_IT_ALREADY_LIVES = ["/", "/partners", "/blog", "/refer"];

export default function WaysToWork() {
  const pathname = usePathname();
  const path = pathname.replace(/\/+$/, "") || "/";

  // Not on the pages that carry the terms in full, where it would be a link
  // to the section the reader is already in.
  if (WHERE_IT_ALREADY_LIVES.includes(path)) return null;

  return (
    <section className="ways" aria-labelledby="ways-title">
      <div className="wrap ways__inner">
        <h2 className="ways__title" id="ways-title">
          Two other ways to work with us
        </h2>
        <ul className="ways__list">
          <li className="way">
            <Link className="way__link" href="/refer">
              Refer a property, take {REFERRAL.fee}
            </Link>
            <span className="way__note">
              Introduce a landlord and take {REFERRAL.fee} when the property
              goes live. Estate agents have a choice of terms.
            </span>
          </li>
          <li className="way">
            <Link className="way__link" href="/services">
              What we actually do
            </Link>
            <span className="way__note">
              The eight things we handle on a managed short let, each explained
              properly rather than in a sentence.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
