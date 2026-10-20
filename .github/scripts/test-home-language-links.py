#!/usr/bin/env python3
"""Keep explicit homepage language switches distinct from content localization."""
import re
import runpy
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[2]
SYNC = runpy.run_path(str(ROOT / '.github/scripts/sync-four-language-toolbar.py'))
BASE = '/child-advocacy-site/'
TW = 'https://jerryzuhow77.github.io'
HK = 'https://cn.globalprotectionwall.com'
ROUTES = {'': {'zh-Hant': BASE, 'zh-Hans': HK + BASE + '?lang=zh-Hans',
               'en': BASE + 'en/', 'ja': BASE + 'ja/'}}


class Links(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.links = []
        self.current = None
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.current = [dict(attrs).get('href'), '']

    def handle_data(self, text):
        if self.current is not None:
            self.current[1] += text

    def handle_endtag(self, tag):
        if tag == 'a' and self.current is not None:
            self.links.append(tuple(self.current))
            self.current = None


class HomeLanguageLinksTests(unittest.TestCase):
    def localize(self, source, locale):
        path = ROOT / (locale + '/' if locale in ('en', 'ja') else '') / 'index.html'
        document = source if '<html' in source else f'<html lang="{locale}">{source}</html>'
        return SYNC['localize_links'](path, document, ROUTES)

    def test_explicit_language_switches_survive_sync_twice(self):
        for locale in ('zh-Hant', 'zh-Hans', 'en', 'ja'):
            for href in (BASE + 'en/', TW + BASE + 'en/', '//jerryzuhow77.github.io' + BASE + 'en/',
                         BASE + 'en/?source=footer#top', '../en/'):
                with self.subTest(locale=locale, href=href):
                    source = f'<html lang="{locale}"><a href="{href}"><span>English</span></a></html>'
                    result = self.localize(source, locale)
                    self.assertIn(f'href="{href}"', result)
                    self.assertEqual(self.localize(result, locale), result)

    def test_regional_and_marked_language_switches_are_preserved(self):
        source = (f'<a href="{TW + BASE}">台灣官網・繁體中文</a>'
                  f'<a href="{HK + BASE}">香港官網・簡體中文</a>'
                  f'<a href="{BASE}ja/">日本語</a>'
                  f'<a hreflang="en" href="{BASE}en/">English edition</a>')
        for locale in ('en', 'ja', 'zh-Hans'):
            result = self.localize(source, locale)
            self.assertEqual(Links(result).links, Links(source).links)

    def test_ordinary_home_and_article_navigation_still_localizes(self):
        for locale in ('en', 'ja'):
            result = self.localize(f'<a href="{BASE}">Home</a>', locale)
            self.assertEqual(Links(result).links, [(BASE + locale + '/', 'Home')])
            # An article title containing English is not a language switch.
            routes = dict(ROUTES, article={'zh-Hant': BASE + 'article/', locale: BASE + locale + '/article/'})
            path = ROOT / locale / 'index.html'
            result = SYNC['localize_links'](path, f'<html lang="{locale}"><a href="{BASE}article/">English reporting</a>', routes)
            self.assertEqual(Links(result).links, [(BASE + locale + '/article/', 'English reporting')])

    def test_actual_homepage_footer_targets(self):
        for rel in ('index.html', 'en/index.html', 'ja/index.html'):
            with self.subTest(page=rel):
                source = (ROOT / rel).read_text(encoding='utf-8')
                footer = re.search(r'<div class="footer-regions">(.*?)</div>', source, re.S)
                self.assertIsNotNone(footer, 'Regional language links are missing')
                links = Links(footer.group(1)).links
                self.assertEqual(len(links), 4)
                targets = [urlsplit(urljoin(TW + BASE + rel.removesuffix('index.html'), href)) for href, _ in links]
                self.assertEqual((targets[0].netloc, targets[0].path), ('jerryzuhow77.github.io', BASE))
                self.assertEqual((targets[1].netloc, targets[1].path), ('cn.globalprotectionwall.com', BASE))
                self.assertEqual(targets[2].path, BASE + 'en/')
                self.assertEqual(links[2][1].strip(), 'English')
                self.assertEqual(targets[3].path, BASE + 'ja/')
                self.assertEqual(links[3][1].strip(), '日本語')


if __name__ == '__main__':
    unittest.main()
