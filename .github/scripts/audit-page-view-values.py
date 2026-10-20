#!/usr/bin/env python3
"""Read-only daily validation of every canonical article counter."""
from concurrent.futures import ThreadPoolExecutor, as_completed
import json, re, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ENGAGEMENT = "https://global-protection.jerryzuhow77.chatgpt.site/api/public/view-count"
WORKER = "https://sweet-art-bed8child-advocacy-page-views.jerryzuhow77.workers.dev/views"
PREFIXES = ("activity-records/", "cases/", "court-comics/", "features/", "hearing-records/", "historical-cases/", "news/")
EXCLUDED = ("child-advocacy-site-main/", "child-advocacy-site/", "global-protection-wall/", "source/")

def route(path):
    value = path.relative_to(ROOT).as_posix()[:-10]
    value = re.sub(r"^(?:en|ja|zh-hans)/", "", value, flags=re.I)
    value = re.sub(r"(^|/)zh-hans/", r"\1", value, flags=re.I)
    value = re.sub(r"/(?:en|ja)/$", "/", value, flags=re.I)
    return value

def slug(value):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9_-]+", "-", value.lower())).strip("-")

def read_json(request):
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)

def validate(item):
    name, current_key, legacy_key, mode = item
    body = json.dumps({"channel":"official-article", "articleKey":current_key, "action":"read"}).encode()
    current = read_json(urllib.request.Request(ENGAGEMENT, data=body, headers={"Content-Type":"application/json", "User-Agent":"CPA-counter-audit"})).get("viewCount")
    query = urllib.parse.urlencode({"page":legacy_key, "increment":"0"})
    legacy = read_json(urllib.request.Request(f"{WORKER}?{query}", headers={"User-Agent":"CPA-counter-audit"})).get("count")
    if not isinstance(current, int) or current < 0 or not isinstance(legacy, int) or legacy < 0:
        raise ValueError(f"invalid values current={current!r}, legacy={legacy!r}")
    effective = current + legacy if mode == "add" else max(current, legacy)
    return name, current, legacy, effective

def main():
    routes = set()
    for path in ROOT.rglob("index.html"):
        rel = path.relative_to(ROOT).as_posix()
        if rel.startswith(EXCLUDED): continue
        html = path.read_text("utf-8", errors="replace")
        if re.search(r'<meta\s+name=["\']robots["\'][^>]*noindex', html, re.I): continue
        value = route(path)
        if value.startswith(PREFIXES) and value.count("/") >= 2: routes.add(value)
    items = []
    for value in routes:
        key = slug(value.rstrip("/"))
        items.append((value, "official-" + key, "page-" + key, "maximum"))
    # Independent Chapter 1 plus Chapter 2's verified migration rule.
    items.append(("Justice-For-Kaikai/", "official--justice-for-kaikai", "justice-for-kaikai", "maximum"))
    items = [x for x in items if x[0] != "hearing-records/prison-watch/kaikai-final-chapter/"]
    items.append(("hearing-records/prison-watch/kaikai-final-chapter/", "kaikai-special-chapter-02-shared", "kaikai-special-chapter-02-shared", "add"))
    errors, results = [], []
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(validate, item): item for item in items}
        for future in as_completed(futures):
            try: results.append(future.result())
            except Exception as error: errors.append(f"{futures[future][0]}: {error}")
    if errors: raise SystemExit("\n".join(sorted(errors)))
    chapter2 = next(row for row in results if row[0].endswith("kaikai-final-chapter/"))
    print(f"Validated {len(results)} canonical articles read-only; Chapter 2={chapter2[3]} ({chapter2[1]}+{chapter2[2]}).")

if __name__ == "__main__": main()
