#!/usr/bin/env python3
"""Keep the Oct. 22 Liu Zongxin hearing notice explicitly evidence-bound."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "zh-Hant": "features/social-observation/liu-zongxin-hearing-20261022/index.html",
    "zh-Hans": "features/social-observation/liu-zongxin-hearing-20261022/zh-Hans/index.html",
    "en": "en/features/social-observation/liu-zongxin-hearing-20261022/index.html",
    "ja": "ja/features/social-observation/liu-zongxin-hearing-20261022/index.html",
}
PENDING = {
    "zh-Hant": "截至2026年10月20日",
    "zh-Hans": "截至2026年10月20日",
    "en": "As of 20 October 2026",
    "ja": "2026年10月20日時点",
}

for locale, relative_path in PAGES.items():
    text = (ROOT / relative_path).read_text(encoding="utf-8")
    assert PENDING[locale] in text, f"Missing current check date: {relative_path}"
    assert "csdi3.judicial.gov.tw/judbp/wkw/WHD1A03.htm" in text
    assert "court" in text.lower() or "法院" in text or "裁判所" in text

print("PASS: Liu Zongxin Oct. 22 details remain explicitly unverified in all four languages.")
