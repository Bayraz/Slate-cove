"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteImage } from "@/lib/images";

const INTERVAL = 5200;
const FADE = 900;

/**
 * The home hero. Slides cross-fade on a timer, with dots and arrows to move
 * between them; interacting restarts the timer so a slide never changes out
 * from under the visitor mid-look.
 *
 * With a single image it renders as a plain static hero and no controls
 * appear, so the images list in lib/images.ts can grow or shrink freely.
 */
export default function HeroSlideshow({ images }: { images: SiteImage[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const goTo = useCallback(
    (next: number) => setCurrent(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % count), INTERVAL);
    return () => clearInterval(timer);
  }, [count, paused, current]);

  return (
    <div
      className="hero__slot slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((image, i) => (
        <div
          key={image.src}
          className="slideshow__slide"
          style={{ opacity: i === current ? 1 : 0, transitionDuration: `${FADE}ms` }}
          aria-hidden={i !== current}
        >
          <div className="slot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </div>
        </div>
      ))}

      {count > 1 && (
        <div className="slideshow__controls">
          <div className="slideshow__dots">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                className="slideshow__dot"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === current}
                onClick={() => goTo(i)}
              >
                <span style={{ opacity: i === current ? 1 : 0.4 }} />
              </button>
            ))}
          </div>
          <div className="slideshow__arrows">
            <button type="button" aria-label="Previous slide" onClick={() => goTo(current - 1)}>
              ←
            </button>
            <button type="button" aria-label="Next slide" onClick={() => goTo(current + 1)}>
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
