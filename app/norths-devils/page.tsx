import Collage from "@/components/norths-devils/Collage";
import layout from "@/content/norths-collage.json";
import type { CollagePos } from "@/content/northsCollage";

// One section for now: the Devils take on the Toombul hero collage —
// FS-dithered paraphernalia in club colours around the locked crest.
// Arrange at /norths-devils?edit=1 (same editor, saves to
// content/norths-collage.json).
export default function NorthsDevilsHome() {
  return (
    <>
      <header className="nd-nav">
        <a href="/norths-devils" className="nd-nav-word" aria-label="Norths Devils home">
          Norths Devils
          <small>Rugby League Football Club</small>
        </a>
      </header>
      <main>
        <Collage layout={layout as CollagePos[]} />
      </main>
    </>
  );
}
