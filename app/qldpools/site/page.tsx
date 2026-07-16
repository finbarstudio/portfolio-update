import Nav from "@/components/qldpools/Nav";
import Hero from "@/components/qldpools/sections/Hero";
import Reviews from "@/components/qldpools/sections/Reviews";
import Services from "@/components/qldpools/sections/Services";
import Gallery from "@/components/qldpools/sections/Gallery";
import Testimonials from "@/components/qldpools/sections/Testimonials";
import Blog from "@/components/qldpools/sections/Blog";
import Footer from "@/components/qldpools/sections/Footer";

/* QLD Pool Installs demo, assembled from the options Finbar picked:
   hero 76, gallery 17, reviews 44 scattering into 42, services 22,
   testimonials 16, blog 8, footer 4.

   No preloader: the page arrives and staggers itself in (the Hero calls
   markIntroDone once fonts are ready, which is what the nav and the word
   reveals wait on).

   Order is his: the work comes first, then the proof, then what we offer.
   The gap between sections is set once in qpi-site.css (.qpi-page), so the
   whole page breathes consistently rather than each section guessing.

   Still to slot in once he picks from the newer batches: Why choose us (the
   horizontal-grid set, 26-35), FAQ and the contact CTA. */
export default function Home() {
  return (
    <main className="qpi-page bg-white">
      <Nav showLogo />
      <Hero />
      <Gallery />
      <Reviews />
      <Services />
      <Testimonials />
      <Blog />
      <Footer />
    </main>
  );
}
