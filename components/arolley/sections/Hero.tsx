import ParallaxImage from "../ParallaxImage";

/**
 * Image-led hero: a full-bleed project photo (with scroll parallax) carries it,
 * imagery first. Kept deliberately spare, an eyebrow that does the story in one
 * line and a single short statement, room to breathe within one viewport. Depth
 * lives on the About page and the heritage strip below. data-tone="dark" flips
 * the nav to paper over the image.
 */
export default function Hero() {
  return (
    <section data-tone="dark" className="relative w-full" style={{ height: "100svh", minHeight: 560 }}>
      <ParallaxImage src="/a-rolley/projects/lake-house.webp" alt="A Rolley & Sons custom home on the Sunshine Coast" priority />

      {/* Scrims for AA-legible type: a soft radial pool sits directly behind the
          centred text so it reads against any part of the photo, plus a light
          top wash to keep the nav legible. */}
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(ellipse 62% 48% at 50% 52%, rgba(18,15,11,0.62) 0%, rgba(18,15,11,0.34) 45%, rgba(18,15,11,0.06) 78%, rgba(18,15,11,0) 100%)" }} />
      <div aria-hidden className="absolute inset-x-0 top-0 h-40" style={{ background: "linear-gradient(to bottom, rgba(18,15,11,0.42), transparent)" }} />

      <div className="absolute inset-0 frame flex flex-col items-center justify-center text-center" style={{ color: "var(--paper)" }}>
        <p className="eyebrow" style={{ color: "rgba(244,241,234,0.86)" }}>
          Fourth-generation Sunshine Coast builders
        </p>
        <h1 className="display" style={{ color: "var(--paper)", fontSize: "clamp(32px, 4.6vw, 74px)", marginTop: "clamp(16px,1.8vw,26px)", maxWidth: "18ch" }}>
          Homes you&rsquo;ll want to call <span className="display-italic">home</span>.
        </h1>
      </div>

      <div className="absolute right-[var(--gutter)] bottom-[clamp(48px,9vh,120px)] eyebrow flex items-center gap-2" style={{ color: "rgba(244,241,234,0.8)" }}>
        <span>Scroll</span>
        <span aria-hidden className="relative inline-block overflow-hidden" style={{ width: 1, height: 28, background: "rgba(244,241,234,0.5)" }}>
          <span className="absolute inset-0" style={{ background: "var(--paper)", animation: "arlScrollDrop 2.4s ease-in-out infinite" }} />
        </span>
      </div>
    </section>
  );
}
