import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ReferralForm from "@/components/ReferralForm";
import {
  CONTACT,
  REFERRAL,
  REFERRAL_FAQ,
  REFERRAL_STEPS,
  REFERRAL_TERMS,
  REFERRERS,
  TICK,
  WHO_TO_REFER,
} from "@/lib/content";
import { breadcrumbSchema, faqSchemaFor, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Refer a Property, Receive £275",
  description:
    "Introduce a London landlord to Slate & Cove and receive £275 when the property goes live. Open to estate agents and to anyone who knows a property owner. One flat fee, no cap, and the client stays yours.",
  path: "/partners",
});

export default function PartnersPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "For estate agents", path: "/partners" },
        ])}
      />
      <JsonLd schema={faqSchemaFor("/partners", REFERRAL_FAQ)} />

      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">Referral programme</p>
            <h1 className="d2">Have a landlord who needs a better option?</h1>
          </div>
          <div className="page-head__body">
            <p className="lead">
              Introduce them to Slate &amp; Cove. We manage the property, and
              you receive a {REFERRAL.fee} referral reward when it goes live.
            </p>
            <div className="hero__cta hero__cta--pair">
              <Link className="btn btn--solid" href="#refer">
                Refer a property
              </Link>
              <a className="btn btn--outline" href={`mailto:${CONTACT.email}`}>
                Talk to us first
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The figure, once, large. It is the whole offer and it should be
          readable from across the room. */}
      <section className="section section--dark">
        <div className="wrap fee">
          <p className="fee__figure">{REFERRAL.fee}</p>
          <div className="fee__body">
            <p className="fee__line">
              For every property that goes live with us. One flat fee, whoever
              you are and whatever the property earns.
            </p>
            <p className="fee__sub">
              No percentage, no tiers, no cap. Paid {REFERRAL.window} of the
              property going live and earning.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Who can refer</p>
            <h2 className="d5">You do not have to be an estate agent</h2>
          </div>
          <div className="routes">
            {REFERRERS.map(({ kind, icon, copy, point }) => (
              <div className="route" key={kind}>
                <p className="route__kind">
                  <Icon className="route__icon" d={icon} />
                  <span>{kind}</span>
                </p>
                <p className="route__copy">{copy}</p>
                <p className="route__point">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Who to refer</p>
            <h2 className="d5">The owners worth introducing</h2>
          </div>
          <ul className="terms">
            {WHO_TO_REFER.map((line) => (
              <li key={line}>
                <Icon className="tick" d={TICK} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">The process</p>
            <h2 className="d5">You make the introduction. We do the rest.</h2>
          </div>
          <div className="steps">
            {REFERRAL_STEPS.map(({ num, title, copy }) => (
              <div className="step step--plain" key={num}>
                <div className="step__num" aria-hidden="true">
                  {num}
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">In writing, before you introduce anybody</p>
            <h2 className="d5">What we commit to</h2>
          </div>
          <ul className="terms">
            {REFERRAL_TERMS.map((term) => (
              <li key={term}>
                <Icon className="tick" d={TICK} />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="refer">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Refer a property</p>
            <h2 className="d5">Send us the property and the owner</h2>
          </div>
          <p className="lead">
            Nothing to sign, and one property is enough to start. We contact the
            owner, usually the same day, and tell them the introduction came
            from you.
          </p>
          <ReferralForm />
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2 className="d5">Questions we are asked first</h2>
          </div>
          <div className="faq">
            {REFERRAL_FAQ.map(({ q, a }) => (
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
