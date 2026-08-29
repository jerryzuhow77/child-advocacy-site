from __future__ import annotations

import re
from pathlib import Path

INDEX = Path('index.html')
SITEMAP = Path('sitemap.xml')
MARKER = '<!-- KAIKAI-MEDICAL-ROOT-ENTRY-20260829 -->'
SCRIPT_MARKER = 'id="kaikaiMedicalRootEntryLocalizer"'
MEDICAL_BASE = './hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/'
MEDICAL_HANS = './hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/zh-Hans/'


def balanced_div(text: str, start_pattern: str, label: str) -> tuple[int, int, str]:
    start_match = re.search(start_pattern, text, flags=re.I | re.S)
    if not start_match:
        raise SystemExit(f'Missing {label}')
    token_pattern = re.compile(r'</?div\b[^>]*>', flags=re.I | re.S)
    depth = 0
    for token in token_pattern.finditer(text, start_match.start()):
        raw = token.group(0)
        if raw.lower().startswith('</div'):
            depth -= 1
        elif not raw.rstrip().endswith('/>'):
            depth += 1
        if depth == 0:
            end = token.end()
            return start_match.start(), end, text[start_match.start():end]
    raise SystemExit(f'Unclosed {label}')


ENTRY = f'''{MARKER}
<div class="special-feature-prologue-group is-kaikai-medical-responsibility" data-kaikai-medical-root-entry>
<button class="special-feature-menu-prologue" type="button" aria-expanded="false" aria-controls="specialFeatureMedicalZh"><span><small>MEDICAL ACCOUNTABILITY</small><strong data-medical-hant="醫療責任釐清專區" data-medical-hans="医疗责任厘清专区">醫療責任釐清專區</strong><span data-medical-hant="監察院報告 × 兒盟與機構疏失 × 兩家診所 × 蔡函妤證詞" data-medical-hans="监察院报告 × 儿盟与机构失职 × 两家诊所 × 蔡函妤证词">監察院報告 × 兒盟與機構疏失 × 兩家診所 × 蔡函妤證詞</span></span><b aria-hidden="true">›</b></button>
<div class="special-feature-prologue-children" id="specialFeatureMedicalZh">
<a class="special-feature-menu-card" href="{MEDICAL_BASE}" data-hant-href="{MEDICAL_BASE}" data-hans-href="{MEDICAL_HANS}">
<span class="special-feature-menu-art"><img alt="醫療責任釐清專區主視覺" data-hant-alt="醫療責任釐清專區主視覺" data-hans-alt="医疗责任厘清专区主视觉" src="./assets/art/kaikai-chapter2-hero-zh-Hant-20260828-v3.jpg" data-hant-src="./assets/art/kaikai-chapter2-hero-zh-Hant-20260828-v3.jpg" data-hans-src="./assets/art/kaikai-chapter2-hero-zh-Hans-20260828-v3.jpg" loading="lazy" decoding="async"></span>
<span class="special-feature-menu-copy"><small>CONTROL YUAN REPORT · MEDICAL ACCOUNTABILITY</small><strong data-medical-hant="進入醫療責任釐清專區" data-medical-hans="进入医疗责任厘清专区">進入醫療責任釐清專區</strong><span data-medical-hant="以監察院114社調0008為主軸，分層整理兒福聯盟、公部門、兩家診所與醫師證詞。" data-medical-hans="以监察院114社调0008为主轴，分层整理儿福联盟、公部门、两家诊所与医师证词。">以監察院114社調0008為主軸，分層整理兒福聯盟、公部門、兩家診所與醫師證詞。</span><b data-medical-hant="開始閱讀" data-medical-hans="开始阅读">開始閱讀 <em aria-hidden="true">→</em></b></span>
</a>
<a class="special-feature-prologue-link" href="{MEDICAL_BASE}#control-yuan" data-hant-href="{MEDICAL_BASE}#control-yuan" data-hans-href="{MEDICAL_HANS}#control-yuan"><small>CONTROL YUAN REPORT</small><strong data-medical-hant="監察院報告與兒盟、機構疏失" data-medical-hans="监察院报告与儿盟、机构失职">監察院報告與兒盟、機構疏失</strong><span data-medical-hant="兒盟社工與7類制度缺失、衛福部、新北、臺北及跨體系漏接" data-medical-hans="儿盟社工与7类制度缺失、卫福部、新北、台北及跨体系漏接">兒盟社工與7類制度缺失、衛福部、新北、臺北及跨體系漏接</span><b aria-hidden="true">→</b></a>
<a class="special-feature-prologue-link" href="{MEDICAL_BASE}#clinics" data-hant-href="{MEDICAL_BASE}#clinics" data-hans-href="{MEDICAL_HANS}#clinics"><small>TWO CLINICS · EVIDENCE BOUNDARIES</small><strong data-medical-hant="采新牙醫與興隆兒科" data-medical-hans="采新牙医与兴隆儿科">采新牙醫與興隆兒科</strong><span data-medical-hant="分開標示監察院匿名醫療認定、司法對應與仍待原始資料的責任界線" data-medical-hans="分开标示监察院匿名医疗认定、司法对应与仍待原始资料的责任界线">分開標示監察院匿名醫療認定、司法對應與仍待原始資料的責任界線</span><b aria-hidden="true">→</b></a>
<a class="special-feature-prologue-link" href="{MEDICAL_BASE}#cai-hanyu" data-hant-href="{MEDICAL_BASE}#cai-hanyu" data-hans-href="{MEDICAL_HANS}#cai-hanyu"><small>MEDICAL TESTIMONY</small><strong data-medical-hant="蔡函妤醫師證詞" data-medical-hans="蔡函妤医师证词">蔡函妤醫師證詞</strong><span data-medical-hant="磨牙說法、三顆乳牙、診間所見與法庭勘驗的證據界線" data-medical-hans="磨牙说法、三颗乳牙、诊间所见与法庭勘验的证据界线">磨牙說法、三顆乳牙、診間所見與法庭勘驗的證據界線</span><b aria-hidden="true">→</b></a>
<a class="special-feature-prologue-link" href="{MEDICAL_BASE}#emergency" data-hant-href="{MEDICAL_BASE}#emergency" data-hans-href="{MEDICAL_HANS}#emergency"><small>EMERGENCY MEDICINE</small><strong data-medical-hant="急診24°C與離世時間" data-medical-hans="急诊24°C与离世时间">急診24°C與離世時間</strong><span data-medical-hant="能支持早於到院，不能只憑單一體溫精確鎖定死亡鐘點" data-medical-hans="能支持早于到院，不能只凭单一体温精确锁定死亡钟点">能支持早於到院，不能只憑單一體溫精確鎖定死亡鐘點</span><b aria-hidden="true">→</b></a>
</div></div>'''

