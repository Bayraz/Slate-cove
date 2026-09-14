import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import PartnerCalculator from "@/components/PartnerCalculator";
import ReferralLoop from "@/components/ReferralLoop";
import {
  CONTACT,
  LANDLORD_REFERRAL,
  PARTNER,
  PARTNER_HEADLINES,
  PARTNER_OPTIONS,
  PARTNER_ROUTES,
  PARTNER_SEND,
  PARTNER_TABLE,
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
    "Introduce a London landlord and take £275 when the property goes live, or 3% of what it earns across its first three months. You choose, per property. We do not act on sales or long tenancies, so the client stays yours.",
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
              Introduce a landlord and take £275 when the property goes live,
              or 3% of what it earns across its first three months. You choose,
              property by property. Send us a postcode and a name to call, and
              everything after that is ours to do.
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
            <p className="eyebrow">Sales and lettings</p>
            <h2 className="d5">Two kinds of property, two things we do with them</h2>
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
            <p className="eyebrow">The terms</p>
            <h2 className="d5">Paid on the listing, or paid on what it earns</h2>
          </div>

          <div className="headlines">
            {PARTNER_HEADLINES.map(({ figure, note }) => (
              <div className="headline" key={note}>
                <p className="headline__figure">{figure}</p>
                <p className="headline__note">{note}</p>
              </div>
            ))}
          </div>

          <div className="compare-scroll">
            <div className="compare compare--two">
              <div className="compare__head">Compared</div>
              {PARTNER_OPTIONS.map((option) => (
                <div
                  className="compare__head is-center"
                  key={option}
                >
                  {option}
                </div>
              ))}

              {PARTNER_TABLE.map(({ label, values }, row) => {
                const last = row === PARTNER_TABLE.length - 1 ? " is-last" : "";
                return (
                  <Fragment key={label}>
                    <div className={`compare__label${last}`}>{label}</div>
                    {values.map((value) => (
                      <div
                        className={["compare__cell", last.trim()].filter(Boolean).join(" ")}
                        key={`${label}-${value}`}
                      >
                        {value}
                      </div>
                    ))}
                  </Fragment>
                );
              })}
            </div>
          </div>

          <p className="note">
            The choice is made property by property, not once for everything
            you send. As a rule of thumb the two come level at about £3,000 a
            month: below that the flat fee pays more, above it the share does.
            The calculator below works it out on any figure you give it.
          </p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Work out one of yours</p>
            <h2 className="d5">What would a property you have pay?</h2>
          </div>
          <PartnerCalculator />
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">What the fee does not cover</p>
            <h2 className="d5">You are lending us your name</h2>
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
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Who to send</p>
            <h2 className="d5">Six you could send this week</h2>
          </div>
          <ul className="send">
            {PARTNER_SEND.map(({ title, copy }) => (
              <li key={title}>
                <p className="send__title">{title}</p>
                <p className="send__copy">{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
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

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">In writing, before you introduce anybody</p>
            <h2 className="d5">What we commit to</h2>
          </div>
          <ReferralLoop />
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

      <section className="section">
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

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Two ways to start</p>
            <h2 className="d5">Ask for the terms, or just send a property</h2>
          </div>
          <p className="note">
            Not an agent? Anyone can introduce a landlord and be paid{" "}
            {LANDLORD_REFERRAL.fee} when the property goes live.{" "}
            <Link href="/blog#refer">The terms are here</Link>.
          </p>
          <p className="body-lg">
            We are not going to show you a wall of agent logos, because we have
            not earned them yet. Test it on one property instead, which is the
            only evidence that would convince us in your position.
          </p>
          <p className="body-lg">
            For the terms in writing before you introduce anybody, call{" "}
            <a href={`tel:${CONTACT.telephoneHref}`}>{CONTACT.telephone}</a>,
            email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, or{" "}
            <Link href="/contact">send a message</Link> and pick the agent
            option. To see what one property would earn first, the form below
            comes straight to us and you will have a figure within 24 hours.
            Neither commits you to anything.
          </p>
        </div>
      </section>
    </>
  );
}
