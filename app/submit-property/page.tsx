import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PropertySubmissionForm from "@/components/PropertySubmissionForm";
import { MANAGEMENT_FEES } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Submit Your Property for Short-Let Management",
  description:
    "Send us your property details and we will come back with a free income estimate within 24 hours. No lock-in contracts, and no obligation.",
  path: "/submit-property",
});

/* Small line icons, matching the set used elsewhere on the site. */
const Ico = ({ d }: { d: string[] }) => (
  <svg
    className="perk__ico"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
  </svg>
);

const PERKS = [
  {
    label: "A free income estimate for your property",
    d: ["M3.5 16.5 9 11l3.5 3.5L20.5 6", "M15.5 6h5v5"],
  },
  {
    label: `No lock-in contracts, cancel any time`,
    d: ["M9 12.5 11 14.5 15.5 10", "M12 3.5 20 7v5.5c0 4.2-3.2 7.3-8 8.5-4.8-1.2-8-4.3-8-8.5V7Z"],
  },
  {
    label: "Onboarding in as little as 7 days",
    d: ["M12 7v5.3l3.4 2", "M20.5 12a8.5 8.5 0 1 1-8.5-8.5"],
  },
  {
    label: "A dedicated local property manager",
    d: ["M12 4.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Z", "M5.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2"],
  },
] as const;

export default function SubmitPropertyPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Submit your property", path: "/submit-property" },
        ])}
      />

      <section className="section">
        <div className="wrap submit">
          <div className="submit__intro">
            <p className="eyebrow">Get started</p>
            <h1 className="d2">Property submission form</h1>
            <p className="lead">
              Fill in the form and one of our property managers will be in touch
              within 24 hours. No obligation, just a conversation about what
              your property could earn.
            </p>

            <ul className="perks">
              {PERKS.map((perk) => (
                <li className="perk" key={perk.label}>
                  <Ico d={[...perk.d]} />
                  <span>{perk.label}</span>
                </li>
              ))}
            </ul>

            {/* An illustration of what managed booking activity looks like, not
                a record of real bookings: no guest names and no figures. */}
            <div className="phone" aria-hidden="true">
              <div className="phone__screen">
                <div className="phone__notch" />
                <div className="notice">
                  <span className="notice__mark">A</span>
                  <div className="notice__body">
                    <span className="notice__title">Airbnb</span>
                    <span className="notice__line">New booking confirmed</span>
                    <span className="notice__meta">Four nights</span>
                  </div>
                </div>
                <div className="notice">
                  <span className="notice__mark notice__mark--b">B.</span>
                  <div className="notice__body">
                    <span className="notice__title">Booking.com</span>
                    <span className="notice__line">New booking confirmed</span>
                    <span className="notice__meta">Two nights</span>
                  </div>
                </div>
                <p className="phone__caption">Illustration</p>
              </div>
            </div>
          </div>

          <div className="submit__form">
            <PropertySubmissionForm />
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">What happens next</p>
            <h2 className="d5">After you send it</h2>
          </div>
          <ol className="afterlist">
            <li>
              <span className="afterlist__num">01</span>
              <p className="body-lg">
                We look at comparable properties nearby and what they actually
                achieve, then come back with a realistic figure. Not a best case.
              </p>
            </li>
            <li>
              <span className="afterlist__num">02</span>
              <p className="body-lg">
                If it makes sense for you, we visit the property, agree the plan
                and handle photography and the listing.
              </p>
            </li>
            <li>
              <span className="afterlist__num">03</span>
              <p className="body-lg">
                You hand over the keys. Our fee is {MANAGEMENT_FEES.fullTime} of
                net revenue on the full-time plan, so we only earn when you do.
              </p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
