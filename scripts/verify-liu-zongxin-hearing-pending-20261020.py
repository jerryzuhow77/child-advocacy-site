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

for relative_path in (
    "features/social-observation/three-cases-hearings-202610-11/index.html",
    "features/social-observation/three-cases-hearings-202610-11/zh-Hans/index.html",
    "en/features/social-observation/three-cases-hearings-202610-11/index.html",
    "ja/features/social-observation/three-cases-hearings-202610-11/index.html",
):
    text = (ROOT / relative_path).read_text(encoding="utf-8")
    assert "10.22" in text or "10月22日" in text or "Oct. 22" in text
    assert any(token in text for token in (
        "待官方公告", "official confirmation is pending",
        "no official notice located", "正式確認待ち"
    )), f"Missing pending boundary: {relative_path}"

print("PASS: Liu Zongxin Oct. 22 details remain explicitly unverified in all four languages.")
