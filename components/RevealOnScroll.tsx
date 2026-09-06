"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Eases sections in as they are scrolled to.
 *
 * The hiding is done by CSS gated on `html.js-reveal`, which only this
 * component adds — so without JavaScript, or when reduced motion is asked
 * for, every section renders plainly visible and nothing can be stranded
 * invisible.
 */
export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("js-reveal");
      return;
    }

    root.classList.add("js-reveal");
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section"),
    );

    const reveal = (el: HTMLElement) => {
      el.classList.add("is-visible");
      observer.unobserve(el);
    };

    // Reveal anything at or above the fold, not only what is intersecting
    // right now. Jumping down the page — an anchor link, end key, a flick on
    // a phone — leaves sections that were scrolled clean past without ever
    // intersecting; without this sweep they stay invisible on the way back up.
    const sweep = () => {
      for (const section of sections) {
        if (section.classList.contains("is-visible")) continue;
        if (section.getBoundingClientRect().top < window.innerHeight * 0.88) {
          reveal(section);
        }
      }
    };

    const observer = new IntersectionObserver(sweep, {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.05,
    });

    for (const section of sections) observer.observe(section);
    sweep();

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
