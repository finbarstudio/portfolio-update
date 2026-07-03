import Collage from "@/components/toombul/Collage";
import layout from "@/content/toombul-collage.json";
import type { CollagePos } from "@/content/toombulCollage";

// Hero collage: the crest + bitmapped cricket paraphernalia, every item
// Floyd-Steinberg dithered and gradient-mapped to the crest's red -> yellow.
// Positions come from toombul-collage.json, arranged with the in-page editor
// at /toombul?edit=1 (drag / resize / rotate, then Save).
export default function Hero() {
  return <Collage layout={layout as CollagePos[]} />;
}
