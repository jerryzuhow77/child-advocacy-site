#!/usr/bin/env python3
"""Build sitemap.xml from public index.html files in the repository."""
from __future__ import annotations

import datetime as dt
import re
import subprocess
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://jerryzuhow77.github.io/child-advocacy-site/"
EXCLUDED_PARTS = {
    ".git", ".github", "node_modules", "source",
    # Old repository snapshots kept inside the working tree must never become
    # duplicate public URLs in the generated sitemap.
    "child-advocacy-site", "child-advocacy-site-main",
    "draft", "drafts", "test", "tests", "admin", "scripts",
}
NOINDEX_RE = re.compile(
    r'<meta\b[^>]*\bname=["\']robots["\'][^>]*\bcontent=["\'][^"\']*noindex|'
    r'<meta\b[^>]*\bcontent=["\'][^"\']*noindex[^"\']*["\'][^>]*\bname=["\']robots["\']',
    re.IGNORECASE,
)


def run_git(*args: str) -> str:
    result = subprocess.run(["git", *args], cwd=ROOT, check=False, capture_output=True, text=True)
    return result.stdout.strip() if result.returncode == 0 else ""


def last_modified(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if run_git("status", "--porcelain", "--", rel):
        return dt.date.today().isoformat()
    value = run_git("log", "-1", "--format=%cs", "--", rel)
    return value or dt.date.today().isoformat()


def is_public_page(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    if any(part in EXCLUDED_PARTS for part in rel.parts):
        return False
    try:
        head = path.read_text(encoding="utf-8", errors="ignore")[:65536]
    except OSError:
        return False
    return not NOINDEX_RE.search(head)


def url_for(path: Path) -> str:
    rel = path.relative_to(ROOT)
    if rel == Path("index.html"):
        return BASE_URL
    directory = rel.parent.as_posix().strip("/")
    return f"{BASE_URL}{directory}/"


def main() -> None:
    pages = sorted(
        (path for path in ROOT.rglob("index.html") if is_public_page(path)),
        key=lambda path: (path != ROOT / "index.html", url_for(path)),
    )
    namespace = "http://www.sitemaps.org/schemas/sitemap/0.9"
    ET.register_namespace("", namespace)
    urlset = ET.Element(f"{{{namespace}}}urlset")
    seen_urls: set[str] = set()
    for page in pages:
        location = url_for(page)
        if location in seen_urls:
            continue
        seen_urls.add(location)
        url = ET.SubElement(urlset, f"{{{namespace}}}url")
        ET.SubElement(url, f"{{{namespace}}}loc").text = location
        ET.SubElement(url, f"{{{namespace}}}lastmod").text = last_modified(page)
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ")
    output = ROOT / "sitemap.xml"
    tree.write(output, encoding="utf-8", xml_declaration=True)
    print(f"Wrote {output.relative_to(ROOT)} with {len(seen_urls)} public URLs")


if __name__ == "__main__":
    main()
