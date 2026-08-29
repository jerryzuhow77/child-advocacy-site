from pathlib import Path
import re

index = Path('index.html').read_text(encoding='utf-8')
sitemap = Path('sitemap.xml').read_text(encoding='utf-8')
bulletins = Path('data/latest-bulletins.json').read_text(encoding='utf-8')

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

if bulletins.count('"id":"kaikai-chapter-two-20260829"') != 2:
    raise SystemExit('Chapter 2 must appear exactly once in both pinned and latest bulletin feeds')

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
]
for path in public_surfaces:
    source = Path(path).read_text(encoding='utf-8')
    if 'kaikai-final-chapter' not in source:
        raise SystemExit(f'Chapter 2 public entry is missing from {path}')

required_sitemap_routes = [
    '/hearing-records/prison-watch/kaikai-final-chapter/',
    '/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    '/hearing-records/prison-watch/kaikai-final-chapter/witnesses/',
    '/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/',
]
missing_routes = [route for route in required_sitemap_routes if route not in sitemap]
if missing_routes:
    raise SystemExit(f'Published Chapter 2 routes are missing from sitemap.xml: {missing_routes}')

print('Chapter 2 publication surfaces, five pinned reports, and sitemap discovery are complete.')
