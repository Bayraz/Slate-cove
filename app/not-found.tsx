import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 should never be indexed, whatever else the site says.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap page-head">
        <div className="page-head__title">
          <p className="eyebrow">404</p>
          <h1 className="d2">This page has moved on</h1>
        </div>
        <div className="page-head__title">
          <p className="lead">
            The page you were after is not here. Everything else is a click
            away, or tell us about your property and we will come back with a
            free income estimate.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--solid" href="/">
              Back to the homepage
            </Link>
            <Link className="btn btn--outline" href="/submit-property">
              Get a free estimate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
