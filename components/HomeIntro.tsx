"use client";

/**
 * HomeIntro — opening preloader + resting logo.
 *
 * Preloader (desktop, once per session) — the asterisk NEVER scales, only
 * translates:
 *   1. the brand asterisk outline traces itself (centre screen, at final size)
 *   2. it fills pink
 *   3. the intro screen "opens" — the opaque overlay fades to transparent
 *   4. the asterisk translates down to the middle-bottom of the screen
 *   5. then translates right into its slot (bottom-right of the lockup)
 *   6. FINBARSTUDIO slides in from the left to complete the logo (end of phase 1)
 *   7. scrolling unlocks, and after a short hold the page auto-glides down to the
 *      design-text hero (#hero) — phase 2 — the lockup scroll-docking up into the
 *      nav on the way. A manual scroll/keypress during the hold cancels the glide.
 *
 * Mobile: no preloader / no scroll-morph — a small static asterisk logo sits
 * top-right and the page content starts immediately (handled in CSS).
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MARK_VIEWBOX } from "./brand-mark";
import BrandMark from "./BrandMark";
import { scrollToHero } from "@/lib/scroll";
import { GOTO_HERO_KEY } from "./NavLogo";

const MOBILE_QUERY = "(max-width: 767px)";
const PLAYED_KEY = "finbar-intro-played";
// Phase 2 of the intro: how long the finished FINBARSTUDIO* lockup holds at the
// bottom of the first screen before the page auto-glides to the design-text hero.
const PHASE2_HOLD_MS = 200;

export default function HomeIntro() {
  const lockupRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  // Arriving from another page via NavLogo: once any intro lock clears, smooth-
  // scroll to the hero (so the logo lands you at the start of the hero text).
  useEffect(() => {
    let want = false;
    try { want = sessionStorage.getItem(GOTO_HERO_KEY) === "1"; } catch { /* ignore */ }
    if (!want) return;
    try { sessionStorage.removeItem(GOTO_HERO_KEY); } catch { /* ignore */ }
    let tries = 0;
    const go = () => {
      // Wait out the intro scroll-lock AND Lenis init. Lenis being ready also means
      // the route-change scroll-to-top has already fired, so we reliably land on the
      // logo screen first and then glide DOWN to the hero, rather than firing early
      // and getting reset to the top (which left the press stuck on the logo).
      const introBusy = document.documentElement.dataset.introLock === "1";
      const lenisReady = !!window.__lenis;
      if ((introBusy || !lenisReady) && tries++ < 80) {
        setTimeout(go, 100);
        return;
      }
      requestAnimationFrame(() => scrollToHero());
    };
    const t = setTimeout(go, 80);
    return () => clearTimeout(t);
  }, []);

  // Resting logo: fit-to-width + scroll-shrink into the nav. This ALWAYS runs on
  // desktop — independent of whether the preloader plays — so the logo is always
  // correctly positioned (even on a revisit when the intro is skipped). Mobile is
  // skipped (CSS pins a static corner mark instead).
  useLayoutEffect(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) return;
    const el = lockupRef.current;
    if (!el) return;
    let bigFont = 0;
    let natH = 0;
    const fit = () => {
      // Width reference is the section, not the immediate parent (now the wipe
      // carrier) — keeps the fit identical to before the wrapper was added.
      const parent = el.closest(".home-intro") as HTMLElement | null;
      if (!parent) return;
      const cs = getComputedStyle(parent);
      const avail = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      if (natural > 0 && avail > 0) el.style.fontSize = `${Math.max(20, (avail / natural) * 100)}px`;
      bigFont = parseFloat(getComputedStyle(el).fontSize) || 100;
      const prev = el.style.transform;
      el.style.transform = "translate(-50%, -50%) scale(1)";
      natH = el.offsetHeight;
      el.style.transform = prev;
    };
    const apply = () => {
      const vh = window.innerHeight;
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--menubar-h")) || 56;
      const span = Math.max(1, vh * 0.7);
      const p = Math.min(1, Math.max(0, window.scrollY / span));
      const startCenterY = vh - natH / 2 - 34;
      const endCenterY = navH / 2;
      const cy = startCenterY + (endCenterY - startCenterY) * p;
      const target = Math.min(1, 18 / (bigFont || 18));
      const scale = 1 + (target - 1) * p;
      el.style.transform = `translate(-50%, calc(-50% + ${cy}px)) scale(${scale})`;
    };
    fit();
    apply();
    document.fonts?.ready.then(() => { fit(); apply(); }).catch(() => {});
    const onScroll = () => apply();
    const onResize = () => { fit(); apply(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Preloader choreography — desktop, once per browser session. Runs AFTER the fit
  // effect above (same commit, in order), so the slot is already laid out and we
  // measure it synchronously. sessionStorage gate: the full intro plays on the
  // first visit of the session only, and does NOT replay on refresh. On a refresh /
  // revisit we skip the intro but still glide down to the hero (see
  // scheduleRevisitScroll) so the visitor is never left parked on the logo screen.
  useLayoutEffect(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) { setDone(true); return; }

    // Refresh / revisit: never leave the visitor parked on the logo. Returns a
    // cleanup fn. Once Lenis + the browser's scroll restoration have settled, if
    // we're still above the hero (on the logo screen), glide down to it. Skipped
    // when arriving via the nav logo (the GOTO_HERO effect handles that) or under
    // reduced motion, and cancelled if the visitor scrolls first.
    const scheduleRevisitScroll = (): (() => void) => {
      let arrivingViaLogo = false;
      try { arrivingViaLogo = sessionStorage.getItem(GOTO_HERO_KEY) === "1"; } catch { /* ignore */ }
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (arrivingViaLogo || reduceMotion) return () => {};

      let tries = 0;
      let cancelled = false;
      let timer: number | undefined;
      const cancel = () => {
        cancelled = true;
        if (timer !== undefined) clearTimeout(timer);
        window.removeEventListener("wheel", cancel);
        window.removeEventListener("touchstart", cancel);
        window.removeEventListener("keydown", cancel);
      };
      window.addEventListener("wheel", cancel, { passive: true });
      window.addEventListener("touchstart", cancel, { passive: true });
      window.addEventListener("keydown", cancel);

      const settle = () => {
        if (cancelled) return;
        // Wait for Lenis (its presence also means the route/restore scroll fired).
        if (!window.__lenis && tries++ < 60) { timer = window.setTimeout(settle, 100); return; }
        requestAnimationFrame(() => {
          if (cancelled) return;
          const hero = document.getElementById("hero");
          if (hero) {
            const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--menubar-h")) || 56;
            const heroTop = hero.getBoundingClientRect().top + window.scrollY - navH - 8;
            // Only glide if we're still above the hero (on the logo screen); if the
            // page was restored further down, leave the visitor where they are.
            if (window.scrollY < heroTop - 4) scrollToHero();
          }
          cancel();
        });
      };
      timer = window.setTimeout(settle, 120);
      return cancel;
    };

    // The intro is a PRELOADER, not a page state: once it has played, its
    // region leaves the document entirely (nothing above the hero to scroll
    // back to) and the static nav logo takes over from the lockup.
    const collapse = () => {
      const el = document.querySelector<HTMLElement>(".home-intro");
      const h = el?.offsetHeight ?? 0;
      document.documentElement.classList.add("intro-collapsed");
      const y = Math.max(0, (window.__lenis?.animatedScroll ?? window.scrollY) - h);
      if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    };

    let played = false;
    try { played = !!sessionStorage.getItem(PLAYED_KEY); } catch { /* ignore */ }
    // ?intro in the URL forces a replay (handy for reviewing the preloader).
    if (window.location.search.includes("intro")) played = false;
    if (played) { setDone(true); collapse(); return; }

    const fly = flyRef.current, slot = slotRef.current,
      text = textRef.current, screen = screenRef.current, mark = markRef.current;
    if (!fly || !slot || !text || !screen || !mark) { setDone(true); return; }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.introLock = "1";
    window.__lenis?.stop();
    window.scrollTo(0, 0);

    let finished = false;
    let phase2Timer: number | undefined;
    let cancelHold: (() => void) | undefined;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Phase 2 — after the lockup assembles, hold a beat then glide the page down to
    // the design-text hero (#hero). The lockup scroll-docks up into the nav on the
    // way (the fit effect above is scroll-driven). Any manual scroll/keypress during
    // the hold cancels the glide, so we never fight a visitor who scrolls first.
    const startPhase2 = () => {
      const stop = () => {
        if (phase2Timer !== undefined) { clearTimeout(phase2Timer); phase2Timer = undefined; }
        window.removeEventListener("wheel", onCancel);
        window.removeEventListener("touchstart", onCancel);
        window.removeEventListener("keydown", onCancel);
        cancelHold = undefined;
      };
      // A manual scroll during the hold takes over from the glide — the intro
      // still collapses (with the scroll position compensated) a beat later.
      const onCancel = () => { stop(); window.setTimeout(collapse, 80); };
      cancelHold = stop;
      window.addEventListener("wheel", onCancel, { passive: true });
      window.addEventListener("touchstart", onCancel, { passive: true });
      window.addEventListener("keydown", onCancel);
      phase2Timer = window.setTimeout(() => { stop(); scrollToHero(); window.setTimeout(collapse, 1100); }, PHASE2_HOLD_MS);
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem(PLAYED_KEY, "1"); } catch { /* ignore */ }
      text.classList.add("is-revealed");
      setDone(true);
      document.body.style.overflow = prevOverflow;
      delete document.documentElement.dataset.introLock;
      window.__lenis?.start();
      if (!reduce) startPhase2();   // phase 2: auto-glide to the design-text hero
      else collapse();
    };
    const failsafe = setTimeout(finish, 7000);

    // Size the flying asterisk to EXACTLY the slot asterisk, so it only ever
    // translates — never scales (per spec). Both draw the same polygon, so a
    // matching width means a pixel-identical mark at the handoff.
    const sRect0 = slot.getBoundingClientRect();
    if (sRect0.width > 0) {
      fly.style.width = `${sRect0.width}px`;
      fly.style.height = `${sRect0.width}px`;
    }

    gsap.set(fly, { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 1 });

    // The mark's six shapes, innermost first. MARK_SHAPES paints outer-to-inner
    // (tips down to the centre dot, so the dot lands on top), so reversing the
    // painted order walks from the middle out — which is the direction the
    // pulse travels.
    const layers = [...mark.querySelectorAll<SVGElement>("polygon, path, circle")].reverse();

    // Every layer scales from the MARK's centre, not from its own bounding box —
    // otherwise each ring would bloom around itself and the shape would break
    // apart instead of growing out of the middle. The viewBox is square, so its
    // centre is the centre dot's own cx/cy.
    const vb = MARK_VIEWBOX.split(" ").map(Number);
    const centre = `${vb[2] / 2} ${vb[3] / 2}`;
    gsap.set(layers, {
      svgOrigin: centre,
      scale: reduce ? 1 : 0,
      opacity: reduce ? 1 : 0,
    });
    gsap.set(screen, { opacity: 1 });

    // Translation deltas (fly centre → slot centre), measured after sizing.
    const f = fly.getBoundingClientRect();
    const s = slot.getBoundingClientRect();
    const dx = (s.left + s.width / 2) - (f.left + f.width / 2);
    const dy = (s.top + s.height / 2) - (f.top + f.height / 2);

    if (reduce) {
      gsap.set(screen, { opacity: 0 });
      text.classList.add("is-revealed");
      const t = gsap.delayedCall(0.4, () => { clearTimeout(failsafe); finish(); });
      return () => { t.kill(); document.body.style.overflow = prevOverflow; delete document.documentElement.dataset.introLock; window.__lenis?.start(); };
    }

    const tl = gsap.timeline({ onComplete: () => { clearTimeout(failsafe); finish(); } });
    // 1 the mark pulses itself into being, one layer at a time, centre → tips.
    //   back.out overshoots slightly so each ring lands with a beat rather than
    //   easing flat, which is what makes it read as a pulse.
    tl.to(layers, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)", stagger: 0.04 })
      .to(screen, { opacity: 0, duration: 0.3, ease: "power2.inOut" }, "+=0.03")     // 2 screen opens
      .to(fly, { y: dy, duration: 0.3, ease: "power3.inOut" }, "-=0.1")            // 4 down to middle-bottom
      .to(fly, { x: dx, duration: 0.32, ease: "power3.inOut" }, "+=0.02")             // 5 right to the slot
      .call(() => { text.classList.add("is-revealed"); }, undefined, "-=0.1");       // 6 text slides in

    return () => {
      cancelHold?.();
      clearTimeout(failsafe);
      tl.kill();
      document.body.style.overflow = prevOverflow;
      delete document.documentElement.dataset.introLock;
      window.__lenis?.start();
    };
  }, []);

  return (
    <section className={`home-intro ${done ? "is-done" : ""}`} aria-label="finbarstudio">
      {!done && <div ref={screenRef} className="intro-screen" aria-hidden="true" />}
      {!done && (
        <div ref={flyRef} className="intro-fly" aria-hidden="true">
          {/* The logo itself. Its six shapes are the animation — see the
              timeline: they pulse in from the centre dot out to the tips. */}
          <span ref={markRef} className="intro-fly-mark">
            <BrandMark />
          </span>
        </div>
      )}

      {/* Outer = the wipe carrier (CSS translateY, data-nav driven). Inner = the
          lockup, whose fit + scroll-dock transform is JS-driven — separating them
          means the wipe never fights the dock. */}
      <div className="home-intro-mark">
        <a
          href="/"
          className="home-intro-lockup brand-wordmark"
          ref={lockupRef}
          aria-label="Back to top of the hero"
          onClick={(e) => {
            // The logo lives only on home — smooth-scroll up to the hero, not navigate.
            e.preventDefault();
            scrollToHero();
          }}
        >
          <span className={`home-intro-text ${done ? "is-revealed" : ""}`} ref={textRef} aria-hidden="true">FINBARSTUDIO</span>
          <span
            className={`brand-wordmark-mark home-intro-slot ${done ? "is-shown" : ""}`}
            ref={slotRef}
            aria-hidden="true"
          >
            <BrandMark className="home-intro-slot-star brand-wordmark-asterisk" />
          </span>
        </a>
      </div>
    </section>
  );
}
