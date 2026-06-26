#!/usr/bin/env bash
# Sharpen web imagery with a gentle unsharp mask and re-encode.
# Resizing photos down for the web softens them; this restores crispness.
# Usage:
#   scripts/sharpen-images.sh public/a-rolley/projects        # a whole folder
#   scripts/sharpen-images.sh public/foo/a.webp public/foo/b.jpg   # specific files
# Operates in place. Run ONCE per asset (repeated lossy re-encodes degrade).
set -euo pipefail
shopt -s nullglob nocaseglob

# ImageMagick 7 (magick) preferred; fall back to v6 (convert).
if command -v magick >/dev/null 2>&1; then IM=(magick); else IM=(convert); fi

sharpen() {
  local f="$1"
  # gentle unsharp: radius 0, sigma ~0.8, amount 0.7, threshold 0.005
  "${IM[@]}" "$f" -strip -unsharp 0x0.8+0.7+0.005 -quality 86 "$f"
  echo "sharpened: $f"
}

[ "$#" -gt 0 ] || { echo "usage: $0 <dir-or-file> [...]" >&2; exit 1; }

for arg in "$@"; do
  if [ -d "$arg" ]; then
    for f in "$arg"/*.webp "$arg"/*.jpg "$arg"/*.jpeg "$arg"/*.png; do sharpen "$f"; done
  elif [ -f "$arg" ]; then
    sharpen "$arg"
  else
    echo "skip (not found): $arg" >&2
  fi
done
