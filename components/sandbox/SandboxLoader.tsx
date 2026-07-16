import BrandLoader from "@/components/ui/loader";

/**
 * SandboxLoader — the shared BrandLoader (the centre-out mark pulse) with a
 * label under it, so every load in the sandbox reads exactly like every load on
 * the main site. The icon and its timing live in one place (BrandLoader +
 * .brand-loader in globals.css); this only adds the sandbox's label. Fills any
 * positioned parent (route loading.tsx, a tool's dynamic-import fallback, a
 * still-mounting stage) so a tap always lands on a visible loading state.
 */
export default function SandboxLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="sb-loader" role="status" aria-live="polite" aria-label={label}>
      <span className="sb-loader-mark">
        <BrandLoader size={40} />
      </span>
      {label && <span className="sb-loader-label">{label}</span>}
    </div>
  );
}
