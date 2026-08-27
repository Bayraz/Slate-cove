// Photography for the two image slots the design specified.
//
// The prototype left both slots empty, carrying only art direction. These are
// Unsplash photographs matching that direction, referenced by Unsplash photo
// ID through the CDN so no binaries live in the repo.
//
// NOTE: for production, prefer downloading these and serving them from
// /public — hotlinking Unsplash puts an external dependency in your critical
// render path and is not what their API guidelines recommend for a commercial
// site. Swap `src` for a local path and nothing else here changes.

export type SiteImage = {
  /** Unsplash photo ID. */
  id: string;
  /** The Unsplash page, for licence and credit. */
  page: string;
  src: string;
  alt: string;
  /** The art direction from the design file, kept for reference. */
  brief: string;
};

const cdn = (id: string, width: number) =>
  `https://unsplash.com/photos/${id}/download?w=${width}`;

export const HERO_IMAGE: SiteImage = {
  id: "6iEbq9Ne7b4",
  page: "https://unsplash.com/photos/a-modern-light-filled-apartment-interior-is-shown-6iEbq9Ne7b4",
  src: cdn("6iEbq9Ne7b4", 1200),
  alt: "A bright, modern apartment interior filled with natural light",
  brief: "Hero interior — black and white, natural light, straight verticals",
};

export const LOCATIONS_IMAGE: SiteImage = {
  id: "b5ApUwSn7VI",
  page: "https://unsplash.com/photos/facade-of-georgian-style-terraced-houses-in-london-b5ApUwSn7VI",
  src: cdn("b5ApUwSn7VI", 1000),
  alt: "The facade of a row of Georgian terraced houses in London",
  brief: "Coverage map or London exterior — black and white",
};
