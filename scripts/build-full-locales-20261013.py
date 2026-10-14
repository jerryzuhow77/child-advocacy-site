#!/usr/bin/env python3
"""Build complete editions from reviewable paragraph translations; fail on gaps."""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from bs4 import BeautifulSoup, Comment, Doctype
from opencc import OpenCC

ROOT = Path(__file__).resolve().parents[1]
BASE = '/child-advocacy-site/'
TW = 'https://jerryzuhow77.github.io'
LOCALES = ('zh-Hant', 'zh-Hans', 'en', 'ja')
TABLE = ROOT / 'scripts/full-locales-20261013.tsv'
parser = argparse.ArgumentParser()
parser.add_argument('routes', nargs='*')
args = parser.parse_args()
if not args.routes:
    args.routes = json.loads((ROOT / 'scripts/full-locales-routes-20261013.json').read_text())
words = {}
for line in TABLE.read_text().splitlines():
    if not line.strip():
        continue
    zh, en, ja = line.split('\t')
    if zh in words and words[zh] != {'en': en, 'ja': ja}:
        raise SystemExit('Conflicting translation: ' + zh)
    words[zh] = {'en': en, 'ja': ja}
manifest_path = ROOT / 'data/four-language-routes.json'
manifest = json.loads(manifest_path.read_text())
pending = {}

def local_path(url):
    return ROOT / urlsplit(url).path.removeprefix(BASE) / 'index.html'

def full_url(url):
    return url if url.startswith('http') else TW + url

def update_head(text, editions, locale):
    text = re.sub(r'<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*\bhreflang=)[^>]*>\s*', '', text)
    text = re.sub(r'(<link\b(?=[^>]*\brel=["\']canonical["\'])[^>]*\bhref=)["\'][^"\']*["\']', lambda m: m[1] + '"' + full_url(editions[locale]) + '"', text)
    links = '\n'.join(f'<link rel="alternate" hreflang="{l}" href="{full_url(u)}">' for l, u in editions.items())
    if not re.search(r'<link\b[^>]*\brel=["\']canonical["\']', text):
        links += f'\n<link rel="canonical" href="{full_url(editions[locale])}">'
    return text.replace('</head>', links + '\n</head>', 1)

for route in args.routes:
    route = route.rstrip('/') + '/'
    editions = manifest['routes'][route]
    if 'zh-Hant' not in editions:
        raise SystemExit('A source/regional-equivalence decision is required for ' + route)
    source = local_path(editions['zh-Hant']).read_text()
    source_url = TW + BASE + route
    new_hans = 'zh-Hans' not in editions
    if new_hans:
        editions['zh-Hans'] = 'https://cn.globalprotectionwall.com' + BASE + route + 'zh-Hans/'
    for locale in ('en', 'ja'):
        expected = BASE + locale + '/' + route
        if locale in editions and editions[locale] != expected:
            raise SystemExit('Refusing to overwrite an existing edition: ' + route + locale)
        editions[locale] = expected
    for locale in (('zh-Hans', 'en', 'ja') if new_hans else ('en', 'ja')):
        soup = BeautifulSoup(source, 'html.parser')
        soup.html['lang'] = locale
        converter = OpenCC('t2s') if locale == 'zh-Hans' else None
        missing = set()
        for node in soup.find_all(string=True):
            if isinstance(node, (Comment, Doctype)) or node.parent.name in ('script', 'style'):
                continue
            raw = str(node)
            value = re.sub(r'\s+', ' ', raw.strip())
            if converter:
                node.replace_with(converter.convert(raw))
            elif value in words:
                node.replace_with(raw[:len(raw)-len(raw.lstrip())] + words[value][locale] + raw[len(raw.rstrip()):])
            elif re.search('[\u3400-\u9fff]', value):
                missing.add(value)
        for tag in soup.find_all(True):
            for attr in ('alt', 'title', 'aria-label', 'placeholder', 'content'):
                value = tag.get(attr)
                if converter and isinstance(value, str):
                    tag[attr] = converter.convert(value)
                elif isinstance(value, str) and value in words:
                    tag[attr] = words[value][locale]
                elif isinstance(value, str) and re.search('[\u3400-\u9fff]', value):
                    missing.add(value)
            for attr in ('href', 'src', 'poster'):
                value = tag.get(attr, '')
                if value and not value.startswith(('#', '/', 'https:', 'http:', 'data:', 'mailto:', 'tel:')):
                    url = urlsplit(urljoin(source_url, value))
                    tag[attr] = url.path + ('?' + url.query if url.query else '') + ('#' + url.fragment if url.fragment else '')
            if tag.name == 'meta' and tag.get('property') == 'og:url':
                tag['content'] = full_url(editions[locale])
        # Relative CSS image URLs must still resolve to the original media.
        for style in soup.find_all('style'):
            raw = style.string or ''
            def css_url(m):
                value = m[2]
                if value.startswith(('/', 'http:', 'https:', 'data:')):
                    return m[0]
                return 'url(' + m[1] + urlsplit(urljoin(source_url, value)).path + m[1] + ')'
            style.string = re.sub(r'url\((["\']?)([^)"\']+)\1\)', css_url, raw)
        if missing:
            raise SystemExit(f'{route} {locale}: untranslated text/attributes:\n' + '\n'.join(sorted(missing)))
        # English headings contain long unbroken words at narrow phone widths.
        if locale == 'en':
            style = soup.new_tag('style', attrs={'data-cpa-translated-layout': ''})
            style.string = 'html[lang="en"] h1,html[lang="en"] .wrap{overflow-wrap:anywhere}html[lang="en"] .hero h1{font-size:clamp(2rem,5.6vw,5rem)}html[lang="en"] .hero>div,html[lang="en"] .tree-node,html[lang="en"] .spine-card,html[lang="en"] .audit-card{min-width:0}'
            soup.head.append(style)
        pending[local_path(editions[locale])] = update_head(str(soup), editions, locale)
    # Preserve the two already published Chinese bodies byte for byte.
    for locale in ('zh-Hant', 'zh-Hans'):
        if locale == 'zh-Hans' and new_hans:
            continue
        path = local_path(editions[locale])
        pending[path] = update_head(path.read_text(), editions, locale)
for path, text in pending.items():
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    print('Built', path.relative_to(ROOT))
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, separators=(',', ':')) + '\n')
