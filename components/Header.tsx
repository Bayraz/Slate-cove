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

  // The full-screen panel covers the page, so stop the page scrolling behind
  // it, and let Escape close it the way a dialog would.
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => document.body.classList.remove("nav-open"), []);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="header">
      <div className="wrap header__inner">
        <Link className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="brand__mark"
            src="/sc-monogram.png"
            alt=""
            width={312}
            height={508}
          />
          <span className="brand__words">
            <span className="brand__name">Slate &amp; Cove</span>
            <span className="brand__tag">Corporate &amp; short-let management</span>
          </span>
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
          <Link className="nav__cta" href="/submit-property">
            Submit your property
          </Link>
        </nav>
      </div>
    </header>
  );
}
