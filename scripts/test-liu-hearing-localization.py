#!/usr/bin/env python3
"""Regression checks for the 2026-10-22 Liu Zongxin hearing activity pages."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "zh-Hant": ROOT / "activity-records/20261022-liu-zongxin-hearing/index.html",
    "zh-Hans": ROOT / "activity-records/20261022-liu-zongxin-hearing/zh-Hans/index.html",
    "en": ROOT / "activity-records/20261022-liu-zongxin-hearing/en/index.html",
    "ja": ROOT / "activity-records/20261022-liu-zongxin-hearing/ja/index.html",
}
OFFICIAL_LOOKUP = "https://www.judicial.gov.tw/tw/np-118-1.html"
PENDING = {
    "zh-Hant": "尚待官方核對",
    "zh-Hans": "尚待官方核对",
    "en": "have not been officially verified",
    "ja": "公式確認を得ていません",
}

class LiuHearingActivityTests(unittest.TestCase):
    def test_four_language_pages_preserve_metadata_and_pending_notice(self):
        for locale, path in PAGES.items():
            with self.subTest(locale=locale):
                text = path.read_text(encoding="utf-8")
                self.assertIn(f'<html lang="{locale}"', text)
                self.assertIn('rel="canonical"', text)
                self.assertIn(PENDING[locale], text)
                self.assertIn(OFFICIAL_LOOKUP, text)
                for alternate in ("zh-Hant", "zh-Hans", "en", "ja"):
                    self.assertIn(f'hreflang="{alternate}"', text)
                self.assertIn("data-cpa-four-language-toolbar-flag", text)
                self.assertIn("data-cpa-four-language-toolbar-script", text)

if __name__ == "__main__":
    unittest.main()
