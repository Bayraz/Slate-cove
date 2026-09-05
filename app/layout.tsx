import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Jost } from "next/font/google";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Footer from "@/components/Footer";
import { SITE, organisationSchema, websiteSchema } from "@/lib/seo";
import "./globals.css";

// Self-hosted at build time, so the rendered page makes no request to a font
// CDN and there is no flash of fallback type.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-jost",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  // Makes every relative URL below resolve absolutely, which canonical tags
  // and social cards both require.
  metadataBase: new URL(SITE.url),
  title: {
    default: "Airbnb & Short-Let Management in London | Slate & Cove",
    template: "%s | Slate & Cove",
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: SITE.url,
    title: "Airbnb & Short-Let Management in London | Slate & Cove",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Airbnb & Short-Let Management in London | Slate & Cove",
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "Property management",
  // Google Search Console ownership. Verified via meta tag rather than the
  // HTML file, which 404s: `trailingSlash: true` makes Vercel redirect
  // /google….html to /google….html/, which does not exist.
  verification: {
    google: "zmRfvit05tUfzX-lVOOvO2MCxBNade5yLDeSCrWl0XE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${instrumentSerif.variable} ${jost.variable} ${plexMono.variable}`}
    >
      <body>
        <JsonLd schema={organisationSchema} />
        <JsonLd schema={websiteSchema} />
        <div className="page">
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          <main className="main" id="main">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
