from __future__ import annotations

import re
from pathlib import Path

ROOT = Path('hearing-records/prison-watch/kaikai-final-chapter')
HTML_MARKER = '<!-- OUT-OF-HOME-MAJOR-CHAPTER-20260829 -->'
NAV_MARKER = '<!-- OUT-OF-HOME-MAJOR-NAV-20260829 -->'
CSS_MARKER = '/* OUT-OF-HOME-MAJOR-CHAPTER-20260829 */'


def find_balanced(text: str, start_pattern: str, tag: str, label: str) -> tuple[int, int, str]:
    start_match = re.search(start_pattern, text, flags=re.I | re.S)
    if not start_match:
        raise SystemExit(f'{label}: start tag not found')
    depth = 0
    token_pattern = re.compile(rf'</?{tag}\b[^>]*>', flags=re.I | re.S)
    for token in token_pattern.finditer(text, start_match.start()):
        raw = token.group(0).lower()
        if raw.startswith(f'</{tag}'):
            depth -= 1
        elif not raw.rstrip().endswith('/>'):
            depth += 1
        if depth == 0:
            return start_match.start(), token.end(), text[start_match.start():token.end()]
    raise SystemExit(f'{label}: unclosed {tag}')


def promote_navigation(text: str, summary: str, major_group: str, label: str) -> str:
    start, end, group = find_balanced(
        text,
        rf'<details\b[^>]*\bclass="[^"]*nav-group[^"]*"[^>]*>\s*<summary>{re.escape(summary)}</summary>',
        'details',
        f'{label} responsibility navigation group',
    )
    for href in ('#placement-spectrum', '#placement-harm-cases'):
        group, count = re.subn(
            rf'<a\s+href="{re.escape(href)}"[^>]*>.*?</a>',
            '',
            group,
            count=1,
            flags=re.S,
        )
        if count != 1:
            raise SystemExit(f'{label}: expected one {href} link in responsibility group, found {count}')
    text = text[:start] + group + text[end:]
    group_end = start + len(group)
    if NAV_MARKER not in text:
        text = text[:group_end] + major_group + text[group_end:]
    return text


def insert_hero_entry(text: str, href: str, label: str, file_label: str) -> str:
    hero_start = text.find('<div class="hero-actions">')
    if hero_start < 0:
        raise SystemExit(f'{file_label}: hero actions not found')
    hero_end = text.find('</div>', hero_start)
    if hero_end < 0:
        raise SystemExit(f'{file_label}: hero actions closing tag not found')
    hero = text[hero_start:hero_end]
    if href in hero and label in hero:
        return text
    entry = f'<a class="button out-of-home-hero-entry" href="{href}">{label}</a>'
    return text[:hero_end] + entry + text[hero_end:]


TRAD_NAV = f'''{NAV_MARKER}<details class="nav-group nav-group-major out-of-home-nav"><summary>家外安置大篇章</summary><div class="nav-submenu"><a href="#out-of-home-chapter">專章入口</a><a href="#placement-spectrum">制度與法律路徑</a><a href="#placement-state-duty">國家持續保護義務</a><a href="#placement-failures">八項制度缺陷</a><a href="#placement-harm-cases">實際傷害案例</a><a href="#placement-data-panel">官方數據板</a><a href="#placement-boundary">判讀界線</a></div></details>'''

HANS_NAV = f'''{NAV_MARKER}<details class="nav-group nav-group-major out-of-home-nav"><summary>家外安置大篇章</summary><div class="nav-submenu"><a href="#out-of-home-chapter">专章入口</a><a href="#placement-spectrum">制度与法律路径</a><a href="#placement-state-duty">国家持续保护义务</a><a href="#placement-failures">八项制度缺陷</a><a href="#placement-harm-cases">实际伤害案例</a><a href="#placement-data-panel">官方数据板</a><a href="#placement-boundary">判读界线</a></div></details>'''

TRAD_BANNER = f'''{HTML_MARKER}
  <section class="out-of-home-major-chapter" id="out-of-home-chapter" aria-labelledby="outOfHomeMajorTitle" data-reading-level="quick">
    <div class="out-of-home-major-inner">
      <aside class="out-of-home-major-seal" aria-hidden="true"><small>NEW MAJOR CHAPTER</small><strong>家外安置</strong><span>OUT-OF-HOME CARE</span></aside>
      <div class="out-of-home-major-copy">
        <p class="out-of-home-major-kicker">TAIWAN CHILD PROTECTION × SYSTEM DEFECTS × REAL HARM</p>
        <h2 id="outOfHomeMajorTitle">離開危險以後，誰持續保護孩子？</h2>
        <p>這不是附錄，而是第二章新的大篇章。從分離前家庭支持、安置法律門檻、跨縣市主責、獨立親見與申訴、返家複核，到長期穩定關係，逐層檢驗：當國家接手照顧，保護措施為何仍可能失效並造成真實傷害。</p>
        <div class="out-of-home-major-stats" aria-label="專章內容規模"><span><b>6</b>項國家持續保護義務</span><span><b>8</b>項制度缺陷</span><span><b>4</b>組真實傷害證據</span><span><b>8</b>格官方數據</span></div>
        <nav class="out-of-home-major-links" aria-label="家外安置大篇章快速導覽"><a class="major-primary" href="#placement-spectrum" data-reading-route="guided">開始閱讀完整專章</a><a href="#placement-failures">八項制度缺陷</a><a href="#placement-harm-cases">實際傷害案例</a><a href="#placement-data-panel">官方數據板</a></nav>
      </div>
    </div>
  </section>'''

