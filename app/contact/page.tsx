import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your property and a property manager will be in touch within 24 hours with a free income estimate.",
};

export default function ContactPage() {
  return (
    <>
      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">Get started</p>
            <h1 className="d2">Contact us</h1>
          </div>
          <p className="lead">
            Fill in the form and one of our property managers will be in touch
            within 24 hours. No obligation — just a conversation about what your
            property could earn.
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
