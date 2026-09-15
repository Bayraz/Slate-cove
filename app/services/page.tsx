import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { MANAGEMENT_FEES } from "@/lib/content";
import { SERVICE_PAGES } from "@/lib/services";
import {
  breadcrumbSchema,
  pageMetadata,
  serviceCatalogueSchema,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "What an Airbnb Management Company Actually Does",
  description:
    "The eight things Slate & Cove handles on a London short let: the listing, photography, pricing, guests, cleaning, maintenance, reviews and reporting. What each one is, and why it changes what a property earns.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd schema={serviceCatalogueSchema(SERVICE_PAGES)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">Our services</p>
            <h1 className="d2">What we actually do</h1>
          </div>
          <div className="page-head__body">
            <p className="lead">
              Eight standing responsibilities, all of them ours for the length
              of the agreement. Each one has a page explaining what it is, why
              it changes what a property earns, and how we handle it.
            </p>
            <p className="note">
              All of it is covered by one management fee:{" "}
              {MANAGEMENT_FEES.fullTime} of net revenue on the full-time plan
              and {MANAGEMENT_FEES.flexible} on the flexible one. There are no
              setup costs and no per-service charges.{" "}
              <Link href="/pricing">See what the fee covers</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
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
        </div>
      </section>
    </>
  );
}
