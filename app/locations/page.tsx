import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Slot from "@/components/Slot";
import { LOCATIONS_IMAGE } from "@/lib/images";
import { AREA_PAGES } from "@/lib/areas";

export const metadata: Metadata = pageMetadata({
  title: "Areas We Cover — London & the Home Counties",
  description:
    "Short-let management across Kensington, Chelsea, Notting Hill, Chiswick, Ealing, Canary Wharf and the Home Counties including Windsor, Reading, Watford and Slough.",
  path: "/locations",
});

export default function LocationsPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ])}
      />
      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">Coverage</p>
            <h1 className="d2">Where we manage</h1>
          </div>
          <p className="lead">
            Central and West London, Greater London and the Home Counties. Each
            area has a named manager who knows the local demand and the local
            trades.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {[...new Set(AREA_PAGES.map((a) => a.group))].map((group) => (
            <div className="area" key={group}>
              <h2>{group}</h2>
              <ul className="area__list">
                {AREA_PAGES.filter((a) => a.group === group).map((area) => (
                  <li key={area.slug}>
                    <Link href={`/locations/${area.slug}`}>{area.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap coverage">
          <div className="coverage__body">
            <h2 className="d7">Not on the list? Ask anyway.</h2>
            <p>
              We take on properties outside these areas where the numbers work
              and we can staff the turnaround reliably. Tell us the address and
              we will say plainly whether we can cover it.
            </p>
            <Link className="btn btn--solid" href="/contact">
              Check your area
            </Link>
          </div>
          <Slot image={LOCATIONS_IMAGE} className="coverage__slot" />
        </div>
      </section>
    </>
  );
}
