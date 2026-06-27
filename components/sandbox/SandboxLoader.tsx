import { ASTERISK_POINTS } from "@/components/brand-asterisk";

/**
 * SandboxLoader — the brand mark, flashing. Uses the SAME pulse the nav tabs use
 * while a tap is in flight (sb-loader-fade), so every load in the sandbox reads
 * the same way: the pink asterisk + label fade in and out together. Fills any
 * positioned parent (route loading.tsx, a tool's dynamic-import fallback, a
 * still-mounting stage) so a tap always lands on a visible loading state.
 */
export default function SandboxLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="sb-loader" role="status" aria-live="polite" aria-label={label}>
      <svg className="sb-loader-mark" viewBox="0 0 100 100" aria-hidden="true">
        <polygon points={ASTERISK_POINTS} fill="var(--pink)" />
      </svg>
      {label && <span className="sb-loader-label">{label}</span>}
    </div>
  );
}
