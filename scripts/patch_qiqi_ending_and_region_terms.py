#!/usr/bin/env python3
"""Restore the Fujian Qiqi ending animation and normalize visible region wording.

This is a one-off deployment patch. It deliberately leaves route names such as
``mainland-china`` unchanged while replacing the public-facing Chinese and
Japanese labels with the user's preferred shorter wording.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS_PATH = ROOT / "assets/fujian-qiqi-feature.css"
JS_PATH = ROOT / "assets/fujian-qiqi-feature.js"
SW_PATH = ROOT / "sw.js"
PWA_PATH = ROOT / "assets/pwa-install.js"

LANGUAGE_PAGES = (
    ROOT / "historical-cases/regions/mainland-china/fujian-qiqi/index.html",
    ROOT / "zh-hans/historical-cases/regions/mainland-china/fujian-qiqi/index.html",
    ROOT / "en/historical-cases/regions/mainland-china/fujian-qiqi/index.html",
    ROOT / "ja/historical-cases/regions/mainland-china/fujian-qiqi/index.html",
)

PUBLIC_TEXT_EXTENSIONS = {
    ".html", ".htm", ".js", ".css", ".json", ".xml", ".webmanifest",
    ".md", ".txt",
}
EXCLUDED_TOP_LEVEL = {".git", ".github", "node_modules"}
TERM_REPLACEMENTS = (
    ("中國大陸", "大陸"),
    ("中国大陆", "大陆"),
    ("中国大陸", "大陸"),
)
CSS_MARKER = "/* === Qiqi ending visibility isolation · 2026-08-21 === */"
JS_PATCH_MARKER = "/* Ending visibility isolation repair · 2026-08-21 */"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def normalize_region_terms() -> list[str]:
    changed: list[str] = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in PUBLIC_TEXT_EXTENSIONS:
            continue
        relative = path.relative_to(ROOT)
        if relative.parts and relative.parts[0] in EXCLUDED_TOP_LEVEL:
            continue
        if relative.parts and relative.parts[0] == "scripts":
            continue
        try:
            original = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        updated = original
        for source, target in TERM_REPLACEMENTS:
            updated = updated.replace(source, target)
        if updated != original:
            path.write_text(updated, encoding="utf-8", newline="\n")
            changed.append(relative.as_posix())
    return changed


def patch_language_pages() -> list[str]:
    changed: list[str] = []
    for path in LANGUAGE_PAGES:
        if not path.exists():
            raise FileNotFoundError(path.relative_to(ROOT))
        original = path.read_text(encoding="utf-8")
        updated = original.replace(
            '<section class="fq-ending" data-fq-reveal>',
            '<section class="fq-ending" data-fq-ending>',
            1,
        )
        if '<section class="fq-ending" data-fq-ending>' not in updated:
            raise RuntimeError(f"Ending section marker missing in {path.relative_to(ROOT)}")
        if updated != original:
            path.write_text(updated, encoding="utf-8", newline="\n")
            changed.append(path.relative_to(ROOT).as_posix())
    return changed


def patch_css() -> bool:
    original = CSS_PATH.read_text(encoding="utf-8")
    if CSS_MARKER in original:
        return False
    patch = r'''
/* === Qiqi ending visibility isolation · 2026-08-21 === */
/* The epilogue owns its GSAP reveal. It must never inherit the generic
   data-fq-reveal opacity/translate state, especially in mobile in-app browsers. */
html.fq-motion-ready body.fq-page .fq-ending[data-fq-ending],
body.fq-page .fq-ending.has-watercolor-panorama {
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
}

body.fq-page .fq-ending[data-fq-ending] {
  content-visibility: auto;
  contain-intrinsic-size: 900px;
}

body.fq-page .fq-ending[data-fq-ending].is-watercolor-animating {
  content-visibility: visible;
}

@media screen and (max-width: 780px) {
  body.fq-page .fq-ending[data-fq-ending] {
    content-visibility: visible;
    contain-intrinsic-size: auto;
  }
}
'''
    CSS_PATH.write_text(original.rstrip() + "\n\n" + patch.strip() + "\n", encoding="utf-8")
    return True


def patch_js() -> bool:
    original = JS_PATH.read_text(encoding="utf-8")
    js = original
    start = js.find("/* Watercolor panorama ending showcase · 2026-08-21 */")
    end = js.find("/* Third-act contrast and motion refinement · 2026-08-21 */", start)
    if start < 0 or end < 0:
        raise RuntimeError("Could not isolate watercolor ending controller")
    block = js[start:end]

    if JS_PATCH_MARKER not in block:
        block = replace_once(
            block,
            """    ending.prepend(detail, full, glow);
    ending.classList.add('has-watercolor-panorama', 'is-watercolor-intro', 'is-visible');
""",
            """    ending.prepend(detail, full, glow);
    ending.classList.add('has-watercolor-panorama', 'is-watercolor-intro', 'is-visible');

    /* Ending visibility isolation repair · 2026-08-21 */
    ending.style.opacity = '1';
    ending.style.visibility = 'visible';
    ending.style.transform = 'none';
