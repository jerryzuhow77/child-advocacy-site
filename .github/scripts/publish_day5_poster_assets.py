from __future__ import annotations

import html
import json
import os
import re
from pathlib import Path

ROOT = Path('.')
ASSET_DIR = ROOT / 'assets/art'
ASSET_NAMES = {
    'forensic_hant': 'prison-watch-day5-forensic-zh-hant-20260822.webp',
    'forensic_hans': 'prison-watch-day5-forensic-zh-hans-20260822.webp',
    'medical_hant': 'prison-watch-day5-medical-zh-hant-20260822.webp',
    'medical_hans': 'prison-watch-day5-medical-zh-hans-20260822.webp',
}
ABSOLUTE = 'https://jerryzuhow77.github.io/child-advocacy-site/assets/art/'
PAGES = [
    ROOT / 'hearing-records/prison-watch/kaikai-day5-20250429/index.html',
    ROOT / 'en/hearing-records/prison-watch/kaikai-day5-20250429/index.html',
    ROOT / 'ja/hearing-records/prison-watch/kaikai-day5-20250429/index.html',
    ROOT / 'source/hearing-records/prison-watch/kaikai-day5-20250429/index.html',
    ROOT / 'source/en/hearing-records/prison-watch/kaikai-day5-20250429/index.html',
    ROOT / 'source/ja/hearing-records/prison-watch/kaikai-day5-20250429/index.html',
]


def relative(page: Path, asset_name: str) -> str:
    return os.path.relpath(ASSET_DIR / asset_name, page.parent).replace(os.sep, '/')


def set_attr(tag: str, name: str, value: str) -> str:
    escaped = html.escape(value, quote=True)
    pattern = rf'\s{name}="[^"]*"'
    replacement = f' {name}="{escaped}"'
    if re.search(pattern, tag):
        return re.sub(pattern, replacement, tag, count=1)
    return tag[:-1] + replacement + '>'


def update_img(text: str, page: Path, number: int, traditional: str, simplified: str, alt: str) -> str:
    pattern = re.compile(rf'<img\b[^>]*\bdata-day5-poster="{number}"[^>]*>', re.I)
    matches = pattern.findall(text)
    if len(matches) != 1:
        raise SystemExit(f'Expected one poster {number} in {page}, found {len(matches)}')

    def replacement(match: re.Match[str]) -> str:
        tag = match.group(0)
        tag = set_attr(tag, 'data-traditional', relative(page, traditional))
        tag = set_attr(tag, 'data-simplified', relative(page, simplified))
        tag = set_attr(tag, 'src', relative(page, traditional))
        tag = set_attr(tag, 'alt', alt)
        tag = set_attr(tag, 'width', '1024')
        tag = set_attr(tag, 'height', '1536')
        tag = set_attr(tag, 'decoding', 'async')
        tag = set_attr(tag, 'loading', 'eager' if number == 1 else 'lazy')
        return tag

    return pattern.sub(replacement, text, count=1)


for page in PAGES:
    text = page.read_text(encoding='utf-8')
    path_string = page.as_posix()
    if '/en/' in path_string:
        alt_one = 'Day 5 forensic cause-of-death and medical-evidence poster'
        alt_two = 'Day 5 child-protection medical assessment and care-neglect poster'
    elif '/ja/' in path_string:
        alt_one = '第5回公判期日・法医死因鑑定と医学証拠のポスター'
        alt_two = '第5回公判期日・児童保護医療鑑定と養育ネグレクトのポスター'
    else:
        alt_one = '第五日法醫研判與死亡機轉專屬主視覺'
        alt_two = '第五日兒少保護醫療鑑定與照顧疏忽專屬主視覺'

    text = update_img(text, page, 1, ASSET_NAMES['forensic_hant'], ASSET_NAMES['forensic_hans'], alt_one)
    text = update_img(text, page, 2, ASSET_NAMES['medical_hant'], ASSET_NAMES['medical_hans'], alt_two)

    og_url = ABSOLUTE + ASSET_NAMES['forensic_hant']
    text = re.sub(r'(<meta\s+property="og:image"\s+content=")[^"]*(")', rf'\1{og_url}\2', text, count=1)
    text = re.sub(r'(<meta\s+name="twitter:image"\s+content=")[^"]*(")', rf'\1{og_url}\2', text, count=1)
    text = re.sub(r'("image"\s*:\s*")[^"]*(")', rf'\1{og_url}\2', text, count=1)
    page.write_text(text, encoding='utf-8')

