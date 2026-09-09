"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteImage } from "@/lib/images";

const INTERVAL = 5000;
const FADE = 900;

/**
 * The home hero. Slides cross-fade on a timer that runs continuously; moving
 * by dot or arrow restarts it, so a slide never changes immediately after the
 * visitor has chosen one.
 *
 * Reduced motion removes the cross-fade rather than the rotation. The setting
 * asks for no animation, not for the page to stop showing what it has: the
 * slides swap instantly instead, and the controls work either way.
 *
 * With a single image it renders as a plain static hero and no controls
 * appear, so the images list in lib/images.ts can grow or shrink freely.
 */
export default function HeroSlideshow({ images }: { images: SiteImage[] }) {
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const count = images.length;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // `current` is a dependency on purpose: choosing a slide by hand rebuilds
  // the interval, giving that slide a full turn before the next advance.
  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % count), INTERVAL);
    return () => clearInterval(timer);
  }, [count, current]);

  const goTo = useCallback(
    (next: number) => setCurrent(((next % count) + count) % count),
    [count],
  );

  return (
    <div className="hero__slot slideshow">
      {images.map((image, i) => (
        <div
          key={image.src}
          className="slideshow__slide"
          style={{
            opacity: i === current ? 1 : 0,
            transitionDuration: reducedMotion ? "0ms" : `${FADE}ms`,
          }}
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
