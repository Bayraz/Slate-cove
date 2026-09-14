import { Fragment } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import Explainer from "@/components/Explainer";
import HeroSlideshow from "@/components/HeroSlideshow";
import { FOOTER_AREAS } from "@/lib/areas";
import { HERO_IMAGES } from "@/lib/images";
import {
  LANDLORD_REFERRAL,
  PARTNER,
  COMPARISON_COLUMNS,
  COMPARISON_ROWS,
  SERVICES,
  STATS,
} from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <section className="section">
        <div className="wrap hero">
          <div className="hero__body">
            <p className="eyebrow">Short-let &amp; Airbnb management in London</p>
            <h1 className="d1">Your property, managed properly</h1>
            <p className="lead-lg">
              We list it, price it, host it and clean it. You hand over the keys
              and read one report a month.
            </p>
            {/* All four in one grid: two rows of two, every box the same
                width and the same height. The solid one stays the only filled
                one, which is what carries the order of importance now that
                they are all the same size. */}
            <div className="hero__cta">
              <Link className="btn btn--solid" href="/submit-property">
                Get a free estimate
              </Link>
              <Link className="btn btn--outline" href="/how-it-works">
                See how it works
              </Link>

              <p className="hero__refer-label">Introduce a landlord and earn</p>

              <Link className="btn btn--outline" href="/partners">
                Agents, £{PARTNER.flatFee} or 3%
              </Link>
              <Link className="btn btn--outline" href="/blog#refer">
                Anyone else, {LANDLORD_REFERRAL.fee}
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

          <div className="services">
            {SERVICES.map(({ title, copy, icon }) => (
              <div className="service" key={title}>
                <Icon className="service__icon" d={icon} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>

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

      {/* The partner and referral offers, given the weight the business puts
          on them. The one dark ground on the page, low enough that it never
          stands between a landlord and the form. */}
      <section className="section section--dark">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow eyebrow--light">Work with us</p>
            <h2 className="d5">Two ways to earn from a property that is not yours</h2>
          </div>
          <div className="earn">
            <div className="earn__col">
              <p className="earn__who">Estate and letting agents</p>
              <p className="earn__figure">£{PARTNER.flatFee} or 3%</p>
              <p className="earn__copy">
                Introduce a landlord and take £{PARTNER.flatFee} when the
                property goes live, or 3% of what it earns for three months.
                Your choice, property by property. We do not act on sales or
                tenancies, so the client stays yours.
              </p>
              <Link className="earn__link" href="/partners">
                See the partner terms
              </Link>
            </div>
            <div className="earn__col">
              <p className="earn__who">Anyone at all</p>
              <p className="earn__figure">{LANDLORD_REFERRAL.fee}</p>
              <p className="earn__copy">
                Know a London landlord? Introduce them and take{" "}
                {LANDLORD_REFERRAL.fee} once their property is live and
                earning. You do not have to be a landlord or a client, and
                there is no cap.
              </p>
              <Link className="earn__link" href="/blog#refer">
                How referrals work
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
