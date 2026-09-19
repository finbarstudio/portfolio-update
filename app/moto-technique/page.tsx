import content from "@/content/moto-technique";
import Hero from "@/components/moto-technique/sections/Hero";
import Why from "@/components/moto-technique/sections/Why";
import Services from "@/components/moto-technique/sections/Services";
import Shelf from "@/components/moto-technique/sections/Shelf";
import Footer from "@/components/moto-technique/sections/Footer";

/**
 * The home page is a composition, nothing more. Every string and photograph
 * comes from content/moto-technique.ts, so the page changes when the content
 * changes: reorder the hero, add a project, swap a service.
 *
 * Four beats and a footer: the car, why them, what they have done, what they
 * do. The footer is outside <main>, where a page footer belongs. It needs no
 * help stacking over the pinned hero, because a pinned element cannot leave its
 * parent: the hero lets go when <main> ends.
 */
export default function MotoTechniqueHome() {
  const { hero, heroMark, marks, why, services, projects, sale, contact, site } = content;

  return (
    <>
      <main id="top">
        <Hero slides={hero} title={heroMark} marks={marks} sale={sale} h1={site.h1} />
        <Why why={why} />
        <Shelf projects={projects} />
        <Services services={services} />
      </main>
      <Footer contact={contact} name={site.name} established={site.established} />
    </>
  );
}
