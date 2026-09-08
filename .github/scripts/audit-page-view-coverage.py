#!/usr/bin/env python3
"""Fail when a public article or the homepage has no real view counter."""

from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[2]
EXCLUDED_PREFIXES = (
    "child-advocacy-site-main/",
    "child-advocacy-site/",
    "global-protection-wall/",
    "source/",
)
ARTICLE_PREFIXES = (
    "activity-records/",
    "cases/",
    "court-comics/",
    "features/",
    "hearing-records/",
    "historical-cases/",
    "news/",
)
COUNTER_LOADERS = (
    "assets/site.js",
    "mobile-nav-view-counter-20260823.js",
    "four-language-toolbar-20260901.js",
    "home-post-engagement-20260826.js",
)


def normalized_route(path: Path) -> str:
    route = path.relative_to(ROOT).as_posix()
    route = re.sub(r"^(?:en|ja|zh-Hans)/", "", route, flags=re.I)
    route = re.sub(r"/zh-Hans/", "/", route, flags=re.I)
    return route


def is_public_article(path: Path, html: str) -> bool:
    relative = path.relative_to(ROOT).as_posix()
    if relative.startswith(EXCLUDED_PREFIXES):
        return False
    if re.search(r'<meta\s+name=["\']robots["\'][^>]*noindex', html, re.I):
        return False
    route = normalized_route(path)
    if not route.startswith(ARTICLE_PREFIXES):
        return False
    # Section landing pages are navigation, not articles.
    return route.count("/") >= 2


def main() -> int:
    homepage = (ROOT / "index.html").read_text(encoding="utf-8")
    errors: list[str] = []
    if "data-home-view-counter" not in homepage:
        errors.append("index.html: missing homepage view counter")
    counter_script = (ROOT / "assets/home-view-counter-20260811.js").read_text(encoding="utf-8")
    if "HOMEPAGE_HISTORICAL_BASELINE = 607" not in counter_script:
        errors.append("assets/home-view-counter-20260811.js: verified homepage historical baseline must remain 607")

    audited = 0
    for path in sorted(ROOT.rglob("index.html")):
        html = path.read_text(encoding="utf-8", errors="replace")
        if not is_public_article(path, html):
            continue
        audited += 1
        if not any(loader in html for loader in COUNTER_LOADERS):
            errors.append(f"{path.relative_to(ROOT).as_posix()}: missing article view counter loader")

    print(f"Audited homepage and {audited} public article documents.")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print("All audited pages include a real view counter.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
