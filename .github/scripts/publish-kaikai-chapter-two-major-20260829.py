from __future__ import annotations

import re
from pathlib import Path

INDEX = Path('index.html')
NAV_MARKER = '<!-- KAIKAI-CHAPTER-TWO-ROOT-ENTRY-20260829 -->'
LAUNCH_MARKER = '<!-- KAIKAI-CHAPTER-TWO-MAJOR-LAUNCH-20260829 -->'
FOOTER_MARKER = '<!-- KAIKAI-CHAPTER-TWO-FOOTER-20260829 -->'
CSS_HREF = './assets/home-kaikai-chapter-two-20260829.css?v=20260829-1'
JS_SRC = './assets/home-kaikai-chapter-two-20260829.js?v=20260829-1'


def find_balanced(text: str, start_pattern: str, tag: str, label: str) -> tuple[int, int, str]:
    start_match = re.search(start_pattern, text, flags=re.I | re.S)
    if not start_match:
        raise SystemExit(f'{label}: start tag not found')
    depth = 0
    tokens = re.compile(rf'</?{tag}\b[^>]*>', flags=re.I | re.S)
    for token in tokens.finditer(text, start_match.start()):
        raw = token.group(0).lower()
        if raw.startswith(f'</{tag}'):
            depth -= 1
        elif not raw.rstrip().endswith('/>'):
            depth += 1
        if depth == 0:
            return start_match.start(), token.end(), text[start_match.start():token.end()]
    raise SystemExit(f'{label}: unclosed {tag}')


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one match, found {count}')
    return text.replace(old, new, 1)


