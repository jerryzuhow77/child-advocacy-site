from pathlib import Path
import re

JS_PATH = Path("hearing-records/prison-watch/kaikai-final-chapter/final-chapter.js")
PAGES = (
    Path("hearing-records/prison-watch/kaikai-final-chapter/index.html"),
    Path("hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/index.html"),
)

js = JS_PATH.read_text(encoding="utf-8")
old = """  const revealedSections = new Set();
  if (!closestSection) return revealedSections;

  let section = closestSection;"""
new = """  const revealedSections = new Set();
  if (!target) return revealedSections;
  revealTargetForNavigation(target);
  if (!closestSection) {
    if (scroll) stabilizeHashTarget(target, true);
    return revealedSections;
  }

  let section = closestSection;"""

if new not in js:
    if js.count(old) != 1:
        raise SystemExit(f"Expected one nested-target guard, found {js.count(old)}")
    js = js.replace(old, new, 1)
    JS_PATH.write_text(js, encoding="utf-8")

cache_pattern = re.compile(r"final-chapter\.js\?v=\d{8}-\d+")
for page in PAGES:
    html = page.read_text(encoding="utf-8")
    matches = cache_pattern.findall(html)
    if len(matches) != 1:
        raise SystemExit(f"{page}: expected one JavaScript cache key, found {len(matches)}")
    html = cache_pattern.sub("final-chapter.js?v=20260829-7", html, count=1)
    page.write_text(html, encoding="utf-8")

print("Generic nested hash-target handling applied")
