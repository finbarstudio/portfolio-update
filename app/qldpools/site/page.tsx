import Nav from "@/components/qldpools/Nav";
import Preloader from "@/components/qldpools/Preloader";
import Hero from "@/components/qldpools/sections/Hero";

/* QLD Pool Installs demo — hero pass. Preloader (logo-cutout zoom, Lows
   pattern) over a full-viewport after-dark hero with staggered text, plus the
   nav. Sections below the fold come next. */
export default function Home() {
  return (
    <main className="bg-white">
      <Preloader />
      <Nav showLogo />
      <Hero />
    </main>
  );
}
