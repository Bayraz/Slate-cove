import type { SiteImage } from "@/lib/images";

type Props = {
  image: SiteImage;
  className?: string;
  priority?: boolean;
};

/**
 * A photographic frame. The design calls for black and white throughout, which
 * the `.slot > img` rule applies as a grayscale filter, so a colour source can
 * be dropped in without editing it first.
 *
 * A plain <img> rather than next/image: the build is a static export with
 * image optimisation off, so next/image would emit the same tag with extra
 * indirection.
 */
export default function Slot({ image, className, priority = false }: Props) {
  return (
    <div className={className ? `slot ${className}` : "slot"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
}
