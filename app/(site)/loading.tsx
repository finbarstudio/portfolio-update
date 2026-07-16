import Loader from "@/components/Loader";

/**
 * Catch-all loading UI for the site route group. Any tab whose page takes a
 * moment to stream (about, contact, the service pages, a case study) shows this
 * immediately on tap instead of leaving the previous page frozen with nothing
 * happening. /work has its own richer skeleton (work/loading.tsx), which wins
 * over this one because it sits closer to that segment.
 *
 * Just the brand pulse, centred and transparent (bare) — no skeleton slab — so
 * on a fast page it reads as a brief beat rather than a flash of grey boxes.
 */
export default function SiteLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      style={{ position: "relative", minHeight: "60svh" }}
    >
      <Loader bare />
    </div>
  );
}
