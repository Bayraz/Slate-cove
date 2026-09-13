import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import {
  CONTACT,
  PARTNER,
  PARTNER_ROUTES,
  PARTNER_WHO,
  PARTNER_FAQ,
  PARTNER_OFFER,
  PARTNER_STEPS,
  PARTNER_TERMS,
  TICK,
} from "@/lib/content";
import { breadcrumbSchema, pageMetadata, partnerFaqSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Estate Agent Partnerships: Refer a Landlord, Keep the Client",
  description:
    `Refer a London landlord to us and earn ${PARTNER.referralShare} of our management fee every month, for as long as we manage the property. We do not act on sales or long tenancies, so the client stays yours.`,
  path: "/partners",
});

export default function PartnersPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Partners", path: "/partners" },
        ])}
      />
      <JsonLd schema={partnerFaqSchema} />

      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">For independent estate and letting agents</p>
            <h1 className="d2">Refer a landlord, keep the client</h1>
          </div>
          <div className="page-head__body">
            <p className="lead">
              When a property will not sell, or sits empty between tenancies, we
              put it to work as a short let. You earn every month it is managed,
              and the client is still yours when they are ready to sell or let.
            </p>
            <p className="note">
              We do not act on sales or long tenancies. Short lets are the whole
              of our business, which is the only reason this arrangement works.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Two ways in</p>
            <h2 className="d5">Whichever side of the business you are on</h2>
          </div>
          <div className="routes">
            {PARTNER_ROUTES.map(({ kind, title, icon, copy, point }) => (
              <div className="route" key={kind}>
                <p className="route__kind">
                  <Icon className="route__icon" d={icon} />
                  <span>{kind}</span>
                </p>
                <h3 className="route__title">{title}</h3>
                <p className="route__copy">{copy}</p>
                <p className="route__point">{point}</p>
              </div>
            ))}
          </div>
          <p className="note">{PARTNER_WHO}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">What you get</p>
            <h2 className="d5">
              {PARTNER.referralShare} of our fee, for as long as we manage it
            </h2>
          </div>
          <div className="services services--three">
            {PARTNER_OFFER.map(({ title, icon, copy }) => (
              <div className="service" key={title}>
                <Icon className="service__icon" d={icon} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
          <p className="note">
            Our management commission is 15% of net revenue on the full-time
            plan and 18% on the flexible one, so your share is a proportion of
            that rather than of the rent. A property that earns nothing costs
            you nothing and pays you nothing.
          </p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">How a referral runs</p>
            <h2 className="d5">From introduction to your first payment</h2>
          </div>
          <div className="steps">
            {PARTNER_STEPS.map(({ num, title, copy, icon }) => (
              <div className="step" key={num}>
                <div className="step__num" aria-hidden="true">
                  {num}
                </div>
                <Icon className="step__icon" d={icon} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">In writing, before you refer anybody</p>
            <h2 className="d5">What we commit to</h2>
          </div>
          <ul className="terms">
            {PARTNER_TERMS.map((term) => (
              <li key={term}>
                <Icon className="tick" d={TICK} />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2 className="d5">What agents ask us first</h2>
          </div>
          <div className="faq">
            {PARTNER_FAQ.map(({ q, a }) => (
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

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Two ways to start</p>
            <h2 className="d5">Ask for the terms, or just send a property</h2>
          </div>
          <p className="body-lg">
            For the partnership terms in writing before you refer anybody, call{" "}
            <a href={`tel:${CONTACT.telephoneHref}`}>{CONTACT.telephone}</a>,
            email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, or{" "}
            <Link href="/contact">send a message</Link> and pick the agent
            option. To find out what one property would earn first, the form
            below goes straight to us and you will have a figure within 24
            hours. Neither commits you to anything.
          </p>
        </div>
      </section>
    </>
  );
}
