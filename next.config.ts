import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is entirely static — no server rendering per request, no API
  // routes. Exporting means it can be hosted from any static bucket or CDN.
  // Remove this if a server-side feature is added later (the contact form
  // endpoint being the likely first one).
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
