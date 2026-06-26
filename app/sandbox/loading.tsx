import SandboxLoader from "@/components/sandbox/SandboxLoader";

/**
 * Route-level loading UI for the Sandbox. App Router swaps this in instantly on
 * navigation while the destination's RSC streams in, so every tap produces
 * immediate feedback instead of a frozen previous screen.
 */
export default function SandboxRouteLoading() {
  return (
    <div className="sb-route-loading">
      <SandboxLoader />
    </div>
  );
}
