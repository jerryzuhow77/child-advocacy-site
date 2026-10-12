#!/usr/bin/env python3
"""Regress PR #536 locale coverage, navigation and metadata contracts."""
import contextlib
import io
import json
import runpy
import unittest
from html.parser import HTMLParser
from pathlib import Path
from unittest.mock import patch
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
BASE = '/child-advocacy-site/'
TAIWAN = 'https://jerryzuhow77.github.io'
HONG_KONG = 'https://cn.globalprotectionwall.com'
HEARING = 'features/social-observation/liu-zongxin-hearing-20261022/'
OVERVIEW = 'features/social-observation/three-cases-hearings-202610-11/'
MANIFEST = ROOT / 'data/four-language-routes.json'
VERIFIER = ROOT / 'scripts/verify-four-language-completeness.py'


def editions(route):
    return {
        'zh-Hant': TAIWAN + BASE + route,
        'zh-Hans': HONG_KONG + BASE + route + 'zh-Hans/',
        'en': TAIWAN + BASE + 'en/' + route,
        'ja': TAIWAN + BASE + 'ja/' + route,
    }


def page_path(url):
    return ROOT / urlsplit(url).path.removeprefix(BASE) / 'index.html'


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.lang = ''
        self.links = []
        self.anchors = []
        self.active_anchor = None
        self.text = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.lang = attrs.get('lang')
        elif tag == 'link':
            self.links.append(attrs)
        elif tag == 'a':
            self.active_anchor = [attrs.get('href'), '']

    def handle_data(self, data):
        self.text.append(data)
        if self.active_anchor is not None:
            self.active_anchor[1] += data

    def handle_endtag(self, tag):
        if tag == 'a' and self.active_anchor is not None:
            self.anchors.append(tuple(self.active_anchor))
            self.active_anchor = None


class LiuHearingLocalizationTests(unittest.TestCase):
    def test_missing_manifest_editions_are_rejected(self):
        # Remove both the route entry and access to its page, reproducing the
        # original false pass when a translated edition disappears entirely.
        original_read = Path.read_text
        for locale in ('en', 'ja'):
            with self.subTest(locale=locale):
                manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
                deleted_url = manifest['routes'][HEARING].pop(locale)

                def read(path, *args, **kwargs):
                    if path == MANIFEST:
                        return json.dumps(manifest)
                    if path == page_path(deleted_url):
                        raise FileNotFoundError(path)
                    return original_read(path, *args, **kwargs)

                with patch.object(Path, 'read_text', read), contextlib.redirect_stdout(io.StringIO()):
                    with self.assertRaises(SystemExit) as error:
                        runpy.run_path(str(VERIFIER), run_name='__main__')
                # Other routes may have independent failures; require this
                # route's own diagnostic rather than any nonzero exit.
                self.assertIn(f"{HEARING}: missing locales {{'{locale}'}}", str(error.exception))

    def test_missing_physical_editions_are_rejected(self):
        original_read = Path.read_text
        for locale in ('en', 'ja'):
            with self.subTest(locale=locale):
                missing = page_path(editions(HEARING)[locale])

                def read(path, *args, **kwargs):
                    if path == missing:
                        raise FileNotFoundError(path)
                    return original_read(path, *args, **kwargs)

                with patch.object(Path, 'read_text', read), contextlib.redirect_stdout(io.StringIO()):
                    with self.assertRaises(FileNotFoundError) as error:
                        runpy.run_path(str(VERIFIER), run_name='__main__')
                self.assertIn(str(missing), str(error.exception))

    def test_localized_overview_link_labels(self):
        labels = {'en': 'Case and hearing information →', 'ja': '事件・期日情報→'}
        for locale, expected in labels.items():
            with self.subTest(locale=locale):
                doc = Document(page_path(editions(OVERVIEW)[locale]).read_text(encoding='utf-8'))
                href = urlsplit(editions(HEARING)[locale]).path
                self.assertEqual([label for target, label in doc.anchors if target == href], [expected])

    def test_four_language_routes_canonical_and_reciprocal_hreflang(self):
        routes = json.loads(MANIFEST.read_text(encoding='utf-8'))['routes']
        for route in (HEARING, OVERVIEW):
            expected = editions(route)
            self.assertEqual(set(routes[route]), set(expected))
            for locale, url in expected.items():
                with self.subTest(route=route, locale=locale):
                    manifest_url = routes[route][locale]
                    self.assertEqual(manifest_url, url if locale == 'zh-Hans' else urlsplit(url).path)
                    doc = Document(page_path(manifest_url).read_text(encoding='utf-8'))
                    self.assertEqual(doc.lang, locale)
                    self.assertEqual([link.get('href') for link in doc.links if link.get('rel') == 'canonical'], [url])
                    for alternate, target in expected.items():
                        self.assertEqual([link.get('href') for link in doc.links
                                          if link.get('rel') == 'alternate' and link.get('hreflang') == alternate], [target])

    def test_official_confirmation_remains_pending_in_all_editions(self):
        notices = {
            'zh-Hant': '本站尚未取得可直接確認本案10月22日庭期的法院正式公告',
            'zh-Hans': '本站尚未取得可直接确认本案10月22日庭期的法院正式公告',
            'en': 'we have not obtained an official court notice confirming this hearing',
            'ja': '2026年10月8日時点で、この公判を確認できる裁判所の正式な公告は取得できていません',
        }
        for locale, notice in notices.items():
            with self.subTest(locale=locale):
                doc = Document(page_path(editions(HEARING)[locale]).read_text(encoding='utf-8'))
                self.assertIn(notice, ' '.join(doc.text))
                self.assertIn('https://www.judicial.gov.tw/tw/np-118-1.html', [href for href, _ in doc.anchors])


if __name__ == '__main__':
    unittest.main()
