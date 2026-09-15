import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { TICK } from "@/lib/content";
import { SERVICE_BY_SLUG, SERVICE_PAGES } from "@/lib/services";
import {
  breadcrumbSchema,
  faqSchemaFor,
  pageMetadata,
  serviceSchema,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_BY_SLUG.get(slug);
  if (!service) return {};
  return pageMetadata({
    title: `${service.name} for London Short Lets`,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICE_BY_SLUG.get(slug);
  if (!service) notFound();

  const others = SERVICE_PAGES.filter((s) => s.slug !== service.slug);
  const path = `/services/${service.slug}`;

  return (
    <>
      <JsonLd
        schema={serviceSchema({
          name: `${service.name} for London short lets`,
          description: service.description,
          path,
        })}
      />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "How it works", path: "/how-it-works" },
          { name: service.name, path },
        ])}
      />
      <JsonLd schema={faqSchemaFor(path, service.faq)} />

      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">Our services</p>
            <h1 className="d2">{service.name}</h1>
          </div>
          {/* The answer before any heading, so a reader who stops here has it,
              and so an assistant quoting the page quotes something complete. */}
          <p className="lead">{service.opening}</p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap svc">
          <div className="svc__block">
            <h2 className="svc__h">What it is</h2>
            <p className="body-lg">{service.what}</p>
          </div>
          <div className="svc__block">
            <h2 className="svc__h">Why it matters</h2>
            <p className="body-lg">{service.why}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">In practice</p>
            <h2 className="d5">How we handle it</h2>
          </div>
          <ol className="howlist">
            {service.how.map((line, i) => (
              <li key={line}>
                <span className="howlist__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">What you end up with</p>
            <h2 className="d5">What the owner gets</h2>
          </div>
          <ul className="terms">
            {service.gets.map((line) => (
              <li key={line}>
                <Icon className="tick" d={TICK} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2 className="d5">Questions owners ask about {service.name.toLowerCase()}</h2>
          </div>
          <div className="faq">
            {service.faq.map(({ q, a }) => (
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
            <p className="eyebrow">The rest of it</p>
            <h2 className="d5">Everything else we handle</h2>
          </div>
          <ul className="svclist">
            {others.map((s) => (
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
