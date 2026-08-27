# Slate & Cove — website

Implementation of the Claude Design prototype `Slate and Cove Website.dc.html`
(project *Brochure redesign guidelines*).

## Stack

Plain static HTML, CSS and a small amount of vanilla JavaScript. No build step,
no dependencies — open `index.html` or serve the directory and it runs.

The repository was empty and no target stack was specified. For a five-page
marketing site this is the lowest-risk choice: real URLs for each page (better
for SEO and sharing than the prototype's client-side page switching), nothing to
install, and easy to port into a framework later if the site grows.

```
.
├── index.html          Home
├── how-it-works.html   How it works
├── pricing.html        Pricing
├── locations.html      Locations
├── contact.html        Contact
└── assets/
    ├── css/styles.css  All styling, design tokens at the top
    └── js/site.js      Small-screen nav toggle, contact-form feedback
```

Run it locally with any static server, e.g. `python3 -m http.server`.

## How it maps to the prototype

The prototype is one document that swaps between five views with a `page` state
variable (`<sc-if>` blocks). Each of those views is a separate HTML file here,
and the nav is ordinary links. The current page is marked with
`aria-current="page"`, which drives the blue underline the prototype rendered
with an opacity binding.

Every colour, font, size and spacing value comes from the prototype. They are
declared once as custom properties at the top of `styles.css`:

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
loaded from Google Fonts exactly as the prototype did.

The prototype's inline styles were lifted into classes rather than copied
verbatim; the rendered result is the same, but the comparison table, the plan
cards and the eight service tiles are now driven by one rule each instead of
repeating the same declarations per cell.

## Decisions made beyond the prototype

The prototype is a single fixed-width desktop canvas. These are the things a
production site needs that it did not specify:

- **Responsive behaviour.** The design is preserved exactly at ≥1280px.
  Below that, breakpoints at 1200 / 900 / 640px reflow the multi-column grids,
  and display type scales with `clamp()` where the design's size is the maximum.
- **Small-screen navigation.** Below 900px the five links collapse behind a
  Menu toggle. The prototype had no mobile state; the toggle uses the same mono
  label styling as the rest of the header.
- **The comparison table** keeps its exact `1.4fr 200px 200px 200px` grid and
  scrolls horizontally inside its own container below ~860px, rather than being
  restructured into cards.
- **Semantics and accessibility.** Real `<form>` labels, `<figure>` for the
  testimonials, `<dl>` for the contact details, a skip link, and visible focus
  outlines. Content is unchanged.
- **The site works without JavaScript.** `site.js` only adds the nav toggle and
  the form status message.

## Outstanding — needs a decision or content

1. **Pricing percentages are placeholders.** Both plan cards read `From 00% of
   net revenue`, exactly as the design does. The real commission rates need to
   be supplied before this goes live.
2. **No contact-form backend.** The form has no `action`, so `site.js`
   intercepts the submit and shows a message instead of navigating somewhere
   broken. Set the form's `action` (and remove that branch in `site.js`) once an
   endpoint exists.
3. **Two images are unfilled.** The design's `<image-slot>` elements on the home
   hero and the locations page had no image saved in the project, only art
   direction. They render as sized frames carrying that brief:
   - Home hero — *"Hero interior — black and white, natural light, straight
     verticals"*, min-height 620px
   - Locations — *"Coverage map or London exterior — black and white"*,
     min-height 360px

   Drop an `<img>` into the `.slot` element and it takes over automatically; the
   grayscale filter and cover-fit are already applied.
4. **Testimonial attributions** cite Manchester and Birmingham, while the rest
   of the copy is London and Home Counties only. Carried over from the design
   as-is — worth checking whether that is intentional.

## Note on `_ds/`

The handoff bundle includes a "Modernist" design system (red on white, Archivo).
`Slate and Cove Website.dc.html` does not reference it — the website carries its
own palette and typography, which is what is implemented here.
