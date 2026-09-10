/**
 * A small line mark, drawn on a 24x24 grid. Used beside the services and
 * anywhere else a list reads better with a shape to land on before the words.
 *
 * Not a client component: these are static and should not cost the page any
 * JavaScript.
 */
export default function Icon({ d, className }: { d: readonly string[]; className?: string }) {
  return (
    <svg
      className={className ?? "icon"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
