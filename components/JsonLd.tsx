/**
 * Emits a JSON-LD block. Search engines and AI crawlers read this; it renders
 * nothing. Content comes from lib/seo.ts, which is built from our own copy —
 * never from user input — so serialising it directly is safe.
 */
export default function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