HANS_BANNER = f'''{HTML_MARKER}
  <section class="out-of-home-major-chapter" id="out-of-home-chapter" aria-labelledby="outOfHomeMajorTitleHans" data-reading-level="quick">
    <div class="out-of-home-major-inner">
      <aside class="out-of-home-major-seal" aria-hidden="true"><small>NEW MAJOR CHAPTER</small><strong>家外安置</strong><span>OUT-OF-HOME CARE</span></aside>
      <div class="out-of-home-major-copy">
        <p class="out-of-home-major-kicker">TAIWAN CHILD PROTECTION × SYSTEM DEFECTS × REAL HARM</p>
        <h2 id="outOfHomeMajorTitleHans">离开危险以后，谁持续保护孩子？</h2>
        <p>这不是附录，而是第二章新的大篇章。从分离前家庭支持、安置法律门槛、跨县市主责、独立亲见与申诉、返家复核，到长期稳定关系，逐层检验：当国家接手照顾，保护措施为何仍可能失效并造成真实伤害。</p>
        <div class="out-of-home-major-stats" aria-label="专章内容规模"><span><b>6</b>项国家持续保护义务</span><span><b>8</b>项制度缺陷</span><span><b>4</b>组真实伤害证据</span><span><b>8</b>格官方数据</span></div>
        <nav class="out-of-home-major-links" aria-label="家外安置大篇章快速导航"><a class="major-primary" href="#placement-spectrum" data-reading-route="guided">开始阅读完整专章</a><a href="#placement-failures">八项制度缺陷</a><a href="#placement-harm-cases">实际伤害案例</a><a href="#placement-data-panel">官方数据板</a></nav>
      </div>
    </div>
  </section>'''

CONFIGS = [
    {
        'path': ROOT / 'index.html',
        'responsibility_summary': '制度責任',
        'nav': TRAD_NAV,
        'banner': TRAD_BANNER,
        'hero_href': '#out-of-home-chapter',
        'hero_label': '家外安置大篇章',
        'summary': '家外安置大篇章',
        'required': ['離開危險以後，誰持續保護孩子？', '開始閱讀完整專章', '官方數據板'],
    },
    {
        'path': ROOT / 'zh-Hans' / 'index.html',
        'responsibility_summary': '制度責任',
        'nav': HANS_NAV,
        'banner': HANS_BANNER,
        'hero_href': '#out-of-home-chapter',
        'hero_label': '家外安置大篇章',
        'summary': '家外安置大篇章',
        'required': ['离开危险以后，谁持续保护孩子？', '开始阅读完整专章', '官方数据板'],
    },
]

versions: list[int] = []
for config in CONFIGS:
    text = config['path'].read_text(encoding='utf-8')
    match = re.search(r'final-chapter\.css\?v=20260829-(\d+)', text)
    if not match:
        raise SystemExit(f"{config['path']}: CSS version missing")
    versions.append(int(match.group(1)))

next_version = max(max(versions) + 1, 35)

