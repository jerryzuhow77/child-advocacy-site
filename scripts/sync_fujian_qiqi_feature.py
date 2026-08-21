#!/usr/bin/env python3
"""Keep the four Fujian Putian Qiqi feature pages deployment-ready.

The script updates only deployment metadata and cache-busting tokens. It does
not rewrite editorial copy. It is designed for GitHub Actions but can also be
run locally from the repository root. All four public language variants are
updated together so their deployment metadata cannot drift apart.
"""

from __future__ import annotations

import os
import re
import subprocess
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
PAGE_PATHS = (
    Path("historical-cases/regions/mainland-china/fujian-qiqi/index.html"),
    Path("zh-hans/historical-cases/regions/mainland-china/fujian-qiqi/index.html"),
    Path("en/historical-cases/regions/mainland-china/fujian-qiqi/index.html"),
    Path("ja/historical-cases/regions/mainland-china/fujian-qiqi/index.html"),
)
CACHE_BUSTED_ASSETS = (
    "home-view-counter-20260811.css",
    "fujian-qiqi-feature.css",
    "fujian-qiqi-feature.js",
)
OBSOLETE_REFERENCES = (
    "fujian-qiqi-dialogue-hotfix.css",
    "fujian-qiqi-gsap-refine.css",
    "fujian-qiqi-gsap-refine.js",
    "fujian-qiqi-ronghua.css",
)
ENGLISH_MONTHS = (
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
)


def short_sha() -> str:
    candidate = os.environ.get("QIQI_VERSION_SHA") or os.environ.get("GITHUB_SHA")
    if candidate:
        return candidate[:7]
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "--short=7", "HEAD"],
            cwd=ROOT,
            text=True,
        ).strip()
    except (OSError, subprocess.CalledProcessError):
        return "local"


def visible_date_label(path: Path, now: datetime) -> str:
    dotted = now.strftime("%Y.%m.%d")
    path_string = path.as_posix()
    if path_string.startswith("zh-hans/"):
        return f"资料更新 {dotted}"
    if path_string.startswith("en/"):
        return f"Updated {now.day} {ENGLISH_MONTHS[now.month - 1]} {now.year}"
    if path_string.startswith("ja/"):
        return f"資料更新 {dotted}"
    return f"資料更新 {dotted}"


def update_first_meta_date(html: str, label: str) -> str:
    pattern = re.compile(
        r'(<div class="fq-meta">\s*<span>)(.*?)(</span>)',
        re.DOTALL,
    )
    updated, count = pattern.subn(
        lambda match: f"{match.group(1)}{label}{match.group(3)}",
        html,
        count=1,
    )
    if count != 1:
        raise ValueError("Missing the first .fq-meta date span")
    return updated


def update_page(path: Path, now: datetime, iso_date: str, version: str) -> bool:
    absolute = ROOT / path
    if not absolute.exists():
        raise FileNotFoundError(f"Missing language page: {path}")

    original = absolute.read_text(encoding="utf-8")
    html = original

    html, modified_count = re.subn(
        r'("dateModified"\s*:\s*")\d{4}-\d{2}-\d{2}(")',
        rf"\g<1>{iso_date}\g<2>",
        html,
        count=1,
    )
    if modified_count != 1:
        raise ValueError(f"Missing JSON-LD dateModified in {path}")

    label = visible_date_label(path, now)
    html = update_first_meta_date(html, label)

    for asset in CACHE_BUSTED_ASSETS:
        pattern = re.compile(rf"({re.escape(asset)}\?v=)[^\"'\s>]+")
        html, count = pattern.subn(rf"\g<1>{version}", html)
        if count < 1:
            raise ValueError(f"Missing cache-busted reference to {asset} in {path}")

    if "</body>" not in html or "</html>" not in html:
        raise ValueError(f"Incomplete HTML document: {path}")
    if any(reference in html for reference in OBSOLETE_REFERENCES):
        raise ValueError(f"Obsolete Qiqi hotfix reference remains in {path}")
    if f'"dateModified":"{iso_date}"' not in html:
        raise ValueError(f"dateModified validation failed for {path}")
    if label not in html:
        raise ValueError(f"Visible update date validation failed for {path}")
    if f"fujian-qiqi-feature.css?v={version}" not in html:
        raise ValueError(f"CSS cache token validation failed for {path}")
    if f"fujian-qiqi-feature.js?v={version}" not in html:
        raise ValueError(f"JavaScript cache token validation failed for {path}")

    if html == original:
        return False

    absolute.write_text(html, encoding="utf-8", newline="\n")
    return True


def main() -> int:
    now = datetime.now(ZoneInfo("Asia/Taipei"))
    iso_date = now.strftime("%Y-%m-%d")
    version = f"{now:%Y%m%d}-{short_sha()}"

    changed: list[str] = []
    for path in PAGE_PATHS:
        if update_page(path, now, iso_date, version):
            changed.append(path.as_posix())

    if changed:
        print("Updated Fujian Qiqi feature deployment metadata:")
        for path in changed:
            print(f"- {path}")
        print(f"Cache version: {version}")
    else:
        print("Fujian Qiqi feature metadata is already synchronized.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
