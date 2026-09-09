// Photography for the two image slots the design specified.
//
// The prototype left both slots empty, carrying only art direction. These are
// the Unsplash photographs chosen for them, referenced by their CDN URL.
//
// NOTE: for production, prefer downloading these into public/ and serving
// them locally, because hotlinking puts a third party in the critical render path.
// Swap `src` for a local path and nothing else here changes.

export type SiteImage = {
  src: string;
  alt: string;
  /** The art direction from the design file, kept for reference. */
  brief: string;
};

/**
 * The home hero is a slideshow. It renders however many images are listed
 * here: with one it is a plain static hero and no controls appear, with more
 * it cross-fades between them. Add or remove entries freely.
 *
 * The design briefs these as: living space, bedroom, kitchen or detail, and
 * exterior or street, all black and white, which Slot applies as a filter.
 */
export const HERO_IMAGES: SiteImage[] = [
  {
    src: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "The open-plan living room of an A-frame house, with tall angled windows looking out into trees",
    brief: "Hero 1, living space",
  },
  {
    src: "https://images.unsplash.com/photo-1728825445493-1a6e89164511?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "The cobbled street of Kynance Mews in London, lined with period houses",
    brief: "Hero 2, exterior or street",
  },
  {
    // Raised from the supplied w=500, which is narrower than the hero renders.
    src: "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=1600&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bG9uZG9ufGVufDB8fDB8fHww",
    alt: "A London street scene",
    brief: "Hero 3",
  },
  {
    src: "https://images.unsplash.com/photo-1448906654166-444d494666b3?w=1600&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxvbmRvbnxlbnwwfHwwfHx8MA%3D%3D",
    alt: "A London street scene",
    brief: "Hero 4",
  },
];

export const LOCATIONS_IMAGE: SiteImage = {
  src: "https://images.unsplash.com/photo-1547638599-d4bf222cf5d1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  alt: "A stone cottage with a slate roof, set in a formal garden of roses and clipped hedges",
  brief: "Coverage map or London exterior, black and white",
};
