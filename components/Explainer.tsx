"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The homepage explainer: a sequence drawn live rather than played from a
 * video file, so it stays sharp at any size, costs the page a few kilobytes
 * instead of several megabytes, and leaves every word of it readable by
 * search engines and AI crawlers.
 *
 * The scenes sit side by side on a rail that scrolls horizontally, so the
 * page itself never gets taken over: a visitor scrolls past it as normal, or
 * swipes through it if it catches them. It moves on its own while it is on
 * screen and hands over the moment anyone touches it.
 *
 * It follows the structure that converts on a landing page: open on the
 * viewer's problem, amplify it, show the answer, prove it twice, then one
 * call to action. It is silent by design, because most people watch muted and
 * the type has to carry it on its own.
 */

/* How long each scene holds before the rail moves itself along. */
const HOLD = [6600, 7000, 4800, 5000, 6000, 5800, 5400, 4400, 6200];

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
const len = (n: number) => ({ "--len": n }) as React.CSSProperties;

/* Small line icons, so the wordy scenes read at a glance. */
const Ico = ({ d }: { d: string[] }) => (
  <svg className="xp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p) => (p.startsWith("c:")
      ? (() => {
          const [cx, cy, r] = p.slice(2).split(",");
          return <circle key={p} cx={cx} cy={cy} r={r} />;
        })()
      : <path key={p} d={p} />))}
  </svg>
);

const I = {
  person: ["c:12,8,3.2", "M5.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2"],
  calendar: ["M3.5 5.5h17v15h-17z", "M3.5 10.5h17", "M8 3v3", "M16 3v3"],
  clock: ["c:12,12,8.5", "M12 7v5.3l3.4 2"],
  down: ["M3.5 7.5 10 14l3.5-3.5L20.5 17", "M20.5 12v5h-5"],
  doc: ["M6 3.5h12v17H6z", "M9 8.5h6", "M9 12h6", "M9 15.5h4"],
  up: ["M3.5 16.5 9 11l3.5 3.5L20.5 6", "M15.5 6h5v5"],
  chat: ["M20.5 12c0 3.6-3.8 6.5-8.5 6.5-1.1 0-2.2-.2-3.2-.5L4 20l1.5-3.6A6.1 6.1 0 0 1 3.5 12c0-3.6 3.8-6.5 8.5-6.5S20.5 8.4 20.5 12Z"],
  clean: ["M10 3 11.6 8 16.5 9.6 11.6 11.2 10 16.2 8.4 11.2 3.5 9.6 8.4 8Z", "M18 15v5", "M15.5 17.5h5"],
} as const;

/* Abstract backdrops. Four motifs, drawn large and faint so they read as
   texture rather than illustration, anchored to a different edge each time so
   the eye finds a new composition as the rail moves. */