record_files = [
    (ROOT / 'data/hearing-records.json', '../assets/art/' + ASSET_NAMES['forensic_hant']),
    (ROOT / 'en/data/hearing-records.json', '../../assets/art/' + ASSET_NAMES['forensic_hant']),
    (ROOT / 'ja/data/hearing-records.json', '../../assets/art/' + ASSET_NAMES['forensic_hant']),
    (ROOT / 'source/data/hearing-records.json', '../assets/art/' + ASSET_NAMES['forensic_hant']),
    (ROOT / 'source/en/data/hearing-records.json', '../../assets/art/' + ASSET_NAMES['forensic_hant']),
    (ROOT / 'source/ja/data/hearing-records.json', '../../assets/art/' + ASSET_NAMES['forensic_hant']),
]
for path, image in record_files:
    data = json.loads(path.read_text(encoding='utf-8'))
    entry = next((item for item in data if item.get('url') == 'prison-watch/kaikai-day5-20250429/'), None)
    if entry is None:
        raise SystemExit(f'Day 5 entry missing from {path}')
    entry['image'] = image
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

bulletins = ROOT / 'data/latest-bulletins.json'
if bulletins.exists():
    data = json.loads(bulletins.read_text(encoding='utf-8'))
    item = next((entry for entry in data.get('items', []) if entry.get('id') == 'kaikai-day5-20250429'), None)
    if item is not None:
        item['image'] = ABSOLUTE + ASSET_NAMES['forensic_hant']
        bulletins.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

sw = ROOT / 'sw.js'
if sw.exists():
    text = sw.read_text(encoding='utf-8')
    text = re.sub(r"const VERSION = '[^']+';", "const VERSION = '2026-08-22-day5-dedicated-posters-v1';", text, count=1)
    resources = [f"./assets/art/{name}" for name in ASSET_NAMES.values()]
    start = text.find('const APP_SHELL = [')
    end = text.find('];', start)
    if start >= 0 and end >= 0:
        segment = text[start:end]
        missing = [resource for resource in resources if resource not in segment]
        if missing:
            prefix = text[:end].rstrip()
            if not prefix.endswith(','):
                prefix += ','
            prefix += '\n' + ',\n'.join(f"  '{resource}'" for resource in missing) + '\n'
            text = prefix + text[end:]
    sw.write_text(text, encoding='utf-8')

for name in ASSET_NAMES.values():
    path = ASSET_DIR / name
    if not path.is_file() or path.stat().st_size < 50_000:
        raise SystemExit(f'Missing or undersized poster: {path}')

for page in PAGES:
    text = page.read_text(encoding='utf-8')
    for name in ASSET_NAMES.values():
        if name not in text:
            raise SystemExit(f'Dedicated poster reference {name} missing from {page}')
    if 'data-day5-poster="1"' not in text or 'data-day5-poster="2"' not in text:
        raise SystemExit(f'Poster hooks missing from {page}')
    if 'prison-watch-day4-hearing-poster-clay-20260821-v2.webp' in text:
        raise SystemExit(f'Day 4 fallback remains in Day 5 page: {page}')

for path in [
    'data/hearing-records.json',
    'en/data/hearing-records.json',
    'ja/data/hearing-records.json',
    'source/data/hearing-records.json',
    'source/en/data/hearing-records.json',
    'source/ja/data/hearing-records.json',
    'data/latest-bulletins.json',
]:
    candidate = ROOT / path
    if candidate.exists():
        json.loads(candidate.read_text(encoding='utf-8'))

print('Day 5 poster assets and references validated.')
