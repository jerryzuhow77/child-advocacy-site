from pathlib import Path
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path('.')
BASE = 'https://jerryzuhow77.github.io/child-advocacy-site'
CHAPTER_ID = 'kaikai-chapter-two-20260829'
NEUTRAL_IMAGE = f'{BASE}/assets/art/kaikai-puppet-stage-20260828.webp'
LOCALE_URLS = {
    'zh-Hant': f'{BASE}/hearing-records/prison-watch/kaikai-final-chapter/',
    'zh-Hans': f'{BASE}/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    'en': f'{BASE}/en/hearing-records/prison-watch/kaikai-final-chapter/',
    'ja': f'{BASE}/ja/hearing-records/prison-watch/kaikai-final-chapter/',
}

index = (ROOT / 'index.html').read_text(encoding='utf-8')
bulletins = json.loads((ROOT / 'data/latest-bulletins.json').read_text(encoding='utf-8'))

required_home_tokens = [
    'specialFeatureChapterTwoZh',
    'home-pinned-report-card is-kaikai-chapter-two',
    'home-document-disc-card is-kaikai-chapter-two',
    'home-crafted-card is-kaikai-chapter-two',
    './hearing-records/prison-watch/kaikai-final-chapter/',
    './hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    '陳尚潔個案責任專區',
]
missing_home = [token for token in required_home_tokens if token not in index]
if missing_home:
    raise SystemExit(f'Chapter 2 publication is incomplete on the homepage: {missing_home}')

if int(bulletins.get('version', 0)) < 8:
    raise SystemExit('The official bulletin feed must be version 8 or later')

for section in ('pinned', 'items'):
    matches = [item for item in bulletins[section] if item.get('id') == CHAPTER_ID]
    if len(matches) != 1:
        raise SystemExit(f'Chapter 2 must appear exactly once in {section}; found {len(matches)}')
    item = matches[0]
    locale_routes = item.get('urlByLocale') or item.get('url')
    if locale_routes != LOCALE_URLS:
        raise SystemExit(f'Chapter 2 locale routes are incomplete in {section}')
    images = item.get('imageByLocale', {})
    if images.get('en') != NEUTRAL_IMAGE or images.get('ja') != NEUTRAL_IMAGE:
        raise SystemExit(f'English and Japanese Chapter 2 cards must use the language-neutral image in {section}')
    if 'zh-Hant' in images.get('en', '') or 'zh-Hant' in images.get('ja', ''):
        raise SystemExit(f'English/Japanese Chapter 2 cards still use Traditional-Chinese art in {section}')

pinned_cards = re.findall(
    r'<a\b[^>]*class="[^"]*\bhome-pinned-report-card\b[^"]*"',
    index,
    flags=re.I,
)
if len(pinned_cards) != 5:
    raise SystemExit(f'Expected five pinned report cards after Chapter 2 publication, found {len(pinned_cards)}')

preserved_pinned_links = [
    'https://jerryzuhow77.github.io/Justice-For-Kaikai/',
    './cases/luo-brothers/',
    './activity-records/20260820-taipei-station-advocacy/',
    './activity-records/20260825-111-surplus-donation/',
]
missing_pinned = [link for link in preserved_pinned_links if link not in index]
if missing_pinned:
    raise SystemExit(f'An existing pinned report was removed: {missing_pinned}')

public_surfaces = [
    'hearing-records/index.html',
    'en/index.html',
    'ja/index.html',
    'en/hearing-records/index.html',
    'ja/hearing-records/index.html',
    'hearing-records/prison-watch/kaikai-day10-20250507/index.html',
    'hearing-records/prison-watch/kaikai-day10-20250507/zh-Hans/index.html',
    'en/hearing-records/prison-watch/kaikai-day10-20250507/index.html',
    'ja/hearing-records/prison-watch/kaikai-day10-20250507/index.html',
]
for path in public_surfaces:
    source = (ROOT / path).read_text(encoding='utf-8')
    if 'kaikai-final-chapter' not in source:
        raise SystemExit(f'Chapter 2 public entry is missing from {path}')

locale_pages = {
    'zh-Hant': ROOT / 'hearing-records/prison-watch/kaikai-final-chapter/index.html',
    'zh-Hans': ROOT / 'hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/index.html',
    'en': ROOT / 'en/hearing-records/prison-watch/kaikai-final-chapter/index.html',
    'ja': ROOT / 'ja/hearing-records/prison-watch/kaikai-final-chapter/index.html',
}
for locale, path in locale_pages.items():
    if not path.is_file():
        raise SystemExit(f'Published Chapter 2 locale page is missing: {locale} ({path})')
    source = path.read_text(encoding='utf-8')
    canonical = re.search(r'<link rel="canonical" href="([^"]+)">', source)
    if not canonical or canonical.group(1) != LOCALE_URLS[locale]:
        raise SystemExit(f'Chapter 2 canonical is wrong for {locale}')
    for alt_locale, url in LOCALE_URLS.items():
        token = f'hreflang="{alt_locale}" href="{url}"'
        if token not in source:
            raise SystemExit(f'Chapter 2 {locale} page is missing hreflang {alt_locale}')

tree = ET.parse(ROOT / 'sitemap.xml')
ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
locations = [node.text for node in tree.findall('.//sm:loc', ns)]
if len(locations) != len(set(locations)):
    raise SystemExit('sitemap.xml contains duplicate URLs')
for url in LOCALE_URLS.values():
    if locations.count(url) != 1:
        raise SystemExit(f'Published Chapter 2 route must occur exactly once in sitemap.xml: {url}')

required_related_routes = [
    f'{BASE}/hearing-records/prison-watch/kaikai-final-chapter/witnesses/',
]
missing_related = [url for url in required_related_routes if locations.count(url) != 1]
if missing_related:
    raise SystemExit(f'Published Chapter 2 related routes are missing or duplicated: {missing_related}')

medical_routes = [
    f'{BASE}/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/',
    f'{BASE}/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/zh-Hans/',
]
leaked_medical_routes = [url for url in medical_routes if url in locations]
if leaked_medical_routes:
    raise SystemExit(f'Unpublished medical subpages must not appear in sitemap.xml: {leaked_medical_routes}')

medical_files = [
    ROOT / 'hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/index.html',
    ROOT / 'hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/zh-Hans/index.html',
]
for path in medical_files:
    source = path.read_text(encoding='utf-8')
    for token in ('id="clinics"', 'id="cai-hanyu"'):
        if token not in source:
            raise SystemExit(f'Retained medical testimony is incomplete in {path}: missing {token}')

medical_entry_surfaces = [
    ROOT / 'index.html',
    ROOT / 'hearing-records/prison-watch/kaikai-final-chapter/index.html',
    ROOT / 'hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/index.html',
    ROOT / 'hearing-records/prison-watch/kaikai-final-chapter/witnesses/index.html',
    ROOT / 'hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/witnesses/index.html',
]
for path in medical_entry_surfaces:
    if 'medical-responsibility' in path.read_text(encoding='utf-8'):
        raise SystemExit(f'Unpublished medical subpage is still linked from {path}')

print('Chapter 2 publication is complete; medical testimony is retained without public Chapter 2 entry points.')