const MOTIFS = {
  arcs: (
    <>
      <circle cx="400" cy="400" r="118" /><circle cx="400" cy="400" r="182" />
      <circle cx="400" cy="400" r="246" /><circle cx="400" cy="400" r="310" />
      <circle cx="400" cy="400" r="374" />
    </>
  ),
  orbit: (
    <>
      <circle cx="150" cy="146" r="128" /><circle cx="258" cy="196" r="128" />
      <circle cx="196" cy="290" r="128" /><circle cx="204" cy="212" r="196" />
    </>
  ),
  grid: (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`v${i}`} d={`M${i * 48 + 8} 0V400`} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`h${i}`} d={`M0 ${i * 48 + 8}H400`} />
      ))}
    </>
  ),
  rays: (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${i * 54 - 180} 400L${i * 54 + 220} 0`} />
      ))}
    </>
  ),
} as const;

const Bg = ({ m, at }: { m: keyof typeof MOTIFS; at?: "left" }) => (
  <span className="xp-bg" data-motif={m} data-at={at} aria-hidden="true">
    <svg viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="1.25">
      {MOTIFS[m]}
    </svg>
  </span>
);

export default function Explainer() {
  const [index, setIndex] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [steering, setSteering] = useState(false); // the visitor has taken over
  const rail = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The rail is the source of truth: whatever is snapped is the live scene.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const n = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(Math.min(Math.max(n, 0), HOLD.length - 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Only run while it is actually being looked at.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goTo = useCallback((n: number, smooth = true) => {
    const el = rail.current;
    if (!el) return;
    el.scrollTo({ left: n * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Moves itself along, so nothing has to be pressed. Stops for good once the
  // visitor swipes or uses the controls, and never starts if reduced motion
  // has been asked for.
  useEffect(() => {
    if (!onScreen || steering) return;
    if (index >= HOLD.length - 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setTimeout(() => goTo(index + 1), HOLD[index]);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [onScreen, steering, index, goTo]);

  const takeOver = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setSteering(true);
  }, []);

  const step = useCallback((by: number) => {
    takeOver();
    goTo(Math.min(Math.max(index + by, 0), HOLD.length - 1));
  }, [index, goTo, takeOver]);

  const cls = (n: number) => (index === n ? "xp-scene is-live" : "xp-scene");

  return (
    <div className="xp">
      <div className="xp-frame">
        <div
          className="xp-rail"
          ref={rail}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="How Slate and Cove works"
          onPointerDown={takeOver}
          onWheel={(e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) takeOver(); }}
          onKeyDown={takeOver}
        >

          <section className={cls(0)} data-bg="paper">
              <Bg m="arcs" />
            <span className="xp-eyebrow" style={delay(0)}>If any of this sounds familiar</span>
            <div className="xp-stack xp-situations" style={delay(60)}>
              <span><Ico d={[...I.person]} /><em>A tenant who is more trouble than the rent.</em></span>
              <span><Ico d={[...I.calendar]} /><em>On the market for months, earning nothing while it waits.</em></span>
              <span><Ico d={[...I.clock]} /><em>No time to run it yourself.</em></span>
              <span><Ico d={[...I.down]} /><em>Rent that never quite covers what it should.</em></span>
            </div>
          </section>

          <section className={cls(1)} data-bg="alt">
              <Bg m="rays" />
            <span className="xp-eyebrow" style={delay(0)}>A short let earns more, but someone has to</span>
            <div className="xp-stack" style={delay(120)}>
              <span><Ico d={[...I.doc]} /><em>Write the listing.</em></span>
              <span><Ico d={[...I.up]} /><em>Move the price, daily.</em></span>
              <span><Ico d={[...I.chat]} /><em>Answer guests at 2am.</em></span>
              <span><Ico d={[...I.clean]} /><em>Clean between every stay.</em></span>
            </div>
          </section>

          <section className={cls(2)} data-bg="paper">
              <Bg m="orbit" at="left" />
            <span className="xp-eyebrow" style={delay(0)}>This is where we come in</span>
            <p className="xp-line" style={delay(140)}>We list it, price it, host it and clean it.</p>
            <div className="xp-figure" style={delay(300)} aria-hidden="true">
              <svg viewBox="0 0 200 200" fill="none" stroke="var(--wine)" strokeWidth="2">
                <circle data-draw style={len(90)} cx="72" cy="78" r="14" />
                <path data-draw style={len(120)} d="M50 138c0-16 10-27 22-27s22 11 22 27" />
                <circle data-draw style={len(90)} cx="132" cy="78" r="14" />
                <path data-draw style={len(120)} d="M110 138c0-16 10-27 22-27s22 11 22 27" />
              </svg>
            </div>
          </section>

          <section className={cls(3)} data-bg="alt">
              <Bg m="grid" />
            <span className="xp-eyebrow" style={delay(0)}>Listed everywhere that matters</span>
            <div className="xp-platforms" style={delay(140)}>
              <span>Airbnb</span><span>Booking.com</span><span>Vrbo</span><span>Expedia</span>
            </div>
            <p className="xp-sub" style={delay(300)}>Priced against local demand every single day.</p>
          </section>

          <section className={cls(4)} data-bg="paper">
              <Bg m="arcs" />
            <span className="xp-eyebrow" style={delay(0)}>And every month, in writing</span>
            <div className="xp-ledger" style={delay(140)}>
              <div><span>Occupancy</span><i /></div>
              <div><span>Revenue</span><i /></div>
              <div><span>Expenses</span><i /></div>
              <div><span>Our fee</span><i /></div>
              <div className="net"><span>Your payout</span><i /></div>
            </div>
          </section>

          <section className={cls(5)} data-bg="alt">
              <Bg m="orbit" />
            <span className="xp-eyebrow" style={delay(0)}>Why we price it this way</span>
            <p className="xp-line" style={delay(140)}>We take a percentage. So we only earn when you do.</p>
            <p className="xp-sub" style={delay(320)}>
              No setup fee. No monthly retainer. An empty calendar costs us too.
            </p>
          </section>

          <section className={cls(6)} data-bg="paper">
              <Bg m="rays" />
            <span className="xp-eyebrow" style={delay(0)}>The difference</span>
            <p className="xp-line" style={delay(140)}>Thirty to forty per cent more than a long tenancy.</p>
            <div className="xp-bars" style={delay(280)} aria-hidden="true">
              <div className="xp-barcol"><div className="xp-bar" /><span className="xp-barlab">Tenancy</span></div>
              <div className="xp-barcol"><div className="xp-bar tall" /><span className="xp-barlab">Short let</span></div>
            </div>
          </section>

          <section className={cls(7)} data-bg="alt">
              <Bg m="grid" at="left" />
            <span className="xp-eyebrow" style={delay(0)}>Your part</span>
            <p className="xp-line" style={delay(140)}>Hand over the keys.</p>
            <div className="xp-figure" style={delay(300)} aria-hidden="true">
              <svg viewBox="0 0 200 200" fill="none" stroke="var(--ink)" strokeWidth="2">
                <circle data-draw style={len(110)} cx="78" cy="96" r="17" />
                <path data-draw style={len(70)} d="M95 96h46" />
                <path data-pop d="M126 96v14M138 96v10" stroke="var(--wine)" />
              </svg>
            </div>
          </section>

          <section className={`${cls(8)} xp-end`} data-bg="wine">
            <Bg m="orbit" />
            <div className="xp-endmark" style={delay(0)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/sc-monogram.png" alt="" width={312} height={508} />
              <span className="xp-endline">Send us your postcode.</span>
              <span className="xp-endsub">
                We will tell you what it could earn. Free, and no lock-in contract.
              </span>
              <Link className="btn btn--solid xp-cta" href="/contact">
                Get a free estimate
              </Link>
            </div>
          </section>

        </div>

        <button
          className="xp-arrow xp-arrow--prev"
          type="button"
          aria-label="Previous scene"
          onClick={() => step(-1)}
          disabled={index === 0}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
        <button
          className="xp-arrow xp-arrow--next"
          type="button"
          aria-label="Next scene"
          onClick={() => step(1)}
          disabled={index === HOLD.length - 1}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="xp-controls">
        <span className="xp-count">
          Scene {String(index + 1).padStart(2, "0")}
          <em> of {String(HOLD.length).padStart(2, "0")}</em>
        </span>
        <span className="xp-hint">
          {index === HOLD.length - 1 ? "That is the whole of it" : "Take it at your own pace"}
        </span>
        <div className="xp-dots" role="tablist" aria-label="Scenes">
          {HOLD.map((_, n) => (
            <button
              key={n}
              type="button"
              role="tab"
              aria-selected={index === n}
              aria-label={`Scene ${n + 1}`}
              className={index === n ? "is-on" : undefined}
              onClick={() => { takeOver(); goTo(n); }}
            >
              {index === n && onScreen && !steering && n < HOLD.length - 1 ? (
                <span className="xp-fill" style={{ animationDuration: `${HOLD[n]}ms` }} />
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
