#!/usr/bin/env python3
"""Verify that retained Chapter Two files have no public discovery surface."""

from pathlib import Path
import json
import re

ROOT = Path(".")
CHAPTER_TOKEN = "kaikai-final-chapter"
CHAPTER_ID = "kaikai-chapter-two-20260829"

retained = [
    ROOT / "hearing-records/prison-watch/kaikai-final-chapter/index.html",
    ROOT / "hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/index.html",
    ROOT / "en/hearing-records/prison-watch/kaikai-final-chapter/index.html",
    ROOT / "ja/hearing-records/prison-watch/kaikai-final-chapter/index.html",
]
for path in retained:
    if not path.is_file():
        raise SystemExit(f"Retained Chapter Two source is missing: {path}")
    source = path.read_text(encoding="utf-8")
    if "data-cpa-chapter-two-hold" not in source:
        raise SystemExit(f"Publication hold marker is missing: {path}")
    robots = re.search(r'<meta\s+name=["\']robots["\']\s+content=["\']([^"\']+)', source, re.I)
    if not robots or "noindex" not in robots.group(1).lower():
        raise SystemExit(f"Chapter Two must remain noindex: {path}")

public_surfaces = [
    "index.html",
    "en/index.html",
    "ja/index.html",
    "hearing-records/index.html",
    "en/hearing-records/index.html",
    "ja/hearing-records/index.html",
    "hearing-records/prison-watch/kaikai-day10-20250507/index.html",
    "hearing-records/prison-watch/kaikai-day10-20250507/zh-Hans/index.html",
    "en/hearing-records/prison-watch/kaikai-day10-20250507/index.html",
    "ja/hearing-records/prison-watch/kaikai-day10-20250507/index.html",
    "features/social-observation/guarantor-status/index.html",
    "features/social-observation/guarantor-status/zh-Hans/index.html",
]
for relative in public_surfaces:
    path = ROOT / relative
    if CHAPTER_TOKEN in path.read_text(encoding="utf-8"):
        raise SystemExit(f"Chapter Two public entry leaked into {relative}")

bulletins = json.loads((ROOT / "data/latest-bulletins.json").read_text(encoding="utf-8"))
for section in ("pinned", "items"):
    ids = [item.get("id") for item in bulletins.get(section, [])]
    if CHAPTER_ID in ids:
        raise SystemExit(f"Chapter Two leaked into bulletin section {section}")
    if ids.count("kaikai-chapter-one-20260828") != 1:
        raise SystemExit(f"Chapter One must remain exactly once in {section}")

if CHAPTER_TOKEN in (ROOT / "sitemap.xml").read_text(encoding="utf-8"):
    raise SystemExit("Chapter Two leaked into sitemap.xml")

medical = ROOT / "hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/index.html"
medical_source = medical.read_text(encoding="utf-8")
for token in ('id="clinics"', 'id="cai-hanyu"'):
    if token not in medical_source:
        raise SystemExit(f"Retained medical testimony is incomplete: missing {token}")

print("Chapter Two publication hold is protected; retained source remains complete.")
