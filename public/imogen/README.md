# Imogen guide photos

Drop photos in here and they're picked up automatically on the next build / dev
render. **Local photos always take priority over searched ones** — if a match is
found, your photos replace whatever image the page would otherwise show.

## How it works

Make a **folder named after the place or activity** and put the photos inside:

```
public/imogen/
  ha giang loop/      ← a whole stop  → shows at the top of that stop
  lady hill resort/   ← an activity/hostel → shows in that item's detail
  paragliding/
  dinh/
```

The folder name is matched to a stop or an item by name, so just name it close to
what it is ("luang prabang", "paragliding", "lady hill resort"). Put as many
photos in the folder as you like — they all show, in filename order.

If a folder name doesn't obviously match (e.g. "vang vien moped"), add a line to
`PHOTO_ALIASES` in `content/imogen.ts` mapping it to the right stop/item. I've
already wired up the current folders.

## Formats

Use **.jpg / .jpeg / .png / .webp / .avif**. **HEIC and MOV won't display in a
browser** and are ignored — convert HEIC to JPG first (on a Mac: open in Preview →
File → Export → JPEG). Keep them reasonably small (long edge ~1600px is plenty).
