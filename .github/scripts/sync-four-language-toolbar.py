#!/usr/bin/env python3
"""Generate the four-language route map and inject the shared top toolbar."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = "/child-advocacy-site/"
VERSION = "20260905-1"
EXCLUDED_ROOTS = {"child-advocacy-site", "child-advocacy-site-main", "source", "handoffs", "global-protection-wall"}
EXCLUDED_FILES = {"offline.html", "google5c94bbe55c53b683.html"}
CSS_MARKER = "data-cpa-four-language-toolbar-style"
FLAG_MARKER = "data-cpa-four-language-toolbar-flag"
JS_MARKER = "data-cpa-four-language-toolbar-script"
CSS_TAG = f'<link {CSS_MARKER} rel="stylesheet" href="{BASE}assets/four-language-toolbar-20260901.css?v={VERSION}">'
FLAG_TAG = f'<script {FLAG_MARKER}>window.__cpaFourLanguageToolbar=true;</script>'
JS_TAG = f'<script {JS_MARKER} src="{BASE}assets/four-language-toolbar-20260901.js?v={VERSION}"></script>'


def active_html_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*.html"):
        rel = path.relative_to(ROOT)
        if rel.name in EXCLUDED_FILES or any(part in EXCLUDED_ROOTS for part in rel.parts):
            continue
        if any(part.startswith(".") for part in rel.parts):
            continue
        files.append(path)
    return sorted(files)


def read_html(path: Path) -> str:
    with path.open("r", encoding="utf-8", newline="") as handle:
        return handle.read()


def write_html(path: Path, text: str) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        handle.write(text)


def html_locale(path: Path, text: str) -> str:
    rel = path.relative_to(ROOT)
    parts = list(rel.parts[:-1])
    first = parts[0].lower() if parts else ""
    match = re.search(r'<html[^>]+lang=["\']([^"\']+)', text, re.I)
    declared = (match.group(1) if match else "").lower()
    if first == "en" or declared.startswith("en"):
        return "en"
    if first == "ja" or declared.startswith("ja"):
        return "ja"
    if first == "zh-hans" or "zh-hans" in (part.lower() for part in parts) or declared.startswith(("zh-hans", "zh-cn")):
        return "zh-Hans"
    return "zh-Hant"


def neutral_route(path: Path, locale: str) -> str:
    parts = list(path.relative_to(ROOT).parts[:-1])
    if parts and parts[0].lower() in {"en", "ja", "zh-hans", "zh-hant"}:
        parts.pop(0)
    parts = [part for part in parts if part.lower() != "zh-hans"]
    if locale in {"en", "ja"} and parts and parts[-1].lower() == locale:
        parts.pop()
    return "/".join(parts) + ("/" if parts else "")


def public_url(path: Path, locale: str) -> str:
    route = path.relative_to(ROOT).parent.as_posix()
    url = BASE + ("" if route == "." else route.rstrip("/") + "/")
    if locale == "zh-Hans" and "/zh-Hans/" not in url and not url.lower().startswith(BASE + "zh-hans/"):
        return url + ("&" if "?" in url else "?") + "lang=zh-Hans"
    return url


def is_noindex(text: str) -> bool:
    """Keep redirect, archive, and other intentionally hidden pages out of discovery."""
    return bool(re.search(r'<meta\b(?=[^>]*name=["\']robots["\'])(?=[^>]*content=["\'][^"\']*noindex)', text, re.I))


def inject(path: Path, text: str) -> str:
    if CSS_MARKER not in text and re.search(r"</head>", text, re.I):
        text = re.sub(r"</head>", CSS_TAG + "\n</head>", text, count=1, flags=re.I)
    if FLAG_MARKER not in text and re.search(r"</head>", text, re.I):
        text = re.sub(r"</head>", FLAG_TAG + "\n</head>", text, count=1, flags=re.I)
    if JS_MARKER not in text and re.search(r"</body>", text, re.I):
        text = re.sub(r"</body>", JS_TAG + "\n</body>", text, count=1, flags=re.I)
    return text


def main() -> None:
    routes: dict[str, dict[str, str]] = {}
    source: dict[tuple[str, str], tuple[Path, str]] = {}
    files = active_html_files()
    for path in files:
        text = read_html(path)
        if is_noindex(text):
            continue
        locale = html_locale(path, text)
        route = neutral_route(path, locale)
        source[(route, locale)] = (path, text)
        routes.setdefault(route, {})[locale] = public_url(path, locale)

    for route, editions in routes.items():
        hant = source.get((route, "zh-Hant"))
        if "zh-Hans" not in editions and hant and ("assets/site.js" in hant[1] or "data-hans" in hant[1]):
            editions["zh-Hans"] = editions["zh-Hant"] + ("&" if "?" in editions["zh-Hant"] else "?") + "lang=zh-Hans"

    output = {"version": VERSION, "generatedFrom": "repository HTML routes", "routes": {key: routes[key] for key in sorted(routes)}}
    route_path = ROOT / "data" / "four-language-routes.json"
    route_path.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")

    changed = 0
    for path in files:
        original = read_html(path)
        if is_noindex(original):
            continue
        updated = inject(path, original)
        if updated != original:
            write_html(path, updated)
            changed += 1
    print(f"toolbar_routes={len(routes)} html_files={len(files)} changed={changed}")


if __name__ == "__main__":
    main()