CHAPTER_TWO_NAV = '''<!-- KAIKAI-CHAPTER-TWO-ROOT-ENTRY-20260829 -->
<div class="special-feature-prologue-group is-kaikai-chapter-two" data-kaikai-chapter-two-root-entry>
<button class="special-feature-menu-prologue" type="button" aria-expanded="false" aria-controls="specialFeatureChapterTwoZh"><span><small>CHAPTER 02 · NEW MAJOR CHAPTER</small><strong data-chapter2-hant="第二章｜沒人要的孩子？" data-chapter2-hans="第二章｜没人要的孩子？">第二章｜沒人要的孩子？</strong><span data-chapter2-hant="孩子被選擇的人生 × 家外安置 × 監察院報告 × 制度責任" data-chapter2-hans="孩子被选择的人生 × 家外安置 × 监察院报告 × 制度责任">孩子被選擇的人生 × 家外安置 × 監察院報告 × 制度責任</span></span><b aria-hidden="true">›</b></button>
<div class="special-feature-prologue-children" id="specialFeatureChapterTwoZh">
<a class="special-feature-menu-card" href="./hearing-records/prison-watch/kaikai-final-chapter/" data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/">
<span class="special-feature-menu-art"><img alt="剴剴案第二章主視覺" data-chapter2-hant-alt="剴剴案第二章主視覺" data-chapter2-hans-alt="剀剀案第二章主视觉" src="./assets/art/kaikai-chapter2-hero-zh-Hant-20260828-v3.jpg" data-chapter2-hant-src="./assets/art/kaikai-chapter2-hero-zh-Hant-20260828-v3.jpg" data-chapter2-hans-src="./assets/art/kaikai-chapter2-hero-zh-Hans-20260828-v3.jpg" loading="lazy" decoding="async"></span>
<span class="special-feature-menu-copy"><small>ENTER CHAPTER 02</small><strong data-chapter2-hant="進入第二章｜沒人要的孩子？" data-chapter2-hans="进入第二章｜没人要的孩子？">進入第二章｜沒人要的孩子？</strong><span data-chapter2-hant="從115天生命紀錄、13名證人、家外安置缺陷、監察院報告到醫療責任，建立完整制度責任圖。" data-chapter2-hans="从115天生命纪录、13名证人、家外安置缺陷、监察院报告到医疗责任，建立完整制度责任图。">從115天生命紀錄、13名證人、家外安置缺陷、監察院報告到醫療責任，建立完整制度責任圖。</span><b data-chapter2-hant="開始閱讀" data-chapter2-hans="开始阅读">開始閱讀 <em aria-hidden="true">→</em></b></span>
</a>
<a class="special-feature-prologue-link" href="./hearing-records/prison-watch/kaikai-final-chapter/#chapter-brief" data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/#chapter-brief" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/#chapter-brief"><small>5-MINUTE BRIEF</small><strong data-chapter2-hant="五分鐘重點" data-chapter2-hans="五分钟重点">五分鐘重點</strong><span data-chapter2-hant="先看法院、監察院、醫療警訊與全章核心結論" data-chapter2-hans="先看法院、监察院、医疗警讯与全章核心结论">先看法院、監察院、醫療警訊與全章核心結論</span><b aria-hidden="true">→</b></a>
<a class="special-feature-prologue-link" href="./hearing-records/prison-watch/kaikai-final-chapter/#placement-spectrum" data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/#placement-spectrum" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/#placement-spectrum"><small>OUT-OF-HOME CARE</small><strong data-chapter2-hant="家外安置制度" data-chapter2-hans="家外安置制度">家外安置制度</strong><span data-chapter2-hant="八項制度缺陷、國家保護義務與返家／永續安排" data-chapter2-hans="八项制度缺陷、国家保护义务与返家／永续安排">八項制度缺陷、國家保護義務與返家／永續安排</span><b aria-hidden="true">→</b></a>
<a class="special-feature-prologue-link" href="./hearing-records/prison-watch/kaikai-final-chapter/#placement-harm-cases" data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/#placement-harm-cases" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/#placement-harm-cases"><small>REAL HARM EVIDENCE</small><strong data-chapter2-hant="實際傷害案例" data-chapter2-hans="实际伤害案例">實際傷害案例</strong><span data-chapter2-hant="剴剴案、返家後再受虐、機構不當對待與系統性性暴力證據" data-chapter2-hans="剀剀案、返家后再受虐、机构不当对待与系统性性暴力证据">剴剴案、返家後再受虐、機構不當對待與系統性性暴力證據</span><b aria-hidden="true">→</b></a>
<a class="special-feature-prologue-link" href="./hearing-records/prison-watch/kaikai-final-chapter/#system" data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/#system" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/#system"><small>RESPONSIBILITY MAP</small><strong data-chapter2-hant="責任連動與五層責任樹" data-chapter2-hans="责任联动与五层责任树">責任連動與五層責任樹</strong><span data-chapter2-hant="雙軌責任關係、中央地方主管、兒盟及第一線專業" data-chapter2-hans="双轨责任关系、中央地方主管、儿盟及一线专业">雙軌責任關係、中央地方主管、兒盟及第一線專業</span><b aria-hidden="true">→</b></a>
<a class="special-feature-prologue-link" href="./hearing-records/prison-watch/kaikai-final-chapter/witnesses/" data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/witnesses/" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/witnesses/"><small>13 WITNESSES</small><strong data-chapter2-hant="13名證人全文" data-chapter2-hans="13名证人全文">13名證人全文</strong><span data-chapter2-hant="逐人整理角色、關鍵證詞、衝突與證據限制" data-chapter2-hans="逐人整理角色、关键证词、冲突与证据限制">逐人整理角色、關鍵證詞、衝突與證據限制</span><b aria-hidden="true">→</b></a>
</div></div>'''

