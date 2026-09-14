"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANDLORD_REFERRAL, PARTNER } from "@/lib/content";

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
const WHERE_IT_ALREADY_LIVES = ["/", "/partners", "/blog"];

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
            <Link className="way__link" href="/partners">
              Estate and letting agents
            </Link>
            <span className="way__note">
              £{PARTNER.flatFee} when a property goes live, or 3% of what it
              earns for three months. The client stays yours.
            </span>
          </li>
          <li className="way">
            <Link className="way__link" href="/blog#refer">
              Introduce a landlord
            </Link>
            <span className="way__note">
              {LANDLORD_REFERRAL.fee} once their property is live and earning.
              Anyone can, and there is no cap.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
