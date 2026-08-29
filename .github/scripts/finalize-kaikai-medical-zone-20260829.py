from __future__ import annotations

import re
from pathlib import Path


def ensure_witness_entry(path: Path, section_id: str, href: str, label: str) -> None:
    text = path.read_text(encoding='utf-8')

    # Earlier one-off attempts could place the CTA in a later witness header.
    # Remove every stale copy globally before inserting the single canonical link.
    stale_wrapper = re.compile(
        rf'<div\s+class="official-source-links medical-zone-entry">\s*<a\b[^>]*>\s*{re.escape(label)}\s*</a>\s*</div>',
        re.S,
    )
    text = stale_wrapper.sub('', text)
    stale_anchor = re.compile(
        rf'<a\b[^>]*class="[^"]*medical-zone-entry[^"]*"[^>]*>\s*{re.escape(label)}\s*</a>',
        re.S,
    )
    text = stale_anchor.sub('', text)

    marker = f'id="{section_id}"'
    marker_at = text.find(marker)
    if marker_at < 0:
        raise SystemExit(f'{path}: official medical source section not found')
    section_start = text.rfind('<aside', 0, marker_at)
    section_end = text.find('</aside>', marker_at)
    if section_start < 0 or section_end < 0:
        raise SystemExit(f'{path}: official medical source aside could not be bounded')
    section_end += len('</aside>')
    section = text[section_start:section_end]

    links_open = '<div class="supplement-links">'
    links_at = section.find(links_open)
    if links_at < 0:
        raise SystemExit(f'{path}: supplement-links container not found')
    links_end = section.find('</div>', links_at)
    if links_end < 0:
        raise SystemExit(f'{path}: supplement-links closing tag not found')
    entry = f'<a class="medical-zone-entry" href="{href}">{label}</a>'
    section = section[:links_end] + entry + section[links_end:]
    text = text[:section_start] + section + text[section_end:]
    if text.count(label) != 1:
        raise SystemExit(f'{path}: expected exactly one medical-zone entry label, found {text.count(label)}')
    path.write_text('\n'.join(line.rstrip() for line in text.splitlines()) + '\n', encoding='utf-8')


ensure_witness_entry(
    Path('hearing-records/prison-watch/kaikai-final-chapter/witnesses/index.html'),
    'witness-10-official-sources',
    '../medical-responsibility/',
    '進入醫療責任釐清專區',
)
ensure_witness_entry(
    Path('hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/witnesses/index.html'),
    'witness-10-official-sources',
    '../../medical-responsibility/zh-Hans/',
    '进入医疗责任厘清专区',
)

root = Path('hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility')
for page in [root / 'index.html', root / 'zh-Hans' / 'index.html']:
    text = page.read_text(encoding='utf-8')
    old = 'medical-responsibility.js?v=20260829-1'
    new = 'medical-responsibility.js?v=20260829-2'
    if old in text:
        text = text.replace(old, new, 1)
    if text.count(new) != 1:
        raise SystemExit(f'{page}: JS cache key is missing or duplicated')
    page.write_text(text, encoding='utf-8')

verifier = Path('.github/scripts/verify-kaikai-medical-responsibility-zone-20260829.mjs')
text = verifier.read_text(encoding='utf-8')
text = text.replace(
    "jsPath: '/medical-responsibility/medical-responsibility.js?v=20260829-1'",
    "jsPath: '/medical-responsibility/medical-responsibility.js?v=20260829-2'",
)
text = text.replace(
    "const text = document.body?.innerText || '';",
    "const text = document.body?.textContent || '';",
)
old_wait = """async function waitForHash(page, id) {
  await page.waitForSelector(`#${id}`, { state: 'visible', timeout: 15000 });
  await page.waitForFunction((targetId) => {
    const target = document.getElementById(targetId);
    if (!target || location.hash !== `#${targetId}`) return false;
    const rect = target.getBoundingClientRect();
    return rect.top < innerHeight && rect.bottom > 0;
  }, id, { timeout: 12000 });
  await page.waitForTimeout(350);
}"""
new_wait = """async function waitForHash(page, id) {
  await page.waitForSelector(`#${id}`, { state: 'visible', timeout: 15000 });
  await page.waitForFunction((targetId) => location.hash === `#${targetId}`, id, { timeout: 12000 });
  await page.waitForFunction((targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return false;
    const rect = target.getBoundingClientRect();
    return rect.top < innerHeight && rect.bottom > 0;
  }, id, { timeout: 20000 });
  await page.waitForTimeout(450);
}"""
if old_wait in text:
    text = text.replace(old_wait, new_wait, 1)
elif new_wait not in text:
    raise SystemExit('Browser verifier hash helper was not found')
if text.count("document.body?.textContent || ''") != 1:
    raise SystemExit('Browser verifier textContent patch did not apply')
if text.count('medical-responsibility.js?v=20260829-2') != 2:
    raise SystemExit('Expected both localized verifier JS paths to use v2')
verifier.write_text(text, encoding='utf-8')

required = {
    Path('hearing-records/prison-watch/kaikai-final-chapter/witnesses/index.html'): [
        '進入醫療責任釐清專區', '../medical-responsibility/'
    ],
    Path('hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/witnesses/index.html'): [
        '进入医疗责任厘清专区', '../../medical-responsibility/zh-Hans/'
    ],
    root / 'index.html': ['medical-responsibility.js?v=20260829-2'],
    root / 'zh-Hans' / 'index.html': ['medical-responsibility.js?v=20260829-2'],
}
for path, phrases in required.items():
    page_text = path.read_text(encoding='utf-8')
    for phrase in phrases:
        if phrase not in page_text:
            raise SystemExit(f'{path}: missing {phrase}')

print('Finalized witness entry points, JS cache version, and browser verifier.')
