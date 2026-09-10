"use client";

import { usePathname } from "next/navigation";
import PropertySubmissionForm from "@/components/PropertySubmissionForm";

/**
 * The property submission form, at the foot of every page.
 *
 * Wherever a visitor decides, they can act without going and finding a form
 * first. It replaces the call-to-action bands that used to close these pages:
 * a button that scrolls you to a form directly beneath it is a step for its
 * own sake.
 *
 * Left off the two pages that already carry a form. Two forms on one page
 * means duplicate field names, which confuses browser autofill and gives a
 * screen reader two identically labelled sets of controls.
 */
const ALREADY_HAS_A_FORM = ["/submit-property", "/contact"];

export default function SubmitBand() {
  const pathname = usePathname();
  const path = pathname.replace(/\/+$/, "") || "/";
  if (ALREADY_HAS_A_FORM.includes(path)) return null;

  return (
    <section className="section section--alt" id="submit">
      <div className="wrap stack">
        <div className="section-head">
          <p className="eyebrow">Free estimate</p>
          <h2 className="d5">What would your property earn?</h2>
        </div>
        <p className="lead">
          Send us the property and one of our managers will come back within 24
          hours with a realistic figure. No obligation, and no lock-in if you go
          ahead.
        </p>
        <PropertySubmissionForm />
      </div>
    </section>
  );
}
