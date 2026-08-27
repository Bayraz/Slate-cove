"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/content";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Collapse the panel when the viewport grows past the breakpoint, so the
  // desktop layout is never left in the "open" state.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 901px)");
    const reset = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    wide.addEventListener("change", reset);
    return () => wide.removeEventListener("change", reset);
  }, []);

  // Any navigation closes it.
  useEffect(() => setOpen(false), [pathname]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="header">
      <div className="wrap header__inner">
        <Link className="brand" href="/">
          <span className="brand__name">Slate &amp; Cove</span>
          <span className="brand__tag">Corporate &amp; short-let management</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav
          className={open ? "nav is-open" : "nav"}
          id="primary-nav"
          aria-label="Primary"
        >
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              className="nav__link"
              href={href}
              aria-current={isCurrent(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link className="nav__cta" href="/contact">
            Book a viewing
          </Link>
        </nav>
      </div>
    </header>
  );
}
