#!/usr/bin/env python3
"""Keep the homepage hero search entry in both checked-in search indexes aligned."""

import html
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HOME = ROOT / "index.html"
INDEXES = (ROOT / "data/search-index.json", ROOT / "source/data/search-index.json")
HERO_PATTERN = re.compile(
    r'<p\s+class="premium-hero-lead">\s*(.*?)\s*</p>', re.DOTALL
)
OLD_HERO = "從法院紀錄、案件追蹤到公共倡議，讓重要的事情被看見， 也讓每一個孩子的安全被真正放在第一位。"


def normalize(value: str) -> str:
    return " ".join(html.unescape(value).split())


def hero_copy() -> str:
    match = HERO_PATTERN.search(HOME.read_text(encoding="utf-8"))
    if not match:
        raise SystemExit("Homepage hero lead was not found.")
    return normalize(re.sub(r"<[^>]+>", "", match.group(1)))


def sync_index(path: Path, hero: str) -> bool:
    document = json.loads(path.read_text(encoding="utf-8"))
    home_items = [item for item in document["items"] if item.get("url") == ""]
    if len(home_items) != 1:
        raise SystemExit(f"Expected one homepage entry in {path}.")
    item = home_items[0]
    text = item["text"]
    if hero in text:
        return False
    if OLD_HERO not in text:
        raise SystemExit(f"Expected previous homepage hero copy in {path}.")
    item["text"] = text.replace(OLD_HERO, hero, 1)
    path.write_text(
        json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return True


def main() -> None:
    hero = hero_copy()
    changed = [path for path in INDEXES if sync_index(path, hero)]
    print("Updated: " + ", ".join(str(path.relative_to(ROOT)) for path in changed))


if __name__ == "__main__":
    main()
