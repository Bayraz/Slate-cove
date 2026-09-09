import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Get a Free Rental Income Estimate",
  description:
    "Tell us about your London property and a property manager will be in touch within 24 hours with a free short-let income estimate. No obligation.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">Get started</p>
            <h1 className="d2">Contact us</h1>
          </div>
          <p className="lead">
            Fill in the form and one of our property managers will be in touch
            within 24 hours. No obligation, just a conversation about what your
            property could earn.
          </p>
          <p className="note">
            Ready to send full details, including photographs?{" "}
            <Link href="/submit-property">Use the property submission form</Link>.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap contact">
          <ContactForm />

          <aside className="contact-card">
            <div className="contact-card__title">Speak to us directly</div>
            <dl>
              <div className="contact-card__item">
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </dd>
              </div>
              <div className="contact-card__item">
                <dt>Telephone</dt>
                <dd>
                  <a href={`tel:${CONTACT.telephoneHref}`}>{CONTACT.telephone}</a>
                </dd>
              </div>
              <div className="contact-card__item">
                <dt>Office</dt>
                <dd>
                  {CONTACT.addressLines[0]}
                  <br />
                  {CONTACT.addressLines[1]}
                </dd>
              </div>
              <div className="contact-card__item">
                <dt>Hours</dt>
                <dd>
                  {CONTACT.hoursLines[0]}
                  <br />
                  {CONTACT.hoursLines[1]}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
