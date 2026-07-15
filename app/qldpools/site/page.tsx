import Nav from "@/components/qldpools/Nav";
import Preloader from "@/components/qldpools/Preloader";
import Hero from "@/components/qldpools/sections/Hero";
import Reviews from "@/components/qldpools/sections/Reviews";
import MarqueeFooter from "@/components/qldpools/sections/MarqueeFooter";

/* QLD Pool Installs demo. Preloader (logo-cutout zoom, Lows pattern) over a
   full-viewport after-dark hero, an editorial spread of their real Google
   reviews, and the Lows-pattern footer with their badge. */
export default function Home() {
  return (
    <main className="bg-white">
      <Preloader />
      <Nav showLogo />
      <Hero />
      <Reviews />
      <MarqueeFooter />
    </main>
  );
}
