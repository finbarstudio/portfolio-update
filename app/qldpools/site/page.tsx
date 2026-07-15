import Nav from "@/components/qldpools/Nav";
import Preloader from "@/components/qldpools/Preloader";
import Hero from "@/components/qldpools/sections/Hero";
import Reviews from "@/components/qldpools/sections/Reviews";
import Services from "@/components/qldpools/sections/Services";
import Gallery from "@/components/qldpools/sections/Gallery";
import Testimonials from "@/components/qldpools/sections/Testimonials";
import Blog from "@/components/qldpools/sections/Blog";
import Footer from "@/components/qldpools/sections/Footer";

/* QLD Pool Installs demo, assembled from the options Finbar picked:
   hero 76 (arch on white, with the preloader's cutout zooming out into it),
   reviews 15, services 2, gallery 17, testimonials 16, blog 8, footer 4.

   Still to slot in once he picks from the newer batches: Why choose us (he is
   reviewing the horizontal-grid set, 26-35), FAQ and the contact CTA. Their
   real page order is hero > reviews > services > why > gallery > testimonials
   > blog > faq > cta > footer, so those drop straight into the gaps. */
export default function Home() {
  return (
    <main className="bg-white">
      <Preloader />
      <Nav showLogo />
      <Hero />
      <Reviews />
      <Services />
      <Gallery />
      <Testimonials />
      <Blog />
      <Footer />
    </main>
  );
}
