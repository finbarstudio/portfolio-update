import LabSwitch from "@/components/LabSwitch";

/**
 * Lab header on the section's 3-column grid: "lab.finbar.studio" on the left,
 * an empty middle column, and the lab switch on the right, already on, which
 * flips off and sweeps back to finbar.studio. The home link is a plain clean
 * path because proxy.ts rewrites it on the subdomain; a `/lab/...` prefix here
 * would leak into the URL.
 */
export default function LabHeader() {
  return (
    <header className="lb-grid lb-header lb-fade" style={{ "--i": 0 } as React.CSSProperties}>
      <a href="/" className="lb-logo">
        lab.finbar.studio
      </a>
      <span />
      <nav className="lb-nav" aria-label="lab">
        <LabSwitch to="studio" />
      </nav>
    </header>
  );
}
