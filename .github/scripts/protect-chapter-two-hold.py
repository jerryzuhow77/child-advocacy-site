#!/usr/bin/env python3
"""Keep Chapter Two source files retained while removing public discovery."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CHAPTER_ID = "kaikai-chapter-two-20260829"
NOINDEX = '<meta name="robots" content="noindex, nofollow" data-cpa-chapter-two-hold>'


def add_noindex(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    robots_pattern = re.compile(r'<meta\b[^>]*\bname=["\']robots["\'][^>]*>\s*', re.I)
    robots_tags = robots_pattern.findall(text)
    if len(robots_tags) == 1 and "data-cpa-chapter-two-hold" in robots_tags[0]:
        return False
    without_robots = robots_pattern.sub("", text)
    updated, count = re.subn(r"</head>", NOINDEX + "\n</head>", without_robots, count=1, flags=re.I)
    if count != 1:
        raise SystemExit(f"Cannot add publication hold to {path.relative_to(ROOT)}")
    path.write_text(updated, encoding="utf-8")
    return True


def protect_related_page(path: Path, simplified: bool) -> bool:
    text = path.read_text(encoding="utf-8")
    notice = (
        '<section class="section wrap chapter-two-hold-notice" id="full-hearing"><div class="kicker">PUBLICATION HOLD</div>'
        '<h2>第二章尚未公开</h2><p class="lead">相关完整庭讯整理仍在内部校核；正式批准前不提供入口、嵌入阅读或索引。</p></section>'
        if simplified else
        '<section class="section wrap chapter-two-hold-notice" id="full-hearing"><div class="kicker">PUBLICATION HOLD</div>'
        '<h2>第二章尚未公開</h2><p class="lead">相關完整庭訊整理仍在內部校核；正式批准前不提供入口、嵌入閱讀或索引。</p></section>'
    )
    updated = re.sub(r'<section class="section wrap" id="full-hearing">.*?</section>', notice, text, count=1, flags=re.S)
    title = "第二章尚未公开" if simplified else "第二章尚未公開"
    updated = re.sub(
        r'<a\b[^>]*\bhref=["\'][^"\']*kaikai-final-chapter[^"\']*["\'][^>]*>(.*?)</a>',
        rf'<span class="chapter-two-hold-link" aria-disabled="true" title="{title}">\1</span>',
        updated,
        flags=re.S | re.I,
    )
    replacements = {
        "每段都可回到第二章的完整公开记录。": "每段都应回到已公开判决与来源资料核对。",
        "每段都可回到第二章的完整公開紀錄。": "每段都應回到已公開判決與來源資料核對。",
        "第二章的12名证人全文保留了这些不同位置的说法。": "既有公开来源保留了这些不同位置的说法。",
        "第二章的12名證人全文保留了這些不同位置的說法。": "既有公開來源保留了這些不同位置的說法。",
        "回到第二章的公开庭讯记录、12名证人全文及一审判决原文阅读": "回到已公开庭讯来源及一审判决原文阅读",
        "回到第二章的公開庭訊紀錄、12名證人全文及一審判決原文閱讀": "回到已公開庭訊來源及一審判決原文閱讀",
    }
    for old, new in replacements.items():
        updated = updated.replace(old, new)
    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def update_feed() -> bool:
    path = ROOT / "data" / "latest-bulletins.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    changed = False
    for section in ("pinned", "items"):
        current = data.get(section, [])
        filtered = [item for item in current if item.get("id") != CHAPTER_ID]
        changed = changed or len(filtered) != len(current)
        data[section] = filtered
    if not changed:
        return False
    data["version"] = max(int(data.get("version", 0)) + 1, 9)
    data["generatedAt"] = "2026-09-01T00:00:00Z"
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return True


def main() -> None:
    changed = 0
    chapter_roots = [
        ROOT / "hearing-records/prison-watch/kaikai-final-chapter",
        ROOT / "en/hearing-records/prison-watch/kaikai-final-chapter",
        ROOT / "ja/hearing-records/prison-watch/kaikai-final-chapter",
    ]
    for chapter_root in chapter_roots:
        for page in chapter_root.rglob("*.html"):
            changed += int(add_noindex(page))
    related = [
        (ROOT / "features/social-observation/guarantor-status/index.html", False),
        (ROOT / "features/social-observation/guarantor-status/zh-Hans/index.html", True),
    ]
    for page, simplified in related:
        changed += int(protect_related_page(page, simplified))
    changed += int(update_feed())
    print(f"chapter_two_hold_changes={changed}")


if __name__ == "__main__":
    main()
