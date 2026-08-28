import type { Metadata } from "next";
import Link from "next/link";
import {
  EXCLUSIONS,
  MANAGEMENT_FEE,
  PLAN_FLEXIBLE,
  PLAN_FULL_TIME,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent short-let management pricing. No setup fees, no hidden costs — a straightforward percentage of net revenue.",
};

export default function PricingPage() {
  return (
    <>
      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">Pricing</p>
            <h1 className="d2">Simple, transparent pricing</h1>
          </div>
          <p className="lead">
            No setup fees and no hidden costs. We only earn when you do — our fee
            is a straightforward percentage of your rental income.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap plans">
          <div className="plan plan--dark">
            <div className="plan__head">
              <div className="plan__title">
                <h2>Full-time</h2>
                <span className="plan__for">For full-time hosts</span>
              </div>
              <span className="plan__badge">Most popular</span>
            </div>
            <p className="plan__price">
              <span className="plan__from">From</span>
              <span className="plan__figure">{MANAGEMENT_FEE}</span>
              <span className="plan__unit">of net revenue</span>
            </p>
            <p className="plan__blurb">
              Your property is available all year round on a minimum six-month
              commitment. Best suited to landlords turning a property into a
              full-time short let and maximising the rent.
            </p>
            <ul className="plan__features">
              {PLAN_FULL_TIME.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link className="btn btn--light" href="/contact">
              Get started
            </Link>
          </div>

          <div className="plan plan--light">
            <div className="plan__head">
              <div className="plan__title">
                <h2>Flexible</h2>
                <span className="plan__for">For unlimited flexibility</span>
              </div>
            </div>
            <p className="plan__price">
              <span className="plan__from">From</span>
              <span className="plan__figure">{MANAGEMENT_FEE}</span>
              <span className="plan__unit">of net revenue</span>
            </p>
            <p className="plan__blurb">
              Your property is available whenever you like, on a 30-day rolling
              contract. Best suited to landlords planning to sell, or those who
              travel often and don&rsquo;t want the property sitting empty.
            </p>
            <ul className="plan__features">
              {PLAN_FLEXIBLE.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Link className="btn btn--solid" href="/contact">
              Get started
            </Link>
          </div>
        </div>
        <div className="wrap plan-note">
          <p className="note">
            Commission is calculated on net revenue, after platform fees. VAT may
            apply.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap exclusions">
          <h2 className="d6">What the management fee doesn&rsquo;t cover</h2>
          <div className="exclusions__grid">
            {EXCLUSIONS.map(({ title, copy }) => (
              <div className="exclusion" key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap cta-bar">
          <div className="cta-bar__body">
            <h2 className="d5">Not sure which plan fits?</h2>
            <p className="body-lg on-dark">
              We will give you a free personalised estimate and recommend the
              better option for your property.
            </p>
          </div>
          <Link className="btn btn--light" href="/contact">
            Get free estimate
          </Link>
        </div>
      </section>
    </>
  );
}
