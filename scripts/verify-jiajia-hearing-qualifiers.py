"""Check local display units, so a distant page disclaimer cannot mask a regression."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUALIFIER = re.compile(r'待官方公告確[認认]|待官方公告确认|尚未取得官方直接公告[確确][認认]|awaiting official confirmation|No direct official announcement|公式発表による確認待ち|公式発表は未確認', re.I)
PRECISE = re.compile(r'16:45|16:30|十五法庭|Courtroom 15|第十五法廷')
units = 0

def check(text, location):
    global units
    if PRECISE.search(text):
        assert QUALIFIER.search(text), f'Unqualified hearing logistics: {location}: {text}'
        units += 1

for path in ROOT.rglob('*.html'):
    if '.git' in path.parts:
        continue
    html = path.read_text(encoding='utf-8', errors='replace')
    if '16:45' not in html:
        continue
    # Dates, compact schedule panels and standalone gathering badges.
    for m in re.finditer(r'<(div|span) class="(date|when|tag)"[^>]*>(.*?)</\1>', html, re.S):
        check(m[3], f'{path.relative_to(ROOT)} .{m[2]}')
    # Each info card must carry its own limitation, including the date card.
    for grid in re.finditer(r'<section class="info-grid">(.*?)</section>', html, re.S):
        for card in re.finditer(r'<article\b[^>]*>(.*?)</article>', grid[1], re.S):
            assert QUALIFIER.search(card[1]), f'Unqualified info card: {path}'
            units += 1
    # Attendance paragraphs, pinned summaries and timeline entries.
    for m in re.finditer(r'<p\b[^>]*>(.*?)</p>', html, re.S):
        if PRECISE.search(m[1]):
            # Timeline attribution is in the immediately preceding heading.
            prefix = html[max(0, m.start()-100):m.start()]
            if '本站掌握之下一次庭期提醒' not in prefix:
                check(m[1], str(path.relative_to(ROOT)))

js = (ROOT / 'assets/news-desk-20260903.js').read_text()
item = re.search(r'jiajiaHearing20261007:.*?summary:\{(.*?)\},article:', js, re.S)
assert item, 'Jiajia news-desk item missing'
for locale, text in re.findall(r"'(zh-Hant|zh-Hans)':'([^']*)'", item[1]):
    check(text, f'news desk {locale}')
feed = json.loads((ROOT / 'data/latest-bulletins.json').read_text())
for section in ('pinned', 'items'):
    for item in feed[section]:
        for locale, text in item.get('summary', {}).items():
            if '16:45' in text:
                check(text, f'bulletins {section} {locale}')
# The homepage card already qualifies its date and has a court-announcement caveat.
for text in re.findall(r"d1:'([^']*16:45[^']*)'", (ROOT / 'index.html').read_text()):
    check(text, 'homepage card')
assert units >= 20, f'Expected hearing render units were not checked: {units}'
print(f'PASS: {units} Jiajia hearing display units retain source limitations.')
