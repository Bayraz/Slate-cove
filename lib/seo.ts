// Structured data and shared SEO constants.
//
// Everything here is derived from lib/content.ts so the markup and the schema
// can never drift apart — if the copy changes, so does what search engines and
// AI assistants read.

import { AREAS, CONTACT, FAQ, MANAGEMENT_FEES } from "./content";

export const SITE = {
  name: "Slate & Cove",
  url: "https://www.slateandcove.com",
  tagline: "Corporate & short-let management",
  description:
    "Full-service short-let and Airbnb management in London. We list, price, host and clean your property — you read one report a month.",
  locale: "en_GB",
} as const;

/** Every area from the Locations page, as a flat list of served places. */
const servedPlaces = AREAS.flatMap((area) => area.places);

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: CONTACT.addressLines[0],
  addressLocality: "London",
  postalCode: CONTACT.addressLines[1].replace("London ", ""),
  addressCountry: "GB",
};

/**
 * The business itself. `areaServed` is the important part for local search:
 * it names all ~40 places the service covers, which is what a query like
 * "Airbnb management in Chiswick" needs to match against.
 */
export const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE.url}/#organisation`,
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  email: CONTACT.email,
  telephone: CONTACT.telephone,
  address: postalAddress,
  areaServed: servedPlaces.map((place) => ({
    "@type": "Place",
    name: place,
  })),
  serviceType: "Short-let and Airbnb property management",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      name: "Full-time short-let management",
      description:
        "The property is available all year round on a minimum six-month commitment.",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: `${MANAGEMENT_FEES.fullTime} of net revenue`,
      },
    },
    {
      "@type": "Offer",
      name: "Flexible short-let management",
      description:
        "The property is available whenever you like, on a 30-day rolling contract.",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: `${MANAGEMENT_FEES.flexible} of net revenue`,
      },
    },
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  publisher: { "@id": `${SITE.url}/#organisation` },
  inLanguage: "en-GB",
};

/**
 * The eight questions from the How it works page. This is the highest-value
 * schema on the site for AI assistants: it hands them the question and the
 * answer already paired up, which is the shape they quote from.
 */
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE.url}/how-it-works/#faq`,
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(({ name, path }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${SITE.url}${path}`,
    })),
  };
}
