import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  title: {
    default: "Slate & Cove — Short-let & Airbnb management in London",
    template: "%s — Slate & Cove",
  },
  description:
    "Full-service short-let and Airbnb management in London. We list, price, host and clean your property — you read one report a month.",
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
