import Link from "next/link";
import { CONTACT } from "@/lib/content";

/**
 * A fixed call/enquire bar on phones.
 *
 * Most landlords arrive on a phone, and the enquiry form is several screens
 * down from wherever they land. This keeps both ways of getting in touch one
 * thumb-press away on every page. Hidden above the mobile breakpoint, where
 * the header CTA is already visible.
 */
export default function MobileContactBar() {
  return (
    <div className="contact-bar">
      <a className="contact-bar__call" href={`tel:${CONTACT.telephoneHref}`}>
        Call us
      </a>
      <Link className="contact-bar__cta" href="/contact">
        Free estimate
      </Link>
    </div>
  );
}
