#!/usr/bin/env python3
"""Verify Chapter Two's approved public placement and retained source integrity."""

from pathlib import Path
import json
import re

ROOT = Path(".")
CHAPTER_TOKEN = "kaikai-final-chapter"
CHAPTER_ID = "kaikai-chapter-two-20260829"

localized_pages = [
    ROOT / "hearing-records/prison-watch/kaikai-final-chapter/index.html",
    ROOT / "hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/index.html",
    ROOT / "en/hearing-records/prison-watch/kaikai-final-chapter/index.html",
    ROOT / "ja/hearing-records/prison-watch/kaikai-final-chapter/index.html",
]
for path in localized_pages:
    if not path.is_file():
        raise SystemExit(f"Published Chapter Two source is missing: {path}")
    source = path.read_text(encoding="utf-8")
    robots = re.search(r'<meta\\s+name=["\\\']robots["\\\']\\s+content=["\\\']([^"\\\']+)', source, re.I)
    if "data-cpa-chapter-two-hold" not in source or not robots or "noindex" not in robots.group(1).lower():
        raise SystemExit(f"Chapter Two must remain noindex: {path}")

bulletins = json.loads((ROOT / "data/latest-bulletins.json").read_text(encoding="utf-8"))
pinned_ids = [item.get("id") for item in bulletins.get("pinned", [])]
item_ids = [item.get("id") for item in bulletins.get("items", [])]
if pinned_ids.count(CHAPTER_ID) != 1:
    raise SystemExit("Chapter Two must appear exactly once in pinned bulletins")
if item_ids.count(CHAPTER_ID) != 0:
    raise SystemExit("Chapter Two must not duplicate the pinned bulletin in items")
for ids, section in ((pinned_ids, "pinned"), (item_ids, "items")):
    if ids.count("kaikai-chapter-one-20260828") != 1:
        raise SystemExit(f"Chapter One must remain exactly once in {section}")

homepage = (ROOT / "index.html").read_text(encoding="utf-8")
if CHAPTER_TOKEN not in homepage:
    raise SystemExit("Chapter Two public entry is missing from index.html")

# Chapter Two is publicly reachable from the homepage but intentionally noindex;
# sitemap generation must therefore continue to omit it.
if CHAPTER_TOKEN in (ROOT / "sitemap.xml").read_text(encoding="utf-8"):
    raise SystemExit("Noindex Chapter Two must not appear in sitemap.xml")

medical = ROOT / "hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/index.html"
medical_source = medical.read_text(encoding="utf-8")
for token in ('id="clinics"', 'id="cai-hanyu"'):
    if token not in medical_source:
        raise SystemExit(f"Retained medical testimony is incomplete: missing {token}")

print("Chapter Two public placement and retained source integrity are verified.")
