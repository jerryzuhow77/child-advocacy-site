from pathlib import Path
import re

index = Path('index.html').read_text(encoding='utf-8')
sitemap = Path('sitemap.xml').read_text(encoding='utf-8')

forbidden_index = [
    'data-kaikai-chapter-two-root-entry',
    'data-kaikai-medical-root-entry',
    'data-kaikai-chapter-two-launch',
    'data-kaikai-medical-launch',
    'data-kaikai-chapter-two-card',
    'data-kaikai-medical-card',
    'data-kaikai-chapter-two-footer',
    'data-kaikai-medical-footer',
    'home-kaikai-chapter-two-20260829',
    'hearing-records/prison-watch/kaikai-final-chapter/',
    'kaikai-chapter2-hero-',
    '第二章｜沒人要的孩子',
    '第二章｜没人要的孩子',
    '孩子被選擇的人生',
    '孩子被选择的人生',
    '醫療責任釐清專區',
    '医疗责任厘清专区',
]
present = [token for token in forbidden_index if token in index]
if present:
    numbered = '\n'.join(
        f'{line_no}: {line[:360]}'
        for line_no, line in enumerate(index.splitlines(), 1)
        if any(token in line for token in present)
    )
    raise SystemExit(f'Public Chapter 2 homepage entries remain: {present}\n{numbered}')

pinned_cards = re.findall(
    r'<a\b[^>]*class="[^"]*\bhome-pinned-report-card\b[^"]*"',
    index,
    flags=re.I,
)
if len(pinned_cards) != 4:
    raise SystemExit(f'Expected exactly four pinned report cards, found {len(pinned_cards)}')

required_pinned_links = [
    'https://jerryzuhow77.github.io/Justice-For-Kaikai/',
    './cases/luo-brothers/',
    './activity-records/20260820-taipei-station-advocacy/',
    './activity-records/20260825-111-surplus-donation/',
]
missing = [link for link in required_pinned_links if link not in index]
if missing:
    raise SystemExit(f'Original pinned report links are missing: {missing}')

if '/hearing-records/prison-watch/kaikai-final-chapter/' in sitemap:
    raise SystemExit('Chapter 2 remains discoverable in sitemap.xml')

retained_content = [
    'hearing-records/prison-watch/kaikai-final-chapter/index.html',
    'hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/index.html',
    'hearing-records/prison-watch/kaikai-final-chapter/witnesses/index.html',
    'hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/index.html',
]
missing_content = [path for path in retained_content if not Path(path).is_file()]
if missing_content:
    raise SystemExit(f'Chapter 2 content files were unexpectedly removed: {missing_content}')

print('Chapter 2 is absent from public discovery surfaces; four original pinned reports remain; content files are retained.')
