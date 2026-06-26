#!/usr/bin/env bash
# trace-logo.sh — download a raster (or SVG) logo and produce a clean monochrome
# SVG traced with potrace, fill set to currentColor so it inherits CSS colour.
#
# Usage: scripts/trace-logo.sh <url-or-file> <out.svg> [threshold%] [negate]
#   threshold default 55%. Pass "negate" as 4th arg for light-on-dark logos.
#
# Pipeline: fetch -> flatten on white -> grayscale -> contrast/threshold to pure
# B/W bitmap (hi-res for crisp edges) -> potrace -> SVG -> recolour currentColor.
set -euo pipefail

SRC="${1:?source url or file}"
OUT="${2:?output svg path}"
THRESH="${3:-55}"
NEGATE="${4:-}"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
RAW="$TMP/raw"
BMP="$TMP/logo.pbm"

# 1. Fetch (browser UA dodges naive bot blocks). Local files are copied.
if [[ "$SRC" =~ ^https?:// ]]; then
  curl -fsSL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" "$SRC" -o "$RAW"
else
  cp "$SRC" "$RAW"
fi

# 2. Already SVG? just normalise the fill to currentColor and keep the vector.
if head -c 600 "$RAW" | grep -qi "<svg"; then
  sed -E 's/fill="#?[0-9a-fA-F]{3,8}"/fill="currentColor"/g; s/fill:#[0-9a-fA-F]{3,8}/fill:currentColor/g' "$RAW" > "$OUT"
  echo "passthrough-svg $OUT"
  exit 0
fi

# 3. Raster -> high-res pure black/white bitmap for potrace.
#    Transparent logos (the common case) are traced from their ALPHA channel so
#    we capture the silhouette regardless of the logo's colour. Opaque logos are
#    traced from luminance; if the artwork is light-on-dark we auto-negate so the
#    ink ends up black for potrace.
OPAQUE="$(magick identify -format '%[opaque]' "$RAW" 2>/dev/null || echo true)"
MODE="${MODE:-auto}"

if { [[ "$MODE" == "auto" && "$OPAQUE" == "False" ]] || [[ "$MODE" == "alpha" ]]; }; then
  magick "$RAW" -alpha extract -resize 2400x -unsharp 0x1 -threshold "${THRESH}%" "$BMP"
else
  NEG=""
  if [[ "$NEGATE" == "negate" ]]; then
    NEG="-negate"
  elif [[ "$MODE" == "auto" ]]; then
    MEAN="$(magick "$RAW" -background white -flatten -colorspace Gray -format '%[fx:mean]' info: 2>/dev/null || echo 1)"
    awk "BEGIN{exit !($MEAN < 0.5)}" && NEG="-negate"   # dark overall -> light-on-dark -> negate
  fi
  magick "$RAW" -background white -flatten $NEG \
    -colorspace Gray -resize 2400x -unsharp 0x1 \
    -threshold "${THRESH}%" "$BMP"
fi

# 4. Trace. -s = SVG, smoothing + speckle suppression for clean curves.
potrace "$BMP" -s --flat -t 8 -a 1.0 -O 0.3 -o "$TMP/out.svg"

# 5. Recolour to currentColor + drop fixed width/height so it scales to its box.
sed -E 's/fill="#000000"/fill="currentColor"/g; s/ (width|height)="[0-9.]+(pt|px)?"//g' "$TMP/out.svg" > "$OUT"

echo "traced $OUT ($(wc -c < "$OUT") bytes)"
