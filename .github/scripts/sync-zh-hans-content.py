#!/usr/bin/env python3
"""Keep physical Simplified Chinese pages structurally aligned with zh-Hant sources.\n\nThe generated HTML is deployed to both GitHub Pages and the Hong Kong mirror.\n"""

from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

from opencc import OpenCC


ROOT = Path(__file__).resolve().parents[2]
BASE = "/child-advocacy-site/"
HK_BASE = "https://cn.globalprotectionwall.com"
URL_ATTR_RE = re.compile(r"(?P<prefix>\b(?:href|src|action|poster)\s*=\s*)(?P<quote>[\"'])(?P<url>.*?)(?P=quote)", re.I | re.S)
MAIN_RE = re.compile(r"<main\b[^>]*>[\s\S]*?</main>", re.I)
KAIKAI_ROUTES = {
    "features/kaikai-grandmother-rescue-barriers/",
    "features/social-observation/child-abuse-recognition-blind-spots/",
}


def repo_path(url: str) -> Path | None:
    parsed = urlsplit(url)
    if parsed.query:
        return None
    path = parsed.path
    if not path.startswith(BASE):
        return None
    relative = path[len(BASE):]
    if not relative or relative.endswith("/"):
        relative += "index.html"
    return ROOT / relative


def normalize_page_path(path: Path) -> Path:
    if path.is_dir() or path.suffix == "":
        return path / "index.html"
    return path


def relative_repo_target(raw_url: str, source: Path) -> Path | None:
    parsed = urlsplit(raw_url)
    if parsed.scheme or parsed.netloc or raw_url.startswith(("#", "//", "data:", "mailto:", "tel:", "javascript:")):
        return None
    if parsed.path.startswith(BASE):
        resolved = ROOT / parsed.path[len(BASE):]
    elif parsed.path.startswith("/"):
        return None
    else:
        resolved = source.parent / parsed.path
    try:
        resolved = resolved.resolve()
        resolved.relative_to(ROOT.resolve())
    except (OSError, ValueError):
        return None
    return normalize_page_path(resolved)


def rebase_url(raw_url: str, source: Path, target: Path, source_to_hans: dict[Path, str]) -> str:
    parsed = urlsplit(raw_url)
    resolved = relative_repo_target(raw_url, source)
    if resolved is None:
        return raw_url
    resolved = resolved.resolve()
    hans_url = source_to_hans.get(resolved)
    if hans_url:
        destination = urlsplit(hans_url)
        query = parsed.query or destination.query
        fragment = parsed.fragment
        return urlunsplit((destination.scheme, destination.netloc, destination.path, query, fragment))
    rel = os.path.relpath(resolved, target.parent.resolve()).replace(os.sep, "/")
    if not rel.startswith("."):
        rel = "./" + rel
    return urlunsplit(("", "", rel, parsed.query, parsed.fragment))


def convert_html(fragment: str, source: Path, target: Path, source_to_hans: dict[Path, str], converter: OpenCC) -> str:
    protected: list[str] = []

    def protect(match: re.Match[str]) -> str:
        url = rebase_url(match.group("url"), source, target, source_to_hans)
        token = f"__CPA_PROTECTED_URL_{len(protected):05d}__"
        protected.append(url)
        return f'{match.group("prefix")}{match.group("quote")}{token}{match.group("quote")}'

    converted = converter.convert(URL_ATTR_RE.sub(protect, fragment))
    for index, url in enumerate(protected):
        converted = converted.replace(f"__CPA_PROTECTED_URL_{index:05d}__", url)
    return converted


def replace_link_href(document: str, rel_value: str, href: str) -> str:
    """Replace the complete metadata tag so repeated syncs stay idempotent."""
    tag_re = re.compile(r"<link\b[^>]*>", re.I)
    for match in tag_re.finditer(document):
        tag = match.group(0)
        if not re.search(rf"\brel\s*=\s*([\"']){re.escape(rel_value)}\1", tag, re.I):
            continue
        replacement = f'<link rel="{rel_value}" href="{href}">'
        return document[:match.start()] + replacement + document[match.end():]
    return re.sub(r"</head>", f'<link rel="{rel_value}" href="{href}">\n</head>', document, count=1, flags=re.I)


def replace_hreflang(document: str, locale: str, href: str) -> str:
    tag_re = re.compile(r"<link\b[^>]*>", re.I)
    for match in tag_re.finditer(document):
        tag = match.group(0)
        if not re.search(rf"\bhreflang\s*=\s*([\"']){re.escape(locale)}\1", tag, re.I):
            continue
        replacement = f'<link rel="alternate" hreflang="{locale}" href="{href}">'
        return document[:match.start()] + replacement + document[match.end():]
    return document


def replace_og_url(document: str, href: str) -> str:
    tag_re = re.compile(r"<meta\b[^>]*>", re.I)
    for match in tag_re.finditer(document):
        tag = match.group(0)
        if not re.search(r"\bproperty\s*=\s*([\"'])og:url\1", tag, re.I):
            continue
        replacement = f'<meta property="og:url" content="{href}">'
        return document[:match.start()] + replacement + document[match.end():]
    return document


