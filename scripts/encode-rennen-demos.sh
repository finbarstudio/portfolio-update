#!/bin/zsh
# Encode Finbar's Rennen Plus screen recordings for the case study.
#   scripts/encode-rennen-demos.sh            # every "* Demo*.mp4" on the Desktop
# Output: public/images/rennen-plus/demos/<slug>.mp4, H.264, 1280 wide, no audio,
# faststart. H.264 beat VP9 and AV1 on size for these clips (tested 18 Sep 2026)
# and is Safari's most reliable path, so there is no WebM. A newer recording of
# the same demo ("Grid Demo Better") wins over an older one ("Grid Demo").
# Landing loses its last second (Finbar's note). Full-screen recordings on the
# MacBook carry a 66px black notch strip at the top; it is cropped when present.
set -e
FF=/opt/homebrew/bin/ffmpeg; FP=/opt/homebrew/bin/ffprobe
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/images/rennen-plus/demos"; mkdir -p "$OUT"
slug() { case "${1:l}" in
  *landing*) echo landing;; *grid*) echo grid;; *journey*) echo journey;; *search*) echo search;; *car\ page*) echo car-page;;
  *material*|*price*|*option*) echo material;; *menu*) echo menu;; *ai*|*assistant*|*ask*) echo assistant;;
  *consult*) echo consult;; *dealer*) echo dealers;; *build*) echo builds;; *phone*|*mobile*) echo phone;;
  *) echo "";; esac }
typeset -A newest
for f in ~/Desktop/*Demo*.mp4(N); do
  s=$(slug "$(basename "$f" .mp4)"); [[ -z "$s" ]] && { echo "skip (no mapping): $f"; continue; }
  if [[ -z "${newest[$s]}" || "$f" -nt "${newest[$s]}" ]]; then newest[$s]="$f"; fi
done
for s f in ${(kv)newest}; do
  dst="$OUT/$s.mp4"
  [[ -f "$dst" && "$dst" -nt "$f" ]] && { echo "up to date: $s"; continue; }
  d=$($FP -v error -show_entries format=duration -of csv=p=0 "$f")
  t=$d; [[ "$s" == landing ]] && t=$(( d - 1.0 ))
  top=$($FF -v error -ss 2 -i "$f" -frames:v 1 -vf "crop=iw:60:0:0,scale=1:1" -f rawvideo -pix_fmt gray - | xxd -p)
  crop=""; [[ "$top" == "00" ]] && crop="crop=iw:ih-66:0:66,"
  $FF -v error -y -i "$f" -t $t -an -vf "${crop}scale=1280:-2:flags=lanczos,fps=30" -c:v libx264 -crf 28 -preset veryslow -g 60 -pix_fmt yuv420p -movflags +faststart "$dst"
  printf "%-10s %5.1fs  %4d KB  <- %s\n" $s $t $(( $(stat -f %z "$dst") / 1024 )) "$(basename "$f")"
done
