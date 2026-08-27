import { Fragment } from "react";
import Link from "next/link";
import Slot from "@/components/Slot";
import { HERO_IMAGE } from "@/lib/images";
import {
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  HOME_CTA_POINTS,
  SERVICES,
  STATS,
  TESTIMONIALS,
} from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="section">
        <div className="wrap hero">
          <div className="hero__body">
            <p className="eyebrow">Short-let &amp; Airbnb management — London</p>
            <h1 className="d1">Your London property, run properly</h1>
            <p className="lead-lg">
              We list it, price it, host it and clean it. You hand over the keys
              and read one report a month.
            </p>
            <div className="hero__actions">
              <Link className="btn btn--solid" href="/contact">
                Get a free estimate
              </Link>
              <Link className="btn btn--outline" href="/how-it-works">
                See how it works
              </Link>
            </div>
            <div className="stats">
              {STATS.map(({ figure, label }) => (
                <div className="stat" key={label}>
                  <span className="stat__figure">{figure}</span>
                  <span className="stat__label">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <Slot image={HERO_IMAGE} className="hero__slot" priority />
        </div>
      </section>

      <section className="section">
        <div className="wrap railed">
          <p className="eyebrow">What we do</p>
          <div className="railed__body">
            <h2 className="d5 d5--tight">
              A short-let managed end to end, by one team
            </h2>
            <p className="body-lg">
              We create and optimise the listing, set prices daily against local
              demand, vet and message guests around the clock, clean and restock
              between every stay, coordinate maintenance, and track short-let
              compliance including the 90-night rule. Landlords typically earn
              30–40% more than a standard long-term tenancy, with no day-to-day
              involvement and a clear income report every month.
            </p>
            <p className="body-lg">
              We manage across Central and West London and the Home Counties —
              Kensington, Chelsea, Notting Hill, Chiswick, Ealing and Canary
              Wharf, as well as Windsor, Reading, Watford and Slough. One flat or
              a small portfolio, the arrangement is the same.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack">
          <div className="split-head">
            <div className="split-head__title">
              <p className="eyebrow">Full-service management</p>
              <h2 className="d5">What we handle</h2>
            </div>
            <p className="body-md split-head__note">
              Eight standing responsibilities, all of them ours for the length of
              the agreement.
            </p>
          </div>
          <div className="services">
            {SERVICES.map(({ title, copy }) => (
              <div className="service" key={title}>
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
            <p className="eyebrow">The comparison</p>
            <h2 className="d5">Compare what&rsquo;s included</h2>
          </div>
          <div className="compare-scroll">
            <div className="compare">
              <div className="compare__head">Included</div>
              {COMPARISON_COLUMNS.map((column, i) => (
                <div
                  className={`compare__head is-center${i === 0 ? " is-mark" : ""}`}
                  key={column}
                >
                  {column}
                </div>
              ))}

              {COMPARISON_ROWS.map(({ label, values }, row) => {
                const last = row === COMPARISON_ROWS.length - 1 ? " is-last" : "";
                return (
                  <Fragment key={label}>
                    <div className={`compare__label${last}`}>{label}</div>
                    {values.map((value, i) => (
                      <div
                        className={[
                          "compare__cell",
                          i === 0 ? "is-mark" : "",
                          value === "No" ? "is-off" : "",
                          last.trim(),
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={`${label}-${i}`}
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
            Listed on Airbnb, Booking.com, Vrbo, Expedia and Blueground.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Testimonials</p>
            <h2 className="d5">What landlords say</h2>
          </div>
          <div className="quotes">
            {TESTIMONIALS.map(({ quote, name, role }) => (
              <figure className="quote" key={name}>
                <p>{quote}</p>
                <figcaption>
                  <span>{name}</span>
                  <span>{role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap cta-split">
          <div className="cta-split__body">
            <div className="rule" />
            <h2 className="d3">Find out what your property earns</h2>
            <p className="body-lg on-dark">
              Send us the address and we will come back with a free income
              estimate. No obligation, no lock-in contract.
            </p>
          </div>
          <div className="cta-split__aside">
            <Link className="btn btn--light" href="/contact">
              Get a free estimate
            </Link>
            <div className="cta-points">
              {HOME_CTA_POINTS.map((point) => (
                <span key={point}>{point}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
