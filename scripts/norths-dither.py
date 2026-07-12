#!/usr/bin/env python3
"""Norths Devils collage dither pipeline.

Reproduces the look of the existing public/norths-devils/dither assets:
two-colour Floyd–Steinberg dither (dark green + gold gradient map),
rendered at half size then scaled 2x nearest-neighbour for chunky 2x2
pixel blocks. Emits three frames per image (x.png, x.b1.png, x.b2.png)
with different noise seeds so the Collage "boil" shimmer has frames to
cycle.

Usage: norths-dither.py <src> <out-dir> <name> [target-width-px]
"""
import sys
import random
from pathlib import Path
from PIL import Image

# club ramp: lifted navy shadows -> sky midtones -> brand gold highlights
NAVY = (23, 52, 110)
SKY = (108, 165, 217)   # --sky #6CA5D9
GOLD = (243, 205, 50)
# grey levels the FS dither quantises to; SKY sits at its own luminance so
# the mid band it claims matches how bright it actually renders
LEVELS = [(0, NAVY), (157, SKY), (255, GOLD)]

_pal = Image.new("P", (1, 1))
_pal.putpalette(sum(([v, v, v] for v, _ in LEVELS), []) + [0] * (768 - 3 * len(LEVELS)))


# steep S-curve before quantising: pushes tones toward the navy/gold ends so
# sky stays an accent in the crossover zone, not the dominant midtone
CONTRAST = 2.4


def dither_frame(gray: Image.Image, alpha: Image.Image, seed: int, noise: int) -> Image.Image:
    gray = gray.point(lambda v: max(0, min(255, round((v - 128) * CONTRAST + 128))))
    rnd = random.Random(seed)
    px = list(gray.getdata())
    if noise:
        px = [max(0, min(255, v + rnd.randint(-noise, noise))) for v in px]
    g = Image.new("L", gray.size)
    g.putdata(px)
    q = g.convert("RGB").quantize(palette=_pal, dither=Image.Dither.FLOYDSTEINBERG)
    colours = [c for _, c in LEVELS]
    out = Image.new("RGBA", gray.size)
    out.putdata([
        (*colours[i], a)
        for i, a in zip(q.getdata(), alpha.getdata())
    ])
    return out


def main() -> None:
    src, out_dir, name = sys.argv[1], Path(sys.argv[2]), sys.argv[3]
    target_w = int(sys.argv[4]) if len(sys.argv) > 4 else 620

    im = Image.open(src).convert("RGBA")
    half_w = target_w // 2
    half_h = round(im.height * half_w / im.width)
    im = im.resize((half_w, half_h), Image.LANCZOS)
    alpha = im.getchannel("A").point(lambda a: 255 if a >= 128 else 0)
    gray = im.convert("L")
    # normalise tones (opaque pixels only) so every photo sits on the ramp
    vals = [v for v, a in zip(gray.getdata(), alpha.getdata()) if a]
    lo, hi = (min(vals), max(vals)) if vals else (0, 255)
    if hi > lo:
        gray = gray.point(lambda v: max(0, min(255, (v - lo) * 255 // (hi - lo))))

    for suffix, seed, noise in ((".png", 1, 0), (".b1.png", 2, 7), (".b2.png", 3, 7)):
        frame = dither_frame(gray, alpha, seed, noise)
        frame = frame.resize((half_w * 2, half_h * 2), Image.NEAREST)
        frame.save(out_dir / f"{name}{suffix}")
    print(f"{name}: {half_w * 2}x{half_h * 2}")


if __name__ == "__main__":
    main()
