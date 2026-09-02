import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { FAQ, STEPS } from "@/lib/content";
import { faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How Airbnb Management Works — From Enquiry to Payout",
  description:
    "From first enquiry to first payout: consultation, onboarding, go live, ongoing management and your monthly payout. Plus answers to the eight questions landlords ask most.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd schema={faqSchema} />
      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">Our process</p>
            <h1 className="d2">How it works</h1>
          </div>
          <p className="lead">
            From your first enquiry to your first payout, this is exactly what to
            expect when you appoint us.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap steps">
          {STEPS.map(({ num, title, copy }) => (
            <div className="step" key={num}>
              <div className="step__num" aria-hidden="true">
                {num}
              </div>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2 className="d5">Common questions</h2>
          </div>
          <div className="faq">
            {FAQ.map(({ q, a }) => (
              <div className="faq__item" key={q}>
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap cta-bar">
          <h2 className="d4">Ready to see the numbers for your property?</h2>
          <Link className="btn btn--light" href="/contact">
            Book a consultation
          </Link>
        </div>
      </section>
    </>
  );
}
