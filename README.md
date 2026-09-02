# Slate & Cove — website

Next.js implementation of the Claude Design prototype
`Slate and Cove Website.dc.html` (project *Brochure redesign guidelines*).

## Stack

Next.js 15 (App Router) with React 19 and TypeScript. The site is entirely
static, so `next.config.ts` sets `output: "export"` — `npm run build` emits a
plain `out/` directory that can be hosted from any static bucket or CDN, with
no Node server at runtime.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to out/
npm run typecheck
```

```
app/
├── layout.tsx           Fonts, metadata, header/footer shell
├── globals.css          All styling; design tokens at the top
├── page.tsx             Home
├── how-it-works/
├── pricing/
├── locations/
└── contact/
components/
├── Header.tsx           Client — nav state, active-route marking
├── Footer.tsx
├── ContactForm.tsx      Client — form state
└── Slot.tsx             Photographic frame
lib/
├── content.ts           All site copy
└── images.ts            Unsplash photo references
```

## How it maps to the prototype

The prototype is one document that swaps between five views with a `page`
state variable (`<sc-if>` blocks). Each view is a route here, so every section
has a real URL. `Header` marks the active route with `aria-current="page"`,
which drives the blue underline the prototype rendered with an opacity binding.

Every colour, font, size and spacing value comes from the prototype, declared
once as custom properties in `globals.css`:

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#3A3A38` | body text, 2px rules, dark panels |
| `--ink-deep` | `#24241F` | hover state, footer ground |
| `--paper` | `#F6F4F1` | page ground |
| `--paper-alt` | `#EAE7E2` | alternate sections, text on dark |
| `--muted` | `#6B6660` | secondary text |
| `--faint` | `#A9A29A` | de-emphasised table values |
| `--blue` | `#B9C6CE` | hairlines, accents, step numerals |

Type is Instrument Serif (display), Jost (body) and IBM Plex Mono (labels),
loaded through `next/font/google`. That self-hosts them at build time, so the
rendered pages make no request to a font CDN and there is no flash of fallback
type.

Repeated content — the eight services, comparison rows, FAQ, coverage areas,
plan features — lives in `lib/content.ts` and is mapped over, rather than
repeated as markup.

## Decisions made beyond the prototype

The prototype is a single fixed-width desktop canvas. These are the things a
production site needs that it did not specify:

- **Responsive behaviour.** The design is preserved exactly at ≥1280px. Below
  that, breakpoints at 1200 / 900 / 640px reflow the multi-column grids, and
  display type scales with `clamp()` where the design's size is the maximum.
- **Small-screen navigation.** Below 900px the five links collapse behind a
  Menu toggle, which closes on navigation and on growing past the breakpoint.
- **The comparison table** keeps its exact `1.4fr 200px 200px 200px` grid and
  scrolls horizontally inside its own container below ~860px, rather than
  being restructured into cards.
- **Semantics and accessibility.** Real `<form>` labels, `<figure>` for the
  testimonials, `<dl>` for the contact details, a skip link, visible focus
  outlines. Content is unchanged.

## Photography

The design's two `<image-slot>` elements carried art direction but no saved
image. `lib/images.ts` points them at the chosen Unsplash photographs:

| Slot | Direction from the design | Photo |
| --- | --- | --- |
| Home hero | *Hero interior — black and white, natural light, straight verticals* | A-frame living room, angled windows |
| Locations | *Coverage map or London exterior — black and white* | Stone cottage in a formal rose garden |

Both render through `Slot.tsx`, which applies the `grayscale(1)` filter the
design's black-and-white direction calls for, so a colour source needs no
editing first.

**Before launch, download these into `public/` and serve them locally.**
Hotlinking Unsplash puts a third party in the critical render path. Swapping
`src` for a local path is the only change needed.

The sources are requested at `w=1170`, which is comfortable for the locations
frame and adequate — but not retina-sharp — for the full-bleed hero on a wide
display. Raise the `w` parameter if that matters.

## SEO

Everything below is generated from `lib/content.ts`, so the copy and what
crawlers read can't drift apart.

- **Metadata.** `metadataBase` plus per-page canonicals, Open Graph and Twitter
  cards. Titles are keyword-led (`Airbnb Management Fees — 15% Full-time, 18%
  Flexible`) rather than bare labels.
- **`app/robots.ts`** allows everything, and names the AI crawlers explicitly —
  GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot
  and others. Some hosts block these by default; a blocked crawler cannot cite
  you in an AI answer.
- **`app/sitemap.ts`** emits `/sitemap.xml` from the `NAV` list.
- **`lib/seo.ts`** holds the JSON-LD:
  - `ProfessionalService` — address, phone, hours, both plan offers, and
    `areaServed` covering all 38 places from the Locations page. This is what a
    query like "Airbnb management in Chiswick" matches against.
  - `FAQPage` on How it works — the eight Q&As, already paired. This is the
    highest-value block for AI assistants, which quote question/answer pairs.
  - `WebSite`.
- **`public/llms.txt`** — a plain-language summary of the service, pricing,
  coverage and contact details for AI crawlers. Unlike the rest, this one is
  hand-written, so update it when pricing or coverage changes.

Both `robots.ts` and `sitemap.ts` set `export const dynamic = "force-static"`,
which `output: "export"` requires.

**Deliberately not added: `Review` / `AggregateRating` schema.** The three
testimonials came from the design and read as placeholders. Marking up
testimonials that aren't real, verifiable customer reviews violates Google's
structured-data policy and risks a manual action. Add it once there are
genuine reviews to point at.

## Outstanding — needs a decision or content

1. **Commission rates** live in `MANAGEMENT_FEES` in `lib/content.ts` —
   Full-time 15%, Flexible 18%. The cards read `From 15%` / `From 18%`,
   keeping the design's "From" label; drop that `<span>` if the rates are flat
   rather than starting points.
2. **No contact-form backend.** `ContactForm.tsx` intercepts the submit and
   shows a message. Point it at a real handler to wire it up — or use a server
   action, which would mean dropping `output: "export"`.
3. **Testimonial attributions** cite Manchester and Birmingham, while the rest
   of the copy is London and Home Counties only. Carried over from the design
   as-is — worth checking whether that is intentional.

## Note on `_ds/`

The handoff bundle included a "Modernist" design system (red on white,
Archivo). `Slate and Cove Website.dc.html` does not reference it — the website
carries its own palette and typography, which is what is implemented here.