def ensure_shared_record_assets(document: str, source: str) -> str:
    """Carry required transcript assets into older physical locale shells."""
    patterns = (
        (r'<link\b[^>]*href=["\'][^"\']*pw-verbatim\.css[^"\']*["\'][^>]*>', "</head>"),
        (r'<script\b[^>]*src=["\'][^"\']*pw-verbatim\.js[^"\']*["\'][^>]*></script>', "</body>"),
    )
    for pattern, marker in patterns:
        source_tag = re.search(pattern, source, re.I)
        if source_tag and not re.search(pattern, document, re.I):
            document = document.replace(marker, source_tag.group(0) + "\n" + marker, 1)
    return document

def structural_signature(fragment: str) -> dict[str, object]:
    tags = {tag: len(re.findall(rf"<{tag}\b", fragment, re.I)) for tag in ("h1", "h2", "h3", "p", "li", "details", "section", "article")}
    ids = sorted(re.findall(r"\bid\s*=\s*[\"']([^\"']+)", fragment, re.I))
    sources = sorted(set(re.findall(r"\bhref\s*=\s*[\"'](https?://[^\"']+)", fragment, re.I)))
    sources = [url for url in sources if "jerryzuhow77.github.io" not in url and "cn.globalprotectionwall.com" not in url]
    return {"tags": tags, "ids": ids, "sources": sources}


def synchronize(check_only: bool) -> int:
    manifest = json.loads((ROOT / "data/four-language-routes.json").read_text(encoding="utf-8"))
    pairs: list[tuple[str, Path, Path, str]] = []
    source_to_hans: dict[Path, str] = {}
    errors: list[str] = []

    for route, editions in manifest["routes"].items():
        hans_url = editions.get("zh-Hans")
        hant_url = editions.get("zh-Hant")
        if not hans_url:
            continue
        if not hans_url.startswith(HK_BASE):
            errors.append(f"{route}: zh-Hans URL is not on the Hong Kong mirror")
            continue
        if not hant_url:
            continue
        source = repo_path(hant_url)
        target = repo_path(hans_url)
        if source:
            source_to_hans[source.resolve()] = hans_url
        if source and target and source != target:
            pairs.append((route, source, target, hans_url))

    if check_only:
        for route, source, target, hans_url in pairs:
            if not source.exists() or not target.exists():
                errors.append(f"{route}: missing physical source or zh-Hans page")
                continue
            target_text = target.read_text(encoding="utf-8")
            source_main = MAIN_RE.search(source.read_text(encoding="utf-8"))
            target_main = MAIN_RE.search(target_text)
            if not source_main or not target_main:
                errors.append(f"{route}: missing main element")
                continue
            if structural_signature(source_main.group(0)) != structural_signature(target_main.group(0)):
                errors.append(f"{route}: zh-Hans main content is not structurally complete")
            if route in KAIKAI_ROUTES and "剀剀" in target_text:
                errors.append(f"{route}: mixed Simplified proper name 剀剀 remains; use 凯凯")
            if route in KAIKAI_ROUTES and "凯凯" not in target_text:
                errors.append(f"{route}: expected Simplified proper name 凯凯 is missing")
            if not re.search(r'<html\b[^>]*lang=["\']zh-Hans["\']', target_text, re.I):
                errors.append(f"{route}: physical zh-Hans page has the wrong lang")
            if not re.search(rf'<link\b(?=[^>]*rel=["\']canonical["\'])(?=[^>]*href=["\']{re.escape(hans_url)}["\'])', target_text, re.I):
                errors.append(f"{route}: canonical does not point to the Hong Kong mirror")
            canonical_tags = [
                tag for tag in re.findall(r"<link\b[^>]*>", target_text, re.I)
                if re.search(r"\brel\s*=\s*([\"'])canonical\1", tag, re.I)
            ]
            if len(canonical_tags) != 1 or len(re.findall(r"\bhref\s*=", canonical_tags[0], re.I)) != 1:
                errors.append(f"{route}: canonical metadata is duplicated or malformed")
        if errors:
            raise SystemExit("\n".join(errors))
        print(f"Verified {len(pairs)} physical zh-Hans pages and all manifest mirror URLs.")
        return 0

    converter = OpenCC("t2s")
    changed = 0
    for route, source, target, hans_url in pairs:
        if not source.exists():
            errors.append(f"{route}: missing physical source page")
            continue
        source_text = source.read_text(encoding="utf-8")
        target_text = target.read_text(encoding="utf-8") if target.exists() else source_text
        source_main = MAIN_RE.search(source_text)
        target_main = MAIN_RE.search(target_text)
        if not source_main or not target_main:
            errors.append(f"{route}: missing source or target main element")
            continue
        converted_main = convert_html(source_main.group(0), source, target, source_to_hans, converter)
        if route in KAIKAI_ROUTES:
            converted_main = converted_main.replace("剀剀", "凯凯")
        updated = target_text[:target_main.start()] + converted_main + target_text[target_main.end():]
        updated = ensure_shared_record_assets(updated, source_text)
        updated = re.sub(r'(<html\b[^>]*\blang\s*=\s*)["\'][^"\']+["\']', r'\1"zh-Hans"', updated, count=1, flags=re.I)
        updated = replace_link_href(updated, "canonical", hans_url)
        updated = replace_hreflang(updated, "zh-Hans", hans_url)
        updated = replace_og_url(updated, hans_url)
        if updated != target_text:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(updated, encoding="utf-8")
            changed += 1

    if errors:
        raise SystemExit("\n".join(errors))
    print(f"Synchronized {changed} of {len(pairs)} physical zh-Hans pages.")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    raise SystemExit(synchronize(args.check))
