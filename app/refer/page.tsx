import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ReferralForm from "@/components/ReferralForm";
import { CONTACT, REFERRAL, TICK, WHO_CAN_REFER } from "@/lib/content";
import { breadcrumbSchema, faqSchemaFor, pageMetadata } from "@/lib/seo";

/**
 * The independent referral page.
 *
 * Short on purpose. An estate agent is making a commercial decision and wants
 * the detail; somebody who knows one landlord wants to know what they get,
 * what they have to do, and that it is not a scheme they are joining. Anything
 * past that is a reason to close the tab.
 */
const FAQ = [
  {
    q: "Do I have to be in property?",
    a: "No. Most people who refer are not. If you know somebody who owns a property in London or the Home Counties and is not getting much out of it, that is the whole qualification.",
  },
  {
    q: "What do I have to do?",
    a: "Send us the property and a name and number for the owner. That is the end of your involvement. We contact them, we assess the property, and we tell you what happened.",
  },
  {
    q: "When am I paid?",
    a: `${REFERRAL.fee} ${REFERRAL.window} of the property going live and earning with us. Not at introduction, and not at the end of a year.`,
  },
  {
    q: "Does the owner pay more because I referred them?",
    a: "No. They pay the same management fee as anybody else, 15% of net revenue on the full-time plan or 18% on the flexible one. Your fee comes out of our side.",
  },
  {
    q: "What if it does not go ahead?",
    a: "Nothing is owed and nobody is out of pocket. If a short let is wrong for the property we will say so, to you and to them.",
  },
  {
    q: "Can I refer more than one?",
    a: "Yes, and there is no cap. Each property that goes live is its own payment.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Know a Landlord? Refer a Property and Receive £275",
  description:
    "You do not need to be an estate agent. Introduce a London property owner to Slate & Cove and receive £275 when the property goes live. No cap, nothing to sign, and nothing owed if it does not go ahead.",
  path: "/refer",
});

export default function ReferPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Refer a property", path: "/refer" },
        ])}
      />
      <JsonLd schema={faqSchemaFor("/refer", FAQ)} />

      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">Independent referrals</p>
            <h1 className="d2">Know a landlord? That is worth {REFERRAL.fee}</h1>
          </div>
          <div className="page-head__body">
            <p className="lead">
              You do not need to be an estate agent. Introduce a property owner
              to us and we pay you {REFERRAL.fee} when their property goes live
              and starts earning.
            </p>
            <p className="note">
              Nothing to sign, no cap on how many, and nothing owed if it does
              not go ahead.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap fee">
          <p className="fee__figure">{REFERRAL.fee}</p>
          <div className="fee__body">
            <p className="fee__line">
              For every property that goes live with us. One flat fee, whatever
              the property earns.
            </p>
            <p className="fee__sub">
              Paid {REFERRAL.window} of the property going live, on our normal
              payout cycle.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Who refers</p>
            <h2 className="d5">People who happen to know a property owner</h2>
          </div>
          <ul className="terms">
            {WHO_CAN_REFER.map((line) => (
              <li key={line}>
                <Icon className="tick" d={TICK} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="note">
            Work in estate agency or lettings?{" "}
            <Link href="/partners">
              You have a choice of terms
            </Link>
            : the flat fee, or a share of what the property earns.
          </p>
        </div>
      </section>

      <section className="section section--alt" id="refer">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Send it over</p>
            <h2 className="d5">The property and the owner, and that is it</h2>
          </div>
          <p className="lead">
            We contact the owner, usually the same day, and tell them the
            introduction came from you. You hear back either way.
          </p>
          <ReferralForm />
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2 className="d5">The short answers</h2>
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
          <p className="note">
            Rather ask a person? Call{" "}
            <a href={`tel:${CONTACT.telephoneHref}`}>{CONTACT.telephone}</a> or
            email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
