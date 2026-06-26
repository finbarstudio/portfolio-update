import { STAR_POINTS } from "@/components/brand-star";

/**
 * SandboxLoader — the brand ✶ traced in a glowing pink stroke on a loop. Fills
 * any positioned parent (route loading.tsx, a tool's dynamic-import fallback, a
 * still-mounting stage) so a tap always lands on a visible loading state instead
 * of a frozen old screen or a blank box.
 */
export default function SandboxLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="sb-loader" role="status" aria-live="polite" aria-label={label}>
      <svg className="sb-loader-star" viewBox="0 0 100 100" aria-hidden="true">
        <polygon className="sb-loader-track" points={STAR_POINTS} pathLength={1} />
        <polygon className="sb-loader-draw" points={STAR_POINTS} pathLength={1} />
      </svg>
      {label && <span className="sb-loader-label">{label}</span>}
    </div>
  );
}
