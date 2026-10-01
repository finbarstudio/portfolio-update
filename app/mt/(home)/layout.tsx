import content from "@/content/moto-technique";
import SmoothScroll from "@/components/moto-technique/SmoothScroll";
import TopBar from "@/components/moto-technique/TopBar";
import ViewCursor from "@/components/moto-technique/ViewCursor";

/**
 * The home page's furniture. A route group, so the URL is still /mt. There is
 * no preloader: the page opens straight on the hero. (The .mt-pre and
 * data-intro rules left in the stylesheet are inert without it.)
 */
export default function MotoTechniqueHomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <ViewCursor />
      <TopBar name={content.site.name} nav={content.site.nav} contact={content.contact} home={content.site.home} />
      {children}
    </>
  );
}