LOCALIZER = '''
<script id="kaikaiMedicalRootEntryLocalizer">
(()=>{
  const root=document.querySelector('[data-kaikai-medical-root-entry]');
  if(!root)return;
  const sync=()=>{
    const isHans=document.documentElement.lang==='zh-Hans';
    root.querySelectorAll('[data-medical-hant][data-medical-hans]').forEach(node=>{
      node.childNodes.forEach(child=>{if(child.nodeType===Node.TEXT_NODE)child.textContent='';});
      const value=isHans?node.dataset.medicalHans:node.dataset.medicalHant;
      const em=node.querySelector('em');
      node.insertBefore(document.createTextNode(value+(em?' ':'')),em||null);
    });
    root.querySelectorAll('[data-hant-href][data-hans-href]').forEach(link=>link.setAttribute('href',isHans?link.dataset.hansHref:link.dataset.hantHref));
    root.querySelectorAll('img[data-hant-src][data-hans-src]').forEach(img=>img.setAttribute('src',isHans?img.dataset.hansSrc:img.dataset.hantSrc));
    root.querySelectorAll('[data-hant-alt][data-hans-alt]').forEach(node=>node.setAttribute('alt',isHans?node.dataset.hansAlt:node.dataset.hantAlt));
  };
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('pageshow',sync);
  sync();
})();
</script>
'''

html = INDEX.read_text(encoding='utf-8')
if MARKER not in html:
    _, chapter_end, _ = balanced_div(
        html,
        r'<div\b[^>]*class="special-feature-prologue-group is-kaikai-chapter-one"[^>]*>',
        'Chapter 1 special-feature group',
    )
    html = html[:chapter_end] + '\n' + ENTRY + html[chapter_end:]

footer_old = '<section><h2>內容專區</h2><a href="#home-special-features">特別專題</a>'
footer_new = f'<section><h2>內容專區</h2><a href="#home-special-features">特別專題</a><a href="{MEDICAL_BASE}" data-hant-href="{MEDICAL_BASE}" data-hans-href="{MEDICAL_HANS}" data-medical-hant="醫療責任釐清專區" data-medical-hans="医疗责任厘清专区">醫療責任釐清專區</a>'
if 'data-medical-hant="醫療責任釐清專區"' not in html.split('<footer',1)[-1]:
    if html.count(footer_old) != 1:
        raise SystemExit(f'Expected one footer content anchor, found {html.count(footer_old)}')
    html = html.replace(footer_old, footer_new, 1)

if SCRIPT_MARKER not in html:
    if html.count('</body>') != 1:
        raise SystemExit('Expected exactly one closing body tag')
    html = html.replace('</body>', LOCALIZER + '</body>', 1)

if html.count(MARKER) != 1:
    raise SystemExit(f'Root-entry marker count is {html.count(MARKER)}')
if html.count('data-kaikai-medical-root-entry') != 2:
    raise SystemExit('Expected one root-entry element plus one localizer selector')
if html.count('specialFeatureMedicalZh') != 2:
    raise SystemExit('Medical group control/id count is not two')
if html.count(f'data-hans-href="{MEDICAL_HANS}') < 5:
    raise SystemExit('Not all Simplified medical links were added')
INDEX.write_text('\n'.join(line.rstrip() for line in html.splitlines()) + '\n', encoding='utf-8')

sitemap = SITEMAP.read_text(encoding='utf-8')
entries = [
    'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/',
    'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/zh-Hans/',
]
new_urls = []
for url in entries:
    if f'<loc>{url}</loc>' not in sitemap:
        new_urls.append(f'  <url>\n    <loc>{url}</loc>\n    <lastmod>2026-08-29</lastmod>\n  </url>')
if new_urls:
    if sitemap.count('</urlset>') != 1:
        raise SystemExit('Sitemap closing tag is not unique')
    sitemap = sitemap.replace('</urlset>', '\n'.join(new_urls) + '\n</urlset>', 1)
for url in entries:
    if sitemap.count(f'<loc>{url}</loc>') != 1:
        raise SystemExit(f'Sitemap URL missing or duplicated: {url}')
SITEMAP.write_text(sitemap, encoding='utf-8')
print('Added the bilingual medical responsibility hub to the root special-feature menu, footer, and sitemap.')
