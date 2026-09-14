/**
 * The referral, drawn as the circle it is.
 *
 * The promise that separates us from every other manager an agent could send
 * a property to is that the client comes back to them, and a paragraph saying
 * so reads like every other paragraph on every other partner page. Four boxes
 * and an arrow that returns to the first one cannot be skimmed past: the shape
 * itself is the argument.
 *
 * A server component, so it costs the page no JavaScript. The list underneath
 * is the same four steps in reading order, which is what a screen reader gets;
 * the drawing is hidden from it rather than described twice.
 */
const STAGES = [
  { n: "1", title: "You introduce", copy: "A landlord you already act for" },
  { n: "2", title: "We manage", copy: "The short let, start to finish" },
  { n: "3", title: "They decide", copy: "To sell, or to let long term" },
  { n: "4", title: "Back to you", copy: "We send them to you for it" },
] as const;

export default function ReferralLoop() {
  return (
    <div className="loop">
      <ol className="loop__stages">
        {STAGES.map(({ n, title, copy }) => (
          <li className="loop__stage" key={n}>
            <span className="loop__n" aria-hidden="true">
              {n}
            </span>
            <span className="loop__title">{title}</span>
            <span className="loop__copy">{copy}</span>
          </li>
        ))}
      </ol>

      {/* The return leg. It is the whole point of the drawing, so it carries
          its own label rather than relying on an arrowhead to say it. */}
      <div className="loop__return" aria-hidden="true">
        <svg viewBox="0 0 1000 44" preserveAspectRatio="none" className="loop__rule">
          <path d="M988 2 V26 Q988 38 976 38 H24 Q12 38 12 26 V2" />
          <path d="M6 10 L12 2 L18 10" />
        </svg>
        <p className="loop__label">The instruction comes back to you</p>
      </div>
    </div>
  );
}
