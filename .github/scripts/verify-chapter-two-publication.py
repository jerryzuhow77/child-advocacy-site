#!/usr/bin/env python3
"""Verify Chapter Two's formal publication contract and retained source integrity."""

from pathlib import Path
from xml.etree import ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urljoin
import json
import re

ROOT = Path(".")
BASE_URL = "https://jerryzuhow77.github.io/child-advocacy-site/"
CHAPTER_ID = "kaikai-chapter-two-20260829"

localized_pages = [
    ROOT / "hearing-records/prison-watch/kaikai-final-chapter/index.html",
    ROOT / "hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/index.html",
    ROOT / "en/hearing-records/prison-watch/kaikai-final-chapter/index.html",
    ROOT / "ja/hearing-records/prison-watch/kaikai-final-chapter/index.html",
]
robots_index_re = re.compile(
    r'<meta\b[^>]*\bname=["\']robots["\'][^>]*\bcontent=["\'][^"\']*index\s*,\s*follow|'
    r'<meta\b[^>]*\bcontent=["\'][^"\']*index\s*,\s*follow[^"\']*["\'][^>]*\bname=["\']robots["\']',
    re.IGNORECASE,
)
robots_noindex_re = re.compile(
    r'<meta\b[^>]*\bname=["\']robots["\'][^>]*\bcontent=["\'][^"\']*noindex|'
    r'<meta\b[^>]*\bcontent=["\'][^"\']*noindex[^"\']*["\'][^>]*\bname=["\']robots["\']',
    re.IGNORECASE,
)
for path in localized_pages:
    if not path.is_file():
        raise SystemExit(f"Published Chapter Two source is missing: {path}")
    source = path.read_text(encoding="utf-8")
    if not robots_index_re.search(source) or robots_noindex_re.search(source):
        raise SystemExit(f"Formally published Chapter Two must be index, follow: {path}")

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

class HomepageLinks(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.hrefs = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        if tag == 'a' and 'href' in dict(attrs):
            self.hrefs.append(dict(attrs)['href'])


for locale in ('', 'en/', 'ja/'):
    path = ROOT / locale / 'index.html'
    source = path.read_text(encoding="utf-8")
    expected = BASE_URL + locale + 'hearing-records/prison-watch/kaikai-final-chapter/'
    if expected not in {urljoin(BASE_URL + locale, href).split('#', 1)[0].split('?', 1)[0]
                        for href in HomepageLinks(source).hrefs}:
        raise SystemExit(f"Chapter Two public entry is missing from {path}")

expected_urls = {
    BASE_URL + "hearing-records/prison-watch/kaikai-final-chapter/",
    BASE_URL + "hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/",
    BASE_URL + "en/hearing-records/prison-watch/kaikai-final-chapter/",
    BASE_URL + "ja/hearing-records/prison-watch/kaikai-final-chapter/",
}
tree = ET.parse(ROOT / "sitemap.xml")
namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
sitemap_urls = [
    (node.text or "").strip()
    for node in tree.findall("sm:url/sm:loc", namespace)
]
for url in expected_urls:
    if sitemap_urls.count(url) != 1:
        raise SystemExit(f"Formally published Chapter Two URL must appear exactly once in sitemap.xml: {url}")

medical = ROOT / "hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/index.html"
medical_source = medical.read_text(encoding="utf-8")
for token in ('id="clinics"', 'id="cai-hanyu"'):
    if token not in medical_source:
        raise SystemExit(f"Retained medical testimony is incomplete: missing {token}")

print("Chapter Two formal publication and retained source integrity are verified.")
