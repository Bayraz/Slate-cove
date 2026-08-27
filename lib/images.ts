// Photography for the two image slots the design specified.
//
// The prototype left both slots empty, carrying only art direction. These are
// the Unsplash photographs chosen for them, referenced by their CDN URL.
//
// NOTE: for production, prefer downloading these into public/ and serving
// them locally — hotlinking puts a third party in the critical render path.
// Swap `src` for a local path and nothing else here changes.

export type SiteImage = {
  src: string;
  alt: string;
  /** The art direction from the design file, kept for reference. */
  brief: string;
};

export const HERO_IMAGE: SiteImage = {
  src: "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  alt: "The open-plan living room of an A-frame house, with tall angled windows looking out into trees",
  brief: "Hero interior — black and white, natural light, straight verticals",
};

export const LOCATIONS_IMAGE: SiteImage = {
  src: "https://images.unsplash.com/photo-1547638599-d4bf222cf5d1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  alt: "A stone cottage with a slate roof, set in a formal garden of roses and clipped hedges",
  brief: "Coverage map or London exterior — black and white",
};
