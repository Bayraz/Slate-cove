import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { AREA_BY_SLUG, AREA_PAGES, nearbyAreas } from "@/lib/areas";
import { MANAGEMENT_FEES, SERVICES } from "@/lib/content";
import { SITE, areaServiceSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ area: string }> };

export function generateStaticParams() {
  return AREA_PAGES.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area: slug } = await params;
  const area = AREA_BY_SLUG.get(slug);
  if (!area) return {};
  return pageMetadata({
    title: `Airbnb & Short-Let Management in ${area.name}`,
    description: `Full-service Airbnb and short-let management in ${area.name}. We list, price, host and clean your property. ${MANAGEMENT_FEES.fullTime} of net revenue, no lock-in, one report a month.`,
    path: `/locations/${area.slug}`,
  });
}

export default async function AreaPage({ params }: Props) {
  const { area: slug } = await params;
  const area = AREA_BY_SLUG.get(slug);
  if (!area) notFound();

  const nearby = nearbyAreas(area);

  return (
    <>
      <JsonLd schema={areaServiceSchema(area.name, `/locations/${area.slug}`)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: area.name, path: `/locations/${area.slug}` },
        ])}
      />

      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">{area.group}</p>
            <h1 className="d2">Short-let management in {area.name}</h1>
          </div>
          <p className="lead">{area.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap railed">
          <p className="eyebrow">The property</p>
          <div className="railed__body">
            <h2 className="d5 d5--tight">What we manage in {area.name}</h2>
            <p className="body-lg">{area.stock}</p>
            <h2 className="d5 d5--tight">Who stays in {area.name}</h2>
            <p className="body-lg">{area.guests}</p>
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
              Everything below is ours for the length of the agreement, in{" "}
              {area.name} as everywhere else we manage.
            </p>
          </div>
          <div className="services">
            {SERVICES.map(({ title, copy, icon }) => (
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
            <p className="eyebrow">Nearby</p>
            <h2 className="d5">We also manage close to {area.name}</h2>
          </div>
          <div className="area__list">
            {nearby.map((a) => (
              <Link key={a.slug} href={`/locations/${a.slug}`}>
                {a.name}
              </Link>
            ))}
          </div>
          <p className="note">
            <Link href="/locations">See every area we cover</Link>
          </p>
        </div>
      </section>

    </>
  );
}
