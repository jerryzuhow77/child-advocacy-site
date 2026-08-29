from __future__ import annotations

import re
from pathlib import Path

ROOT = Path('hearing-records/prison-watch/kaikai-final-chapter')
MARKER = '<!-- MEDICAL-RESPONSIBILITY-NAV-20260829 -->'


def replace_nav_group(text: str, summary: str, medical_links: set[str], new_group: str, label: str) -> str:
    pattern = re.compile(
        rf'<details class="nav-group"><summary>{re.escape(summary)}</summary><div class="nav-submenu">(?P<body>.*?)</div></details>',
        re.S,
    )
    match = pattern.search(text)
    if not match:
        raise SystemExit(f'{label}: navigation group not found')
    body = match.group('body')
    anchor_pattern = re.compile(r'<a\s+href="([^"]+)"[^>]*>.*?</a>', re.S)
    anchors = anchor_pattern.findall(body)
    missing = medical_links.difference(anchors)
    if missing:
        raise SystemExit(f'{label}: medical links missing from original group: {sorted(missing)}')
    cleaned = anchor_pattern.sub(lambda m: '' if re.search(r'href="([^"]+)"', m.group(0)).group(1) in medical_links else m.group(0), body)
    cleaned_group = f'<details class="nav-group"><summary>{summary}</summary><div class="nav-submenu">{cleaned}</div></details>'
    replacement = cleaned_group + new_group
    return text[:match.start()] + replacement + text[match.end():]


def insert_hero_link(text: str, href: str, label: str, file_label: str) -> str:
    if f'href="{href}"' in text and label in text:
        return text
    start = text.find('<div class="hero-actions">')
    if start < 0:
        raise SystemExit(f'{file_label}: hero actions not found')
    end = text.find('</div>', start)
    if end < 0:
        raise SystemExit(f'{file_label}: hero actions closing tag not found')
    link = f'<a class="button secondary-link medical-zone-entry" href="{href}">{label}</a>'
    return text[:end] + link + text[end:]


def insert_witness_cta(text: str, section_id: str, href: str, label: str, file_label: str) -> str:
    if href in text and label in text:
        return text
    marker = f'id="{section_id}"'
    start = text.find(marker)
    if start < 0:
        raise SystemExit(f'{file_label}: official medical source section not found')
    header_end = text.find('</header>', start)
    if header_end < 0:
        raise SystemExit(f'{file_label}: official source header closing tag not found')
    cta = f'<div class="official-source-links medical-zone-entry"><a href="{href}">{label}</a></div>'
    return text[:header_end] + cta + text[header_end:]


traditional_parent = ROOT / 'index.html'
traditional = traditional_parent.read_text(encoding='utf-8')
if MARKER not in traditional:
    medical_group = (
        f'{MARKER}'
        '<details class="nav-group"><summary>醫療責任</summary><div class="nav-submenu">'
        '<a href="./medical-responsibility/">醫療責任釐清專區</a>'
        '<a href="#dental-warning">牙醫警訊</a>'
        '<a href="#medical-network-omissions">醫療漏接</a>'
        '<a href="#death-temperature-evidence">24°C與離世時間</a>'
        '<a href="./witnesses/#witness-10">蔡函妤醫師證詞</a>'
        '</div></details>'
    )
    traditional = replace_nav_group(
        traditional,
        '證據勾稽',
        {'#dental-warning', '#medical-network-omissions', '#death-temperature-evidence'},
        medical_group,
        str(traditional_parent),
    )
traditional = insert_hero_link(traditional, './medical-responsibility/', '醫療責任釐清專區', str(traditional_parent))
if traditional.count('./medical-responsibility/') < 2:
    raise SystemExit('Traditional parent does not expose the medical zone in both menu and hero')
if traditional.count('<summary>醫療責任</summary>') != 1:
    raise SystemExit('Traditional medical menu group count is not one')
traditional_parent.write_text(traditional, encoding='utf-8')

simplified_parent = ROOT / 'zh-Hans' / 'index.html'
simplified = simplified_parent.read_text(encoding='utf-8')
if MARKER not in simplified:
    medical_group = (
        f'{MARKER}'
        '<details class="nav-group"><summary>医疗责任</summary><div class="nav-submenu">'
        '<a href="../medical-responsibility/zh-Hans/">医疗责任厘清专区</a>'
        '<a href="#dental-warning">牙医警讯</a>'
        '<a href="#medical-network-omissions">医疗漏接</a>'
        '<a href="#death-temperature-evidence">24°C与离世时间</a>'
        '<a href="./witnesses/#witness-10">蔡函妤医师证词</a>'
        '</div></details>'
    )
    simplified = replace_nav_group(
        simplified,
        '证据勾稽',
        {'#dental-warning', '#medical-network-omissions', '#death-temperature-evidence'},
        medical_group,
        str(simplified_parent),
    )
simplified = insert_hero_link(simplified, '../medical-responsibility/zh-Hans/', '医疗责任厘清专区', str(simplified_parent))
if simplified.count('../medical-responsibility/zh-Hans/') < 2:
    raise SystemExit('Simplified parent does not expose the medical zone in both menu and hero')
if simplified.count('<summary>医疗责任</summary>') != 1:
    raise SystemExit('Simplified medical menu group count is not one')
simplified_parent.write_text(simplified, encoding='utf-8')

traditional_witness = ROOT / 'witnesses' / 'index.html'
witness_text = traditional_witness.read_text(encoding='utf-8')
witness_text = insert_witness_cta(
    witness_text,
    'witness-10-official-sources',
    '../medical-responsibility/',
    '進入醫療責任釐清專區',
    str(traditional_witness),
)
if witness_text.count('../medical-responsibility/') != 1:
    raise SystemExit('Traditional witness medical-zone link count is not one')
traditional_witness.write_text(witness_text, encoding='utf-8')

simplified_witness = ROOT / 'zh-Hans' / 'witnesses' / 'index.html'
simplified_witness_text = simplified_witness.read_text(encoding='utf-8')
simplified_witness_text = insert_witness_cta(
    simplified_witness_text,
    'witness-10-official-sources',
    '../../medical-responsibility/zh-Hans/',
    '进入医疗责任厘清专区',
    str(simplified_witness),
)
if simplified_witness_text.count('../../medical-responsibility/zh-Hans/') != 1:
    raise SystemExit('Simplified witness medical-zone link count is not one')
simplified_witness.write_text(simplified_witness_text, encoding='utf-8')

for path in [traditional_parent, simplified_parent, traditional_witness, simplified_witness]:
    content = path.read_text(encoding='utf-8')
    normalized = '\n'.join(line.rstrip() for line in content.splitlines()) + '\n'
    path.write_text(normalized, encoding='utf-8')

print('Patched parent main menus, hero links, and witness entry points.')
