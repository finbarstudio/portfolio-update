/**
 * ArchLogo — the chosen mark (logo option 3, "Doorway Portal"): a blue half
 * arch with QLD reversed out of it, and POOL INSTALLS set wide beneath.
 *
 * Two lockups, same mark:
 *  - "stacked" — the asset as drawn: arch over POOL INSTALLS. Needs room, so
 *    it's for the footer and any large brand moment.
 *  - "inline"  — the arch sits left with POOL INSTALLS beside it, so the whole
 *    name still reads left to right in a 56px nav bar, where the stacked
 *    lockup's sub-line would shrink to a few illegible pixels.
 *
 * `tone` flips it for its ground: "dark" over light (arch blue, sub in ink),
 * "light" over the photographic hero (arch white, sub white).
 *
 * Everything scales off `height` so the proportions of the original hold.
 */
export default function ArchLogo({
  height = 44,
  tone = "dark",
  variant = "stacked",
  className = "",
}: {
  /** total lockup height in px */
  height?: number;
  tone?: "dark" | "light";
  variant?: "stacked" | "inline";
  className?: string;
}) {
  const light = tone === "light";
  const archBg = light ? "#ffffff" : "var(--qpi-blue)";
  const qldColor = light ? "var(--qpi-ink)" : "#ffffff";
  const subColor = light ? "#ffffff" : "var(--qpi-ink)";

  if (variant === "inline") {
    // Source proportions: arch 190x110, QLD 34. Here the arch leads and the
    // sub-line sits beside it, so the mark carries the height.
    const s = height / 62;
    return (
      <span
        className={`inline-flex items-center ${className}`}
        style={{ gap: 12 * s }}
        aria-label="QLD Pool Installs"
      >
        <span
          style={{
            width: 107 * s,
            height: 62 * s,
            borderRadius: `${53 * s}px ${53 * s}px 0 0`,
            background: archBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 19 * s,
              fontWeight: 800,
              letterSpacing: 1.1 * s,
              color: qldColor,
              lineHeight: 1,
            }}
          >
            QLD
          </span>
        </span>
        <span
          style={{
            fontSize: 11 * s,
            fontWeight: 500,
            letterSpacing: 3.4 * s,
            color: subColor,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          POOL INSTALLS
        </span>
      </span>
    );
  }

  // stacked — the asset as drawn (arch 190x110, 10 gap, 12 sub = 132 tall)
  const s = height / 132;
  return (
    <span
      className={`inline-flex flex-col items-center ${className}`}
      aria-label="QLD Pool Installs"
    >
      <span
        style={{
          width: 190 * s,
          height: 110 * s,
          borderRadius: `${95 * s}px ${95 * s}px 0 0`,
          background: archBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 34 * s,
            fontWeight: 800,
            letterSpacing: 2 * s,
            color: qldColor,
            lineHeight: 1,
          }}
        >
          QLD
        </span>
      </span>
      <span
        style={{
          marginTop: 10 * s,
          fontSize: 12 * s,
          fontWeight: 500,
          letterSpacing: 4 * s,
          color: subColor,
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        POOL INSTALLS
      </span>
    </span>
  );
}
