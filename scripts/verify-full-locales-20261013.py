#!/usr/bin/env python3
"""Check full translated records, source URLs, media and reciprocal metadata."""
import json
import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from bs4 import BeautifulSoup, Comment, Doctype

ROOT = Path(__file__).resolve().parents[1]
BASE = '/child-advocacy-site/'
TW = 'https://jerryzuhow77.github.io'
routes = json.loads((ROOT / 'data/four-language-routes.json').read_text())['routes']
words = {}
for line in (ROOT / 'scripts/full-locales-20261013.tsv').read_text().splitlines():
    zh, en, ja = line.split('\t')
    words[zh] = {'en': en, 'ja': ja}

def read(url):
    return BeautifulSoup((ROOT / urlsplit(url).path.removeprefix(BASE) / 'index.html').read_text(), 'html.parser')

def texts(soup):
    return [str(n).strip() for n in soup.find_all(string=True)
            if not isinstance(n, (Comment, Doctype)) and n.parent.name not in ('script', 'style') and str(n).strip()]

def urls(soup, base, selector, attr):
    return [urljoin(base, t[attr]) for t in soup.select(selector)]

for route in sys.argv[1:] or json.loads((ROOT / 'scripts/full-locales-routes-20261013.json').read_text()):
    route = route.rstrip('/') + '/'
    editions = routes[route]
    assert set(editions) == {'zh-Hant', 'zh-Hans', 'en', 'ja'}, route
    source = read(editions['zh-Hant'])
    base = TW + BASE + route
    ids = [t['id'] for t in source.select('[id]')]
    structure = [t.name for t in source.select('main,section,article,p,li,blockquote,figure,img,video,audio,source,h1,h2,h3,table,tr,td,dt,dd,time')]
    for locale in ('en', 'ja'):
        soup = read(editions[locale])
        expected = [words.get(re.sub(r'\s+', ' ', t), {}).get(locale, t) for t in texts(source)]
        assert texts(soup) == expected, (route, locale, 'omitted/reordered/changed paragraph')
        assert [t['id'] for t in soup.select('[id]')] == ids, (route, locale, 'anchors')
        assert [t.name for t in soup.select('main,section,article,p,li,blockquote,figure,img,video,audio,source,h1,h2,h3,table,tr,td,dt,dd,time')] == structure, (route, locale, 'structure')
        for selector, attr in [('img[src]', 'src'), ('video[src]', 'src'), ('source[src]', 'src'), ('a[href]', 'href')]:
            assert urls(source, base, selector, attr) == urls(soup, TW + editions[locale], selector, attr), (route, locale, selector)
        for value in texts(soup):
            if locale == 'en':
                assert not re.search('[\u3400-\u9fff]', value), (route, 'untranslated', value)
    for locale, url in editions.items():
        soup = read(url)
        assert soup.html['lang'] == locale, (route, locale, 'lang')
        assert soup.select_one('link[rel="canonical"]')['href'] == (url if url.startswith('http') else TW + url), (route, locale, 'canonical')
        alternates = {t['hreflang']: t['href'] for t in soup.select('link[rel="alternate"][hreflang]')}
        assert alternates == {l: u if u.startswith('http') else TW + u for l, u in editions.items()}, (route, locale, 'reciprocal hreflang')
        for marker in ('style', 'flag', 'script'):
            assert soup.select_one('[data-cpa-four-language-toolbar-' + marker + ']'), (route, locale, marker)
    print('PASS:', route, 'full paragraphs, structure, anchors, links, media and all four reciprocal metadata sets')
incomplete = {r: sorted({'zh-Hant', 'zh-Hans', 'en', 'ja'} - set(e)) for r, e in routes.items() if len(e) != 4}
print('Strict remaining:', len(incomplete), 'groups;', sum(map(len, incomplete.values())), 'missing editions')