""",
            "ending visibility reset",
        )
        block = replace_once(
            block,
            """    const lite = motionMode === 'lite';
    const off = motionMode === 'off';
""",
            """    /* Data Saver keeps a shorter sequence instead of deleting the animation. */
    const lite = motionMode === 'lite' || saveData;
    const off = motionMode === 'off';
""",
            "ending lite mode",
        )
        block = replace_once(
            block,
            "if (!gsap || reduced || off || saveData) {",
            "if (!gsap || reduced || off) {",
            "ending static fallback condition",
        )
        block = replace_once(
            block,
            "inView = entry.isIntersecting && entry.intersectionRatio >= .08;",
            "inView = entry.isIntersecting && entry.intersectionRatio >= .01;",
            "ending observer threshold",
        )
        block = replace_once(
            block,
            "}, { threshold: [0, .08, .2, .45], rootMargin: '3% 0px -5% 0px' });",
            "}, { threshold: [0, .01, .08, .2, .45], rootMargin: '18% 0px -2% 0px' });",
            "ending observer options",
        )
        block = replace_once(
            block,
            """      observer.observe(ending);
    } else if (timeline) {
""",
            """      observer.observe(ending);
      requestAnimationFrame(() => {
        const rect = ending.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < innerHeight * 1.18) {
          inView = true;
          html.classList.add('fq-ending-focus');
          playOrResume();
        }
      });
    } else if (timeline) {
""",
            "ending immediate viewport fallback",
        )

    js = js[:start] + block + js[end:]
    if "version: '1.3.4'," in js:
        js = js.replace("version: '1.3.4',", "version: '1.3.5',", 1)
    elif "version: '1.3.5'," not in js:
        raise RuntimeError("Unexpected FujianQiqiFeature version")

    if js == original:
        return False
    JS_PATH.write_text(js, encoding="utf-8", newline="\n")
    return True


def patch_pwa_cache() -> list[str]:
    changed: list[str] = []

    sw = SW_PATH.read_text(encoding="utf-8")
    updated_sw, count = re.subn(
        r"const VERSION = '[^']+';",
        "const VERSION = '2026-08-21-qiqi-ending-region-v1';",
        sw,
        count=1,
    )
    if count != 1:
        raise RuntimeError("Service-worker VERSION line not found")
    if updated_sw != sw:
        SW_PATH.write_text(updated_sw, encoding="utf-8", newline="\n")
        changed.append(SW_PATH.relative_to(ROOT).as_posix())

    pwa = PWA_PATH.read_text(encoding="utf-8")
    updated_pwa, count = re.subn(
        r"sw\.js\?v=[^'\"]+",
        "sw.js?v=20260821-qiqi-ending-region-v1",
        pwa,
        count=1,
    )
    if count != 1:
        raise RuntimeError("PWA service-worker registration URL not found")
    if updated_pwa != pwa:
        PWA_PATH.write_text(updated_pwa, encoding="utf-8", newline="\n")
        changed.append(PWA_PATH.relative_to(ROOT).as_posix())

    return changed


def validate() -> None:
    js = JS_PATH.read_text(encoding="utf-8")
    css = CSS_PATH.read_text(encoding="utf-8")
    if JS_PATCH_MARKER not in js or "version: '1.3.5'" not in js:
        raise RuntimeError("Ending JavaScript patch validation failed")
    if CSS_MARKER not in css:
        raise RuntimeError("Ending CSS patch validation failed")
    for page in LANGUAGE_PAGES:
        text = page.read_text(encoding="utf-8")
        if '<section class="fq-ending" data-fq-ending>' not in text:
            raise RuntimeError(f"Dedicated ending marker absent in {page.relative_to(ROOT)}")
        if '<section class="fq-ending" data-fq-reveal>' in text:
            raise RuntimeError(f"Generic reveal still attached to ending in {page.relative_to(ROOT)}")

    leftovers: list[str] = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in PUBLIC_TEXT_EXTENSIONS:
            continue
        relative = path.relative_to(ROOT)
        if relative.parts and relative.parts[0] in EXCLUDED_TOP_LEVEL | {"scripts"}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if any(source in text for source, _ in TERM_REPLACEMENTS):
            leftovers.append(relative.as_posix())
    if leftovers:
        raise RuntimeError("Region wording remains in: " + ", ".join(leftovers[:20]))


def main() -> int:
    changed = []
    changed.extend(normalize_region_terms())
    changed.extend(patch_language_pages())
    if patch_css():
        changed.append(CSS_PATH.relative_to(ROOT).as_posix())
    if patch_js():
        changed.append(JS_PATH.relative_to(ROOT).as_posix())
    changed.extend(patch_pwa_cache())
    validate()
    print("Patched ending animation and normalized region wording.")
    for path in sorted(set(changed)):
        print(f"- {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
