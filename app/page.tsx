import { Fragment } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import Explainer from "@/components/Explainer";
import HeroSlideshow from "@/components/HeroSlideshow";
import { FOOTER_AREAS } from "@/lib/areas";
import { SERVICE_PAGES } from "@/lib/services";
import { HERO_IMAGES } from "@/lib/images";
import {
  REFERRAL,
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  STATS,
} from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="section">
        <div className="wrap hero">
          <div className="hero__body">
            <p className="eyebrow">
              Short-let &amp; Airbnb management in London
            </p>
            {/* Two lines, because the break is the point: the property is
                yours, the work is ours. */}
            <h1 className="d1">
              Your property.
              <br />
              Properly managed.
            </h1>
            <p className="lead-lg">
              End-to-end short-let management across London and the Home
              Counties. We handle the listing, pricing, guests, cleaning,
              maintenance and reporting. You do not have to.
            </p>
            {/* All four in one grid: two rows of two, every box the same
                width and the same height. The solid one stays the only filled
                one, which is what carries the order of importance now that
                they are all the same size. */}
            <div className="hero__cta">
              <Link className="btn btn--solid" href="/submit-property">
                Get a free income estimate
              </Link>
              <Link className="btn btn--outline" href="/how-it-works">
                See how it works
              </Link>

              <p className="hero__refer-label">Introduce a landlord</p>
              <Link className="btn btn--outline hero__cta-wide" href="/partners">
                Refer a property, take {REFERRAL.fee}
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
          <HeroSlideshow images={HERO_IMAGES} />
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">The short version</p>
            <h2 className="d5">How this works for you</h2>
          </div>
          <Explainer />
        </div>
      </section>

      <section className="section">
        <div className="wrap stack">
          <div className="section-head">
            <p className="eyebrow">What we handle</p>
            <h2 className="d5">A short let managed end to end, by one team</h2>
          </div>

          {/* The strongest claim on the page, given its own line rather than
              buried in a paragraph. */}
          <p className="pullout">
            Landlords typically earn{" "}
            <strong>30&ndash;40% more than a standard long-term tenancy</strong>,
            with no day-to-day involvement.
          </p>

          <ul className="svclist svclist--hub">
            {SERVICE_PAGES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}/`}>
                  <Icon className="svclist__icon" d={s.icon} />
                  <span className="svclist__name">{s.name}</span>
                  <span className="svclist__sum">{s.summary}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="coverage-note">
            <p className="note">Where we manage</p>
            <ul className="chips">
              {FOOTER_AREAS.map((area) => (
                <li key={area.slug}>
                  <Link href={`/locations/${area.slug}/`}>{area.name}</Link>
                </li>
              ))}
              <li>
                <Link className="chips__all" href="/locations/">
                  All 38 areas
                </Link>
              </li>
            </ul>
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

      {/* The referral offer. One figure, one audience, one link. */}
      <section className="section section--dark">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow eyebrow--light">Referral programme</p>
            <h2 className="d5">Know a landlord who needs a better option?</h2>
          </div>
          <div className="fee">
            <p className="fee__figure">{REFERRAL.fee}</p>
            <div className="fee__body">
              <p className="fee__line">
                Introduce a property owner to us and take {REFERRAL.fee} when
                the property goes live. Estate agents and anybody else, on the
                same terms.
              </p>
              <Link className="earn__link" href="/partners">
                How referrals work
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
