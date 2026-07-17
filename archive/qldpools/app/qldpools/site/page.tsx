import Nav from "@/components/qldpools/Nav";
import Hero from "@/components/qldpools/sections/Hero";
import Gallery from "@/components/qldpools/sections/Gallery";
import Reviews from "@/components/qldpools/sections/Reviews";
import Services from "@/components/qldpools/sections/Services";
import Why from "@/components/qldpools/sections/Why";
import Testimonials from "@/components/qldpools/sections/Testimonials";
import Blog from "@/components/qldpools/sections/Blog";
import Faq from "@/components/qldpools/sections/Faq";
import Cta from "@/components/qldpools/sections/Cta";
import Footer from "@/components/qldpools/sections/Footer";

/* QLD Pool Installs demo. Every section is a design Finbar picked by number:
   hero 76, gallery 29 (scattered polaroids), reviews 44 scattering into 42,
   services 22, why 34 (the big number counts up), testimonials 29, blog on the
   arch design that used to be the gallery, faq 27, cta 43, footer 33.

   No preloader: the page arrives and staggers itself in (the Hero calls
   markIntroDone once fonts are ready, which is what the nav and the word
   reveals wait on).

   Order is his: the work leads, then the proof, then what we offer. The gap
   between sections is set once in qpi-site.css (.qpi-page) so the whole page
   breathes at one rhythm rather than each section guessing. */
export default function Home() {
  return (
    <main className="qpi-page bg-white">
      <Nav showLogo />
      <Hero />
      <Gallery />
      <Reviews />
      <Services />
      <Why />
      <Testimonials />
      <Blog />
      <Faq />
      <Cta />
      <Footer />
    </main>
  );
}
