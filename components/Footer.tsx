import Link from "next/link";
import { CONTACT, FOOTER_SERVICES, NAV } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__top">
        <div className="footer__brand">
          <div className="footer__mark">
            <span className="brand__name">Slate &amp; Cove</span>
            <span className="brand__tag">Corporate &amp; short-let management</span>
          </div>
          <p>
            Professional short-let management that gets the most out of your
            property, without the day-to-day.
          </p>
        </div>

        <div>
          <div className="footer__heading">Pages</div>
          <ul className="footer__col">
            {NAV.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer__heading">Services</div>
          <ul className="footer__col">
            {FOOTER_SERVICES.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="footer__heading">Contact</div>
          <ul className="footer__col">
            <li>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <a href={`tel:${CONTACT.telephoneHref}`}>{CONTACT.telephone}</a>
            </li>
            <li>
              {CONTACT.addressLines[0]}
              <br />
              {CONTACT.addressLines[1]}
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap footer__bottom">
        <div>
          <span>&copy; 2026 Slate &amp; Cove</span>
          <span>Registered in England &amp; Wales</span>
        </div>
      </div>
    </footer>
  );
}