for config in CONFIGS:
    path = config['path']
    text = path.read_text(encoding='utf-8')
    text = re.sub(r'final-chapter\.css\?v=20260829-\d+', f'final-chapter.css?v=20260829-{next_version}', text, count=1)

    if NAV_MARKER not in text:
        text = promote_navigation(text, config['responsibility_summary'], config['nav'], str(path))
    text = insert_hero_entry(text, config['hero_href'], config['hero_label'], str(path))

    if HTML_MARKER not in text:
        placement_match = re.search(r'<section\b[^>]*\bid="placement-spectrum"[^>]*>', text, flags=re.S)
        if not placement_match:
            raise SystemExit(f'{path}: placement-spectrum section not found')
        text = text[:placement_match.start()] + config['banner'] + '\n' + text[placement_match.start():]

    if 'id="placement-data-panel"' not in text:
        text, count = re.subn(
            r'<section class="placement-data-panel"(\s+aria-labelledby="[^"]+")>',
            r'<section class="placement-data-panel" id="placement-data-panel"\1>',
            text,
            count=1,
        )
        if count != 1:
            raise SystemExit(f'{path}: placement data panel not found')

    if 'id="placement-boundary"' not in text:
        placement_start = text.find('id="placement-spectrum"')
        boundary_start = text.find('<footer class="placement-boundary">', placement_start)
        if boundary_start < 0:
            raise SystemExit(f'{path}: placement boundary not found')
        text = text[:boundary_start] + '<footer class="placement-boundary" id="placement-boundary">' + text[boundary_start + len('<footer class="placement-boundary">'):]

    required_counts = {
        'id="out-of-home-chapter"': 1,
        'id="placement-spectrum"': 1,
        'id="placement-state-duty"': 1,
        'id="placement-failures"': 1,
        'id="placement-harm-cases"': 1,
        'id="placement-data-panel"': 1,
        'id="placement-boundary"': 1,
        'class="nav-group nav-group-major out-of-home-nav"': 1,
        'href="#out-of-home-chapter"': 2,
    }
    for phrase, expected in required_counts.items():
        count = text.count(phrase)
        if count != expected:
            raise SystemExit(f'{path}: {phrase} expected {expected}, found {count}')

    new_group_match = re.search(
        r'<details class="nav-group nav-group-major out-of-home-nav">.*?</details>',
        text,
        flags=re.S,
    )
    if not new_group_match or new_group_match.group(0).count('<a ') != 7:
        raise SystemExit(f'{path}: major chapter navigation must contain seven links')

    responsibility_match = re.search(
        rf'<details class="nav-group"><summary>{re.escape(config["responsibility_summary"])}</summary><div class="nav-submenu">(.*?)</div></details>',
        text,
        flags=re.S,
    )
    if not responsibility_match:
        raise SystemExit(f'{path}: responsibility group missing after promotion')
    responsibility_body = responsibility_match.group(1)
    if '#placement-spectrum' in responsibility_body or '#placement-harm-cases' in responsibility_body:
        raise SystemExit(f'{path}: placement links remain duplicated in responsibility group')

    for phrase in config['required']:
        if phrase not in text:
            raise SystemExit(f'{path}: missing {phrase}')
    if f'final-chapter.css?v=20260829-{next_version}' not in text:
        raise SystemExit(f'{path}: CSS cache version was not updated')
    path.write_text('\n'.join(line.rstrip() for line in text.splitlines()) + '\n', encoding='utf-8')

