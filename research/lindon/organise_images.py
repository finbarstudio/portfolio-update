#!/usr/bin/env python3
"""Reorganise images into per-project folders using each project's scraped page.

For every content/project/<name>.md we extract the gallery image paths
(wp-content/uploads/...), drop the resized thumbnails (-WxH) and theme assets,
then copy the full-size originals out of site_mirror into images/<name>/.

Anything in the mirror's uploads that no project claims is copied into
images/_unsorted/ so nothing is lost.
"""
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
PROJECT_MD = ROOT / "content" / "project"
UPLOADS = ROOT / "site_mirror" / "lindonhomes.com.au" / "wp-content" / "uploads"
OUT = ROOT / "images"

THUMB = re.compile(r"-\d+x\d+\.(jpg|jpeg|png|webp|gif)$", re.I)
UPLOAD_REF = re.compile(r"wp-content/uploads/([^)\s]+\.(?:jpg|jpeg|png|webp|gif))", re.I)

def base_name(path: str) -> str:
    """Strip the -WxH thumbnail suffix to get the original filename."""
    return THUMB.sub(lambda m: "." + m.group(1), path)

# Wipe old year-based structure, rebuild fresh
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

claimed = set()  # relative paths under uploads/ that got assigned to a project
summary = []

for md in sorted(PROJECT_MD.glob("*.md")):
    name = md.stem
    text = md.read_text(encoding="utf-8", errors="ignore")

    refs = UPLOAD_REF.findall(text)
    # normalise each to its full-size original, dedupe, keep order
    seen, originals = set(), []
    for r in refs:
        orig = base_name(r)
        if orig in seen:
            continue
        seen.add(orig)
        originals.append(orig)

    if not originals:
        continue

    dest = OUT / name
    copied = 0
    for rel in originals:
        src = UPLOADS / rel
        # if the exact original isn't on disk, fall back to any size variant
        if not src.exists():
            cand = list(UPLOADS.glob(re.sub(r"\.(jpg|jpeg|png|webp|gif)$",
                                            r"-*x*.\1", rel, flags=re.I)))
            if cand:
                src = max(cand, key=lambda p: p.stat().st_size)
            else:
                continue
        dest.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest / src.name)
        claimed.add(rel)
        copied += 1
    summary.append((name, copied))

# Everything not claimed -> _unsorted (full-size only, skip thumbnails)
unsorted_dir = OUT / "_unsorted"
unsorted_count = 0
for src in UPLOADS.rglob("*"):
    if not src.is_file():
        continue
    if src.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        continue
    if THUMB.search(src.name):
        continue
    rel = str(src.relative_to(UPLOADS))
    if rel in claimed:
        continue
    unsorted_dir.mkdir(parents=True, exist_ok=True)
    # avoid name clashes by prefixing year/month
    parts = src.relative_to(UPLOADS).parts
    prefix = "-".join(parts[:-1])
    dest_name = f"{prefix}-{src.name}" if prefix else src.name
    shutil.copy2(src, unsorted_dir / dest_name)
    unsorted_count += 1

print("Per-project image counts:")
for name, n in summary:
    print(f"  {n:3d}  {name}")
print(f"\nUnsorted (no project match): {unsorted_count}")
print(f"Total projects with images: {len([s for s in summary if s[1]])}")
