import type { Metadata } from "next";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { FAQ, STEPS } from "@/lib/content";
import { faqSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How Airbnb Management Works: From Enquiry to Payout",
  description:
    "From first enquiry to first payout: consultation, onboarding, go live, ongoing management and your monthly payout. Plus answers to the eight questions landlords ask most.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
        ])}
      />
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
          {STEPS.map(({ num, title, copy, icon }) => (
            <div className="step" key={num}>
              <div className="step__num" aria-hidden="true">
                {num}
              </div>
              <Icon className="step__icon" d={icon} />
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
              <details className="faq__item" key={q}>
                <summary>
                  <span>{q}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                       strokeLinecap="round" aria-hidden="true">
                    <path d="M12 5.5v13M5.5 12h13" />
                  </svg>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