CHAPTER_TWO_LAUNCH = '''<!-- KAIKAI-CHAPTER-TWO-MAJOR-LAUNCH-20260829 -->
<section class="home-chapter-two-launch" id="home-kaikai-chapter-two" aria-labelledby="homeKaikaiChapterTwoTitle" data-kaikai-chapter-two-launch>
<div class="container home-chapter-two-launch-shell">
<figure class="home-chapter-two-launch-media">
<a href="./hearing-records/prison-watch/kaikai-final-chapter/" data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/" data-chapter2-hant-aria-label="進入剴剴案第二章主頁" data-chapter2-hans-aria-label="进入剀剀案第二章主页" aria-label="進入剴剴案第二章主頁">
<img src="./assets/art/kaikai-chapter2-hero-zh-Hant-20260828-v3.jpg" data-chapter2-hant-src="./assets/art/kaikai-chapter2-hero-zh-Hant-20260828-v3.jpg" data-chapter2-hans-src="./assets/art/kaikai-chapter2-hero-zh-Hans-20260828-v3.jpg" data-chapter2-hant-alt="剴剴案第二章主視覺：沒人要的孩子，孩子被選擇的人生" data-chapter2-hans-alt="剀剀案第二章主视觉：没人要的孩子，孩子被选择的人生" alt="剴剴案第二章主視覺：沒人要的孩子，孩子被選擇的人生" width="1672" height="941" loading="eager" decoding="async" fetchpriority="high">
</a>
<figcaption data-chapter2-hant="第二章主頁已擴充為制度責任長卷：人物、機構、醫療、家外安置與真實傷害案例同頁勾稽。" data-chapter2-hans="第二章主页已扩充为制度责任长卷：人物、机构、医疗、家外安置与真实伤害案例同页勾稽。">第二章主頁已擴充為制度責任長卷：人物、機構、醫療、家外安置與真實傷害案例同頁勾稽。</figcaption>
</figure>
<div class="home-chapter-two-launch-copy">
<p class="home-chapter-two-launch-eyebrow">NEW MAJOR CHAPTER · CHAPTER 02</p>
<h2 id="homeKaikaiChapterTwoTitle"><span data-chapter2-hant="孩子被選擇的人生" data-chapter2-hans="孩子被选择的人生">孩子被選擇的人生</span><b data-chapter2-hant="第二章｜沒人要的孩子？" data-chapter2-hans="第二章｜没人要的孩子？">第二章｜沒人要的孩子？</b></h2>
<p data-chapter2-hant="從剴剴的115天生命紀錄出發，沿著13名證人、監察院調查、醫療警訊、雙軌責任關係與台灣家外安置制度，追問孩子被交付、被媒合、被安置以後，究竟由誰持續確認安全。" data-chapter2-hans="从剀剀的115天生命纪录出发，沿着13名证人、监察院调查、医疗警讯、双轨责任关系与台湾家外安置制度，追问孩子被交付、被媒合、被安置以后，究竟由谁持续确认安全。">從剴剴的115天生命紀錄出發，沿著13名證人、監察院調查、醫療警訊、雙軌責任關係與台灣家外安置制度，追問孩子被交付、被媒合、被安置以後，究竟由誰持續確認安全。</p>
<div class="home-chapter-two-launch-badges" aria-label="第二章內容重點"><span data-chapter2-hant="新大篇章" data-chapter2-hans="新大篇章">新大篇章</span><span data-chapter2-hant="監察院報告" data-chapter2-hans="监察院报告">監察院報告</span><span data-chapter2-hant="家外安置制度" data-chapter2-hans="家外安置制度">家外安置制度</span><span data-chapter2-hant="實際傷害案例" data-chapter2-hans="实际伤害案例">實際傷害案例</span><span data-chapter2-hant="13名證人" data-chapter2-hans="13名证人">13名證人</span></div>
<div class="home-chapter-two-launch-actions"><a href="./hearing-records/prison-watch/kaikai-final-chapter/" data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/" data-chapter2-hant="進入第二章主頁" data-chapter2-hans="进入第二章主页">進入第二章主頁</a><a href="./hearing-records/prison-watch/kaikai-final-chapter/#chapter-brief" data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/#chapter-brief" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/#chapter-brief" data-chapter2-hant="先看五分鐘重點" data-chapter2-hans="先看五分钟重点">先看五分鐘重點</a><a href="./hearing-records/prison-watch/kaikai-final-chapter/#placement-harm-cases" data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/#placement-harm-cases" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/#placement-harm-cases" data-chapter2-hant="查看實際傷害案例" data-chapter2-hans="查看实际伤害案例">查看實際傷害案例</a></div>
<div class="home-chapter-two-launch-stats" aria-label="第二章內容規模"><div><strong>8</strong><span data-chapter2-hant="項家外安置制度缺陷" data-chapter2-hans="项家外安置制度缺陷">項家外安置制度缺陷</span></div><div><strong>4</strong><span data-chapter2-hant="組真實傷害證據" data-chapter2-hans="组真实伤害证据">組真實傷害證據</span></div><div><strong>7</strong><span data-chapter2-hant="步醫療安全閉環" data-chapter2-hans="步医疗安全闭环">步醫療安全閉環</span></div><div><strong>13</strong><span data-chapter2-hant="名證人全文整理" data-chapter2-hans="名证人全文整理">名證人全文整理</span></div></div>
</div>
</div>
</section>'''

