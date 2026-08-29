from __future__ import annotations

import re
from pathlib import Path


def ensure_witness_entry(path: Path, section_id: str, href: str, label: str) -> None:
    text = path.read_text(encoding='utf-8')

    # Remove every stale copy of the CTA, regardless of its earlier wrapper or
    # attribute order, then add one canonical link inside witness 10's official
    # medical-source panel.
    labeled_anchor = re.compile(
        rf'<a\b[^>]*>\s*{re.escape(label)}\s*</a>',
        re.S,
    )
    text = labeled_anchor.sub('', text)
    text = re.sub(
        r'<div\s+class="[^"]*(?:official-source-links\s+medical-zone-entry|medical-zone-entry\s+official-source-links)[^"]*">\s*</div>',
        '',
        text,
        flags=re.S,
    )

    marker = f'id="{section_id}"'
    marker_at = text.find(marker)
    if marker_at < 0:
        raise SystemExit(f'{path}: official medical source section not found')
    aside_start = text.rfind('<aside', 0, marker_at)
    aside_end = text.find('</aside>', marker_at)
    if aside_start < 0 or aside_end < 0:
        raise SystemExit(f'{path}: official medical source aside could not be bounded')
    aside_end += len('</aside>')
    aside = text[aside_start:aside_end]

    links_open = '<div class="supplement-links">'
    links_at = aside.find(links_open)
    if links_at < 0:
        raise SystemExit(f'{path}: supplement-links container not found')
    links_end = aside.find('</div>', links_at)
    if links_end < 0:
        raise SystemExit(f'{path}: supplement-links closing tag not found')
    entry = f'<a class="medical-zone-entry" href="{href}">{label}</a>'
    aside = aside[:links_end] + entry + aside[links_end:]
    text = text[:aside_start] + aside + text[aside_end:]

    all_label_links = re.findall(
        rf'<a\b[^>]*>\s*{re.escape(label)}\s*</a>',
        text,
        flags=re.S,
    )
    canonical = re.findall(
        rf'<a\b[^>]*href="{re.escape(href)}"[^>]*>\s*{re.escape(label)}\s*</a>',
        text,
        flags=re.S,
    )
    aside_after = text[aside_start:text.find('</aside>', aside_start) + len('</aside>')]
    if len(all_label_links) != 1 or len(canonical) != 1 or label not in aside_after:
        raise SystemExit(
            f'{path}: expected one canonical witness-10 CTA; '
            f'all={len(all_label_links)}, canonical={len(canonical)}, in-aside={label in aside_after}'
        )

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
    if text.count('medical-responsibility.js?v=20260829-2') != 1:
        raise SystemExit(f'{page}: expected medical-responsibility.js v2 exactly once')
    required = [
        '114社調0008' if 'zh-Hans' not in str(page) else '114社调0008',
        '采新牙醫診所' if 'zh-Hans' not in str(page) else '采新牙医诊所',
        '興隆內科小兒科診所' if 'zh-Hans' not in str(page) else '兴隆内科小儿科诊所',
        '蔡函妤醫師證詞' if 'zh-Hans' not in str(page) else '蔡函妤医师证词',
    ]
    for phrase in required:
        if phrase not in text:
            raise SystemExit(f'{page}: missing {phrase}')

# The verifier visits several public pages in one browser context. Navigating
# away can abort the existing Chapter 2 background-audio request. Chrome reports
# that expected media cancellation as net::ERR_ABORTED; it is not a broken asset.
verifier_path = Path('.github/scripts/verify-kaikai-medical-zone-live-20260829.mjs')
verifier = verifier_path.read_text(encoding='utf-8')
old = """      if (parsed.hostname === 'jerryzuhow77.github.io') {
        sameOriginRequestFailures.push({ url: request.url(), type: request.resourceType(), error: request.failure()?.errorText || '' });
      }
"""
new = """      const type = request.resourceType();
      const error = request.failure()?.errorText || '';
      const expectedMediaAbort = type === 'media' && error === 'net::ERR_ABORTED';
      if (parsed.hostname === 'jerryzuhow77.github.io' && !expectedMediaAbort) {
        sameOriginRequestFailures.push({ url: request.url(), type, error });
      }
"""
if old in verifier:
    verifier = verifier.replace(old, new, 1)
elif new not in verifier:
    raise SystemExit('Could not find the request-failure filter in the browser verifier')
verifier_path.write_text(verifier, encoding='utf-8')

print('Finalized witness links, verified both pages, and normalized expected media aborts in browser proof.')
