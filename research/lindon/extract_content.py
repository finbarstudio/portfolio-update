#!/usr/bin/env python3
"""Extract clean text/markdown content from the mirrored Lindon Homes HTML.

Walks site_mirror/lindonhomes.com.au/**/index.html, pulls the main copy,
metadata (title, meta description, og tags) and writes one markdown file per
page under content/ mirroring the URL path. Also writes content/_index.json.
"""
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).parent
MIRROR = ROOT / "site_mirror" / "lindonhomes.com.au"
OUT = ROOT / "content"
OUT.mkdir(exist_ok=True)

BASE = "https://lindonhomes.com.au/"

def text_of(el):
    if not el:
        return ""
    for tag in el(["script", "style", "noscript"]):
        tag.decompose()
    txt = el.get_text("\n", strip=True)
    txt = re.sub(r"\n{3,}", "\n\n", txt)
    return txt.strip()

def md_from(el):
    """Lightweight HTML->markdown for headings, paragraphs, lists, links."""
    if not el:
        return ""
    for tag in el(["script", "style", "noscript"]):
        tag.decompose()
    lines = []
    for node in el.descendants:
        pass
    # simpler: iterate block-level
    out = []
    for b in el.find_all(["h1", "h2", "h3", "h4", "p", "li", "blockquote"], recursive=True):
        t = b.get_text(" ", strip=True)
        if not t:
            continue
        name = b.name
        if name == "h1":
            out.append(f"# {t}")
        elif name == "h2":
            out.append(f"## {t}")
        elif name == "h3":
            out.append(f"### {t}")
        elif name == "h4":
            out.append(f"#### {t}")
        elif name == "li":
            out.append(f"- {t}")
        elif name == "blockquote":
            out.append(f"> {t}")
        else:
            out.append(t)
    # dedupe consecutive duplicates
    cleaned = []
    for l in out:
        if cleaned and cleaned[-1] == l:
            continue
        cleaned.append(l)
    return "\n\n".join(cleaned)

index = []
html_files = sorted(MIRROR.rglob("index.html")) + sorted(MIRROR.glob("index.html"))
seen = set()

for f in MIRROR.rglob("*.html"):
    if f in seen:
        continue
    seen.add(f)
    rel = f.relative_to(MIRROR)
    url_path = str(rel.parent) if f.name == "index.html" else str(rel)
    if url_path == ".":
        url_path = ""
    url = BASE + (url_path + "/" if url_path else "")

    try:
        soup = BeautifulSoup(f.read_text(encoding="utf-8", errors="ignore"), "html.parser")
    except Exception as e:
        continue

    title = (soup.title.string.strip() if soup.title and soup.title.string else "")
    def meta(attr, val):
        m = soup.find("meta", attrs={attr: val})
        return m.get("content", "").strip() if m else ""
    desc = meta("name", "description") or meta("property", "og:description")
    og_title = meta("property", "og:title")
    og_image = meta("property", "og:image")
    h1 = text_of(soup.find("h1"))

    # main content container - try common WP containers
    main = (soup.find("main") or soup.find("article") or
            soup.find(attrs={"id": "main"}) or
            soup.find(attrs={"role": "main"}) or
            soup.find("div", class_=re.compile("content|entry|page-content")) or
            soup.body)
    body_md = md_from(main)

    # collect image srcs on page
    imgs = []
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        alt = img.get("alt", "")
        if src:
            imgs.append({"src": src, "alt": alt})

    rec = {
        "url": url,
        "title": title,
        "h1": h1,
        "meta_description": desc,
        "og_title": og_title,
        "og_image": og_image,
        "image_count": len(imgs),
    }
    index.append(rec)

    # write markdown
    safe = url_path if url_path else "home"
    out_file = OUT / (safe + ".md")
    out_file.parent.mkdir(parents=True, exist_ok=True)
    fm = [
        "---",
        f"url: {url}",
        f"title: {json.dumps(title)}",
        f"meta_description: {json.dumps(desc)}",
        f"og_image: {og_image}",
        "---",
        "",
        body_md,
        "",
        "## Images on page",
        "",
    ]
    for im in imgs:
        fm.append(f"- ![{im['alt']}]({im['src']})")
    out_file.write_text("\n".join(fm), encoding="utf-8")

(OUT / "_index.json").write_text(json.dumps(index, indent=2), encoding="utf-8")
print(f"Extracted {len(index)} pages -> {OUT}")