CHAPTER_TWO_CARD = '''<a class="home-crafted-card is-kaikai-chapter-two" role="listitem" href="./hearing-records/prison-watch/kaikai-final-chapter/" data-kaikai-chapter-two-card data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/" data-chapter2-hant-aria-label="閱讀剴剴案第二章" data-chapter2-hans-aria-label="阅读剀剀案第二章" aria-label="閱讀剴剴案第二章"><span class="home-crafted-art"><img src="./assets/art/kaikai-chapter2-hero-zh-Hant-20260828-v3.jpg" data-chapter2-hant-src="./assets/art/kaikai-chapter2-hero-zh-Hant-20260828-v3.jpg" data-chapter2-hans-src="./assets/art/kaikai-chapter2-hero-zh-Hans-20260828-v3.jpg" data-chapter2-hant-alt="剴剴案第二章主視覺" data-chapter2-hans-alt="剀剀案第二章主视觉" alt="剴剴案第二章主視覺" loading="lazy" decoding="async"><i aria-hidden="true" data-chapter2-hant="08.29 · 剴剴案第二章" data-chapter2-hans="08.29 · 剀剀案第二章">08.29 · 剴剴案第二章</i></span><span class="home-crafted-copy"><small data-chapter2-hant="2026.08.29 · 新大篇章 × 制度責任" data-chapter2-hans="2026.08.29 · 新大篇章 × 制度责任">2026.08.29 · 新大篇章 × 制度責任</small><strong data-chapter2-hant="第二章｜沒人要的孩子？" data-chapter2-hans="第二章｜没人要的孩子？">第二章｜沒人要的孩子？</strong><em data-chapter2-hant="孩子被選擇的人生：從115天、13名證人與監察院報告，追到家外安置、醫療漏接與每一層本可接住孩子的責任。" data-chapter2-hans="孩子被选择的人生：从115天、13名证人与监察院报告，追到家外安置、医疗漏接与每一层本可接住孩子的责任。">孩子被選擇的人生：從115天、13名證人與監察院報告，追到家外安置、醫療漏接與每一層本可接住孩子的責任。</em><b data-chapter2-hant="閱讀第二章 →" data-chapter2-hans="阅读第二章 →">閱讀第二章 →</b></span></a>'''

FOOTER_LINK = '''<!-- KAIKAI-CHAPTER-TWO-FOOTER-20260829 --><a href="./hearing-records/prison-watch/kaikai-final-chapter/" data-kaikai-chapter-two-footer data-chapter2-hant-href="./hearing-records/prison-watch/kaikai-final-chapter/" data-chapter2-hans-href="./hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/" data-chapter2-hant="第二章｜沒人要的孩子？" data-chapter2-hans="第二章｜没人要的孩子？">第二章｜沒人要的孩子？</a>'''

text = INDEX.read_text(encoding='utf-8')

if CSS_HREF not in text:
    text = replace_once(text, '</head>', f'<link rel="stylesheet" href="{CSS_HREF}">\n<script src="{JS_SRC}" defer></script>\n</head>', 'homepage head assets')
elif JS_SRC not in text:
    text = replace_once(text, '</head>', f'<script src="{JS_SRC}" defer></script>\n</head>', 'homepage Chapter 2 script')

if NAV_MARKER not in text:
    medical_marker = '<!-- KAIKAI-MEDICAL-ROOT-ENTRY-20260829 -->'
    if text.count(medical_marker) != 1:
        raise SystemExit(f'Medical root marker expected once, found {text.count(medical_marker)}')
    text = text.replace(medical_marker, CHAPTER_TWO_NAV + '\n' + medical_marker, 1)

