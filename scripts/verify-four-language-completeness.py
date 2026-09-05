#!/usr/bin/env python3
"""Check public locale coverage and full-record structural preservation."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
BASE = '/child-advocacy-site/'
LOCALES = {'zh-Hant', 'zh-Hans', 'en', 'ja'}
routes = json.loads((ROOT / 'data/four-language-routes.json').read_text())['routes']
errors = []
physical = set()

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = set()
        self.lang = ''
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if tag == 'html':
            self.lang = attrs.get('lang', '')

def read(url):
    path = ROOT / urlsplit(url).path.removeprefix(BASE) / 'index.html'
    return path, path.read_text(encoding='utf-8')

for route, editions in routes.items():
    if set(editions) != LOCALES:
        errors.append(f'{route}: missing locales {LOCALES-set(editions)}')
    for locale, url in editions.items():
        path, text = read(url)
        physical.add(path)
        doc = Document(text)
        if not urlsplit(url).query and doc.lang != locale:
            errors.append(f'{path.relative_to(ROOT)}: expected lang={locale}, got {doc.lang}')
        if urlsplit(url).query and locale == 'zh-Hans' and 'assets/site.js' not in text and 'data-hans' not in text:
            errors.append(f'{route}: query-language route lacks a converter')
        for marker in ('data-cpa-four-language-toolbar-style', 'data-cpa-four-language-toolbar-flag', 'data-cpa-four-language-toolbar-script'):
            if marker not in text:
                errors.append(f'{path.relative_to(ROOT)}: missing {marker}')
        for alternate in LOCALES:
            if f'hreflang="{alternate}"' not in text:
                errors.append(f'{path.relative_to(ROOT)}: missing alternate {alternate}')

# These formerly missing or summary-only editions must retain every source
# section/record anchor. Translations may add accessible controls, never omit IDs.
full_routes = [
    'activity-records/20260825-111-surplus-donation/',
    'cases/kaikai/a4-dossier/', 'cases/luo-brothers/',
    'cases/tucheng-domestic-violence-double-homicide/',
    'features/social-observation/guarantor-status/',
    'hearing-records/tucheng-domestic-violence-double-homicide-20260821/',
    'hearing-records/prison-watch/kaikai-final-chapter/',
    'hearing-records/prison-watch/kaikai-final-chapter/witnesses/',
] + [f'hearing-records/prison-watch/kaikai-day{day}-{date}/' for day,date in [(6,'20250430'),(7,'20250502'),(8,'20250505'),(9,'20250506'),(10,'20250507')]]
for route in full_routes:
    editions = routes[route]
    _, source = read(editions['zh-Hant'])
    required = Document(source).ids
    for locale in ('en', 'ja'):
        if locale not in editions:
            continue
        path, text = read(editions[locale])
        missing = required - Document(text).ids
        if missing:
            errors.append(f'{path.relative_to(ROOT)}: omitted source anchors {sorted(missing)}')
        if re.search(r'A complete English translation is not currently published|Chapter Two remains unpublished|第2章は未公開です', text):
            errors.append(f'{path.relative_to(ROOT)}: stale summary/publication notice')

if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(routes)} four-language route groups; {len(physical)} physical public pages; full-record anchors preserved.')
