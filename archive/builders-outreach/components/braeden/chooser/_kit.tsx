/**
 * Shared toolkit for the Braeden homepage CHOOSER option components
 * (HeroOptions / FeaturedOptions / StoryOptions / ProofOptions / ContactOptions
 * / FooterOptions). Keeps the per-option tag + photo treatment + scrims
 * consistent across every section.
 */

export const P = "/braeden/projects";

/** Real Braeden project photos available in public/braeden/projects/. */
export const IMAGES = [
  "modern-thai", "noosa-heads", "noosaville", "river-haven", "sunshine-beach",
  "peregian", "sunrise-beach", "cooroy-mountain", "tinbeerwah", "coolum",
] as const;

/** The little label that names each option so Finbar can pick one. */
export function Tag({ section, n, label }: { section: string; n: number; label: string }) {
  return (
    <div className="brd-opt-tag"><b>{section} · {n}</b> {label}</div>
  );
}

/** Absolute full-cover photo with an optional slow Ken-Burns drift. */
export function Photo({ src, pos = "center", drift = true }: { src: string; pos?: string; drift?: boolean }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: pos,
        animation: drift ? "brdKen 22s ease-in-out infinite alternate" : undefined,
      }}
    />
  );
}

/** Scrims for type over photography (charcoal-toned, never pure black). */
export const RADIAL_SCRIM =
  "radial-gradient(120% 90% at 50% 54%, rgba(20,20,22,0.62) 0%, rgba(20,20,22,0.30) 42%, rgba(20,20,22,0) 78%)";
export const TOP_WASH = "linear-gradient(to bottom, rgba(20,20,22,0.45), rgba(20,20,22,0) 160px)";
export const BOTTOM_SCRIM = "linear-gradient(to top, rgba(20,20,22,0.62), rgba(20,20,22,0) 48%)";