if LAUNCH_MARKER not in text:
    priority_start, priority_end, _ = find_balanced(
        text,
        r'<section\b[^>]*\bclass="[^"]*home-priority-strip[^"]*"[^>]*>',
        'section',
        'homepage priority strip',
    )
    text = text[:priority_end] + '\n' + CHAPTER_TWO_LAUNCH + text[priority_end:]

card_pattern = r'<a\b[^>]*\bclass="[^"]*(?:is-kaikai-final-chapter|is-kaikai-chapter-two)[^"]*"[^>]*>'
card_start, card_end, _ = find_balanced(text, card_pattern, 'a', 'existing Chapter 2 homepage card')
text = text[:card_start] + text[card_end:]
chapter_one_match = re.search(r'<a\b[^>]*\bclass="[^"]*is-kaikai-chapter-one[^"]*"[^>]*>', text, flags=re.I | re.S)
if not chapter_one_match:
    raise SystemExit('Chapter 1 homepage card not found')
text = text[:chapter_one_match.start()] + CHAPTER_TWO_CARD + '\n' + text[chapter_one_match.start():]

if FOOTER_MARKER not in text:
    footer_anchor = '<section><h2>內容專區</h2><a href="#home-special-features">特別專題</a>'
    text = replace_once(text, footer_anchor, footer_anchor + FOOTER_LINK, 'homepage footer Chapter 2 link')

if '特定專題（章節 01' in text:
    text = re.sub(
        r'特定專題（章節 01[^）]*）',
        '特定專題（章節 01＋章節 02＋醫療責任釐清專區＋13 名證人全文）',
        text,
        count=1,
    )

required_counts = {
    NAV_MARKER: 1,
    LAUNCH_MARKER: 1,
    FOOTER_MARKER: 1,
    'data-kaikai-chapter-two-root-entry': 1,
    'data-kaikai-chapter-two-launch': 1,
    'data-kaikai-chapter-two-card': 1,
    'class="special-feature-prologue-group is-kaikai-chapter-one"': 1,
    'data-kaikai-medical-root-entry': 1,
    CSS_HREF: 1,
    JS_SRC: 1,
}
for phrase, expected in required_counts.items():
    count = text.count(phrase)
    if count != expected:
        raise SystemExit(f'{phrase}: expected {expected}, found {count}')

if 'is-kaikai-final-chapter' in text:
    raise SystemExit('Legacy final-chapter homepage card remains')
if '悲劇不忘・終章｜剴剴的672天' in text:
    raise SystemExit('Legacy final-chapter title remains')
if text.find('data-kaikai-chapter-two-card') > text.find('class="home-crafted-card is-kaikai-chapter-one"'):
    raise SystemExit('Chapter 2 card was not promoted ahead of Chapter 1')

nav_start, nav_end, nav_block = find_balanced(
    text,
    r'<div\b[^>]*\bdata-kaikai-chapter-two-root-entry[^>]*>',
    'div',
    'Chapter 2 root navigation group',
)
if nav_block.count('<a ') != 6:
    raise SystemExit(f'Chapter 2 navigation expected six links, found {nav_block.count("<a ")}')
if nav_block.count('specialFeatureChapterTwoZh') != 2:
    raise SystemExit('Chapter 2 navigation controls are not wired uniquely')

launch_start, launch_end, launch_block = find_balanced(
    text,
    r'<section\b[^>]*\bdata-kaikai-chapter-two-launch[^>]*>',
    'section',
    'Chapter 2 major launch section',
)
if launch_block.count('home-chapter-two-launch-actions') != 1 or launch_block.count('home-chapter-two-launch-stats') != 1:
    raise SystemExit('Chapter 2 launch actions or stats are missing')
if launch_block.count('data-chapter2-hans-href') < 4:
    raise SystemExit('Chapter 2 launch lacks localized links')

INDEX.write_text('\n'.join(line.rstrip() for line in text.splitlines()) + '\n', encoding='utf-8')
print('Published Chapter 2 as a new major homepage chapter.')