css_path = ROOT / 'final-chapter.css'
css = css_path.read_text(encoding='utf-8')
if CSS_MARKER not in css:
    css += r'''

/* OUT-OF-HOME-MAJOR-CHAPTER-20260829 */
.nav-group-major>summary{border:1px solid rgba(239,199,125,.55);background:linear-gradient(135deg,rgba(159,63,52,.45),rgba(210,160,82,.16));color:#f5d89d}.nav-group-major>summary:before{display:inline-flex;align-items:center;min-height:17px;padding:1px 5px;border-radius:999px;background:var(--red);color:#fff;font-size:7px;font-weight:950;letter-spacing:.07em;content:'NEW'}.nav-group-major[open]>summary,.nav-group-major>summary:hover,.nav-group-major>summary:focus-visible{background:linear-gradient(135deg,var(--red),#7a312a);color:#fff}.nav-group-major .nav-submenu{border-top:4px solid var(--gold)}
.hero-actions .out-of-home-hero-entry{border-color:#efc77d;background:linear-gradient(135deg,#a14136,#6f2d28);box-shadow:0 8px 20px rgba(0,0,0,.18)}.hero-actions .out-of-home-hero-entry:before{margin-right:7px;color:#f4d18f;font-size:11px;content:'◆'}
.out-of-home-major-chapter{position:relative;isolation:isolate;scroll-margin-top:112px;overflow:hidden;padding:clamp(62px,7.5vw,108px) clamp(18px,5vw,76px);background:radial-gradient(circle at 13% 16%,rgba(239,199,125,.25),transparent 25%),radial-gradient(circle at 88% 82%,rgba(36,95,97,.34),transparent 31%),linear-gradient(145deg,#061d2c,#0b3447 58%,#173f4e);color:#fff;border-top:1px solid rgba(255,255,255,.12);border-bottom:9px solid var(--gold)}.out-of-home-major-chapter:before,.out-of-home-major-chapter:after{position:absolute;z-index:-1;border:1px solid rgba(255,255,255,.08);border-radius:50%;content:''}.out-of-home-major-chapter:before{top:-270px;right:-150px;width:620px;height:620px}.out-of-home-major-chapter:after{bottom:-330px;left:-210px;width:720px;height:720px}.out-of-home-major-inner{display:grid;grid-template-columns:minmax(210px,.46fr) minmax(0,1.54fr);gap:clamp(28px,4.5vw,68px);align-items:center;max-width:1220px;margin:0 auto}.out-of-home-major-seal{display:grid;align-content:center;justify-items:center;min-height:310px;padding:24px;background:linear-gradient(145deg,rgba(255,250,240,.98),rgba(229,210,170,.96));color:var(--navy);border:1px solid rgba(239,199,125,.8);clip-path:polygon(50% 0,92% 15%,100% 57%,75% 100%,25% 100%,0 57%,8% 15%);filter:drop-shadow(0 18px 28px rgba(0,0,0,.25));text-align:center}.out-of-home-major-seal small{color:var(--red-dark);font-size:9px;font-weight:950;letter-spacing:.13em}.out-of-home-major-seal strong{margin-top:12px;font:900 clamp(31px,4vw,50px)/1.16 var(--serif)}.out-of-home-major-seal span{margin-top:8px;color:var(--teal);font-size:9px;font-weight:950;letter-spacing:.16em}.out-of-home-major-kicker{margin:0;color:#efc77d;font-size:10px;font-weight:950;letter-spacing:.15em}.out-of-home-major-copy h2{max-width:860px;margin:9px 0 15px;color:#fff;font:900 clamp(38px,5.3vw,74px)/1.14 var(--serif);text-wrap:balance}.out-of-home-major-copy>p:not(.out-of-home-major-kicker){max-width:880px;margin:0;color:#d6e2de;font-size:clamp(14px,1.4vw,18px);line-height:1.9}.out-of-home-major-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:24px}.out-of-home-major-stats span{display:flex;min-width:0;min-height:92px;flex-direction:column;justify-content:center;padding:13px 12px;background:rgba(255,255,255,.08);border-top:4px solid rgba(239,199,125,.72);color:#dfe9e5;font-size:9px;font-weight:850;line-height:1.5}.out-of-home-major-stats b{display:block;color:#fff;font:900 clamp(27px,3vw,39px)/1 var(--serif)}.out-of-home-major-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:19px}.out-of-home-major-links a{display:inline-flex;align-items:center;justify-content:center;min-height:41px;padding:8px 13px;border:1px solid rgba(255,255,255,.43);border-radius:999px;color:#fff;text-decoration:none;font-size:10px;font-weight:900}.out-of-home-major-links .major-primary{background:var(--red);border-color:var(--red)}.out-of-home-major-links a:hover,.out-of-home-major-links a:focus-visible{background:#fff;color:var(--navy);outline:3px solid rgba(210,160,82,.36);outline-offset:2px}.placement-data-panel,.placement-boundary{scroll-margin-top:112px}
@media(max-width:1480px){.nav-group-major{margin:5px 0;background:rgba(159,63,52,.12);border:1px solid rgba(239,199,125,.28)}.nav-group-major>summary{border:0;border-radius:0;padding-inline:10px}.nav-group-major .nav-submenu{border-top:0}.topbar .nav-group-major .nav-submenu a{border-left-color:var(--red)}}
@media(max-width:900px){.out-of-home-major-inner{grid-template-columns:1fr}.out-of-home-major-seal{width:min(360px,100%);min-height:240px;margin:0 auto}.out-of-home-major-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:620px){.out-of-home-major-chapter{padding:52px 14px 58px}.out-of-home-major-seal{width:250px;min-height:215px;padding:18px}.out-of-home-major-copy{text-align:center}.out-of-home-major-copy h2{font-size:clamp(35px,11.5vw,48px)}.out-of-home-major-stats{gap:7px}.out-of-home-major-stats span{min-height:82px;text-align:left}.out-of-home-major-links{display:grid;grid-template-columns:1fr 1fr}.out-of-home-major-links a{min-width:0}.out-of-home-major-links .major-primary{grid-column:1/-1}}
@media print{.out-of-home-major-chapter{background:#fff!important;color:#111!important;border:2px solid #111;break-before:page}.out-of-home-major-chapter:before,.out-of-home-major-chapter:after{display:none}.out-of-home-major-copy h2,.out-of-home-major-copy>p:not(.out-of-home-major-kicker),.out-of-home-major-stats b,.out-of-home-major-stats span{color:#111}.out-of-home-major-seal{clip-path:none;filter:none}.out-of-home-major-links{display:none}}
'''
if css.count(CSS_MARKER) != 1:
    raise SystemExit(f'CSS marker count is {css.count(CSS_MARKER)}')
css_path.write_text('\n'.join(line.rstrip() for line in css.splitlines()) + '\n', encoding='utf-8')

print(f'Promoted out-of-home care into a new major chapter; CSS v20260829-{next_version}.')
