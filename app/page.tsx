import { Fragment } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import HeroSlideshow from "@/components/HeroSlideshow";
import JsonLd from "@/components/JsonLd";
import { FOOTER_AREAS } from "@/lib/areas";
import { HERO_IMAGES } from "@/lib/images";
import { SERVICE_BY_SLUG } from "@/lib/services";
import {
  ASSURANCES,
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  HOME_FAQ,
  HOW_IT_WORKS,
  OWNERS,
  REFERRAL,
  SERVICE_GROUPS,
  THE_WORK,
  UPLIFT,
} from "@/lib/content";
import { faqSchemaFor } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd schema={faqSchemaFor("/", HOME_FAQ)} />

      {/* 1. Hero ------------------------------------------------------- */}
      <section className="section">
        <div className="wrap hero">
          <div className="hero__body">
            <p className="eyebrow">
              Short-let &amp; Airbnb management in London
            </p>
            <h1 className="d1">Your property, managed properly</h1>
            <p className="lead-lg">
              We manage London short lets end to end: the listing, the pricing,
              the guests, the cleaning, the maintenance and the reporting. You
              keep the property and the income, and none of the work.
            </p>

            <div className="hero__cta hero__cta--pair">
              <Link className="btn btn--solid" href="/submit-property">
                Get a free property estimate
              </Link>
              <Link className="btn btn--outline" href="/how-it-works">
                How it works
              </Link>
            </div>

            {/* The referral route, deliberately one quiet line. It is for a
                different reader and must not compete with the estimate. */}
            <p className="hero__aside">
              Not a landlord?{" "}
              <Link href="/partners">
                Introduce one and take {REFERRAL.fee}
              </Link>
              .
            </p>
          </div>
          <HeroSlideshow images={HERO_IMAGES} />
        </div>
      </section>

      {/* 2. Reassurance. Facts about the service, not predictions. ------ */}
      <section className="section section--tight">
        <div className="wrap assure">
          {ASSURANCES.map(({ figure, label }) => (
            <div className="assure__item" key={label}>
              <span className="assure__figure">{figure}</span>
              <span className="assure__label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The problem, stated plainly. The interactive explainer that used
             to sit here now lives on the how-it-works page: it covered the
             problem, the process, the services and the comparison, which are
             four of the sections below, and saying all of it twice is what
             made this page long. ------------------------------------------ */}
      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">The problem</p>
            <h2 className="d5">
              Short lets pay well. Running one is a different job.
            </h2>
          </div>
          <p className="lead">
            A short let is a small hospitality business attached to a flat. It
            is not difficult work, but it is constant, and almost none of it
            can wait until the weekend.
          </p>
          <ul className="work">
            {THE_WORK.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Who it is for. --------------------------------------------- */}
      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Who we work with</p>
            <h2 className="d5">Owners who would rather not run it themselves</h2>
          </div>
          <ul className="owners">
            {OWNERS.map(({ who, copy }) => (
              <li key={who}>
                <p className="owners__who">{who}</p>
                <p className="owners__copy">{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. What we handle, in four groups rather than eight cards. ----- */}
      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">What we handle</p>
            <h2 className="d5">A short let managed end to end, by one team</h2>
          </div>
          <div className="groups">
            {SERVICE_GROUPS.map(({ group, copy, items }) => (
              <div className="group" key={group}>
                <h3 className="group__name">{group}</h3>
                <p className="group__copy">{copy}</p>
                <ul className="group__list">
                  {items.map((slug) => {
                    const service = SERVICE_BY_SLUG.get(slug);
                    if (!service) return null;
                    return (
                      <li key={slug}>
                        <Link href={`/services/${slug}/`}>{service.name}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="note">
            <Link href="/services">
              Every one of these explained in full
            </Link>
            , including what it changes about what a property earns.
          </p>
        </div>
      </section>

      {/* 6. How it works. ---------------------------------------------- */}
      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">How it works</p>
            <h2 className="d5">You hand over the keys. We take it from there.</h2>
          </div>
          <div className="steps">
            {HOW_IT_WORKS.map(({ num, title, copy }) => (
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

      {/* 7. The financial proposition, and the estimate.

             The range is the reason most landlords look at this at all, so it
             is stated at size. It sits here rather than in the hero, where it
             would compete with the brand line, and the qualifier is set
             directly underneath it rather than in small print somewhere else
             on the page: it is potential, not a result, and the two sentences
             have to be read together. --------------------------------------- */}
      <section className="section section--dark">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow eyebrow--light">Property potential</p>
            <h2 className="d5">What could your property earn?</h2>
          </div>
          <div className="uplift">
            <p className="uplift__figure">{UPLIFT.range}</p>
            <div className="uplift__body">
              <p className="uplift__line">{UPLIFT.headline}</p>
              <p className="uplift__sub">{UPLIFT.qualifier}</p>
            </div>
          </div>
          <Link className="btn btn--light" href="/submit-property">
            Get a free property estimate
          </Link>
        </div>
      </section>

      {/* 8. The comparison. -------------------------------------------- */}
      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">The comparison</p>
            <h2 className="d5">Which model suits your property</h2>
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

      {/* 9. Where we manage. ------------------------------------------- */}
      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">Where we manage</p>
            <h2 className="d5">Across London and the Home Counties</h2>
          </div>
          <ul className="chips">
            {FOOTER_AREAS.map((area) => (
              <li key={area.slug}>
                <Link href={`/locations/${area.slug}/`}>{area.name}</Link>
              </li>
            ))}
            <li>
              <Link className="chips__all" href="/locations/">
                View all areas
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* 10. FAQ and the final call to action. -------------------------- */}
      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2 className="d5">What landlords ask us first</h2>
          </div>
          <div className="faq">
            {HOME_FAQ.map(({ q, a }) => (
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
            <Link href="/how-it-works">More questions answered</Link>, including
            guest screening, damage and what the fee covers.
          </p>
        </div>
      </section>
    </>
  );
}
