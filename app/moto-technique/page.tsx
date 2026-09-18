import content from "@/content/moto-technique";
import Hero from "@/components/moto-technique/sections/Hero";
import Sale from "@/components/moto-technique/sections/Sale";
import Restomods from "@/components/moto-technique/sections/Restomods";
import Disciplines from "@/components/moto-technique/sections/Disciplines";
import Workshop from "@/components/moto-technique/sections/Workshop";
import Testimonials from "@/components/moto-technique/sections/Testimonials";
import Contact from "@/components/moto-technique/sections/Contact";

/**
 * The home page is a composition, nothing more. Every string and photograph
 * comes from content/moto-technique.ts, so the page changes when the content
 * changes: reorder the hero, add a car, swap a discipline.
 */
export default function MotoTechniqueHome() {
  const { hero, marks, sale, restomod, disciplines, workshop, testimonials, contact, site } = content;

  return (
    <main id="top">
      <Hero slides={hero} marks={marks} name={site.name} />
      <Sale sale={sale} />
      <Restomods restomod={restomod} />
      <Disciplines disciplines={disciplines} />
      <Workshop workshop={workshop} />
      <Testimonials testimonials={testimonials} />
      <Contact contact={contact} name={site.name} established={site.established} />
    </main>
  );
}
