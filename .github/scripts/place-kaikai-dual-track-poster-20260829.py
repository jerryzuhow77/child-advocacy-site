from __future__ import annotations

import re
from pathlib import Path

ROOT = Path('hearing-records/prison-watch/kaikai-final-chapter')
CSS_MARKER = '/* DUAL-TRACK-RESPONSIBILITY-PAIR-20260829 */'
PAIR_MARKER = '<!-- DUAL-TRACK-RESPONSIBILITY-PAIR-20260829 -->'


def find_balanced_block(text: str, start_pattern: str, tag: str, label: str) -> tuple[int, int, str]:
    start_match = re.search(start_pattern, text, flags=re.I | re.S)
    if not start_match:
        raise SystemExit(f'Missing {label} start')
    start = start_match.start()
    token_pattern = re.compile(rf'</?{tag}\b[^>]*>', flags=re.I | re.S)
    depth = 0
    for token in token_pattern.finditer(text, start_match.start()):
        raw = token.group(0)
        if raw.lower().startswith(f'</{tag}'):
            depth -= 1
        elif not raw.rstrip().endswith('/>'):
            depth += 1
        if depth == 0:
            end = token.end()
            return start, end, text[start:end]
    raise SystemExit(f'Unclosed {label}')


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one match, found {count}')
    return text.replace(old, new, 1)


TRAD_VISUAL = '''<article class="responsibility-tree-visual" aria-labelledby="dualTrackTreeTitle">
        <header><small>DUAL-TRACK RESPONSIBILITY MAP</small><h3 id="dualTrackTreeTitle">剴剴出養前｜雙軌責任關係樹</h3><p>先看出養服務與托育監督如何同時延伸，再由右側五層責任樹逐層追問每一層原本能做什麼、掌握什麼、斷在哪裡。</p></header>
        <a class="responsibility-tree-image-link" href="../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp" target="_blank" rel="noopener" aria-label="開啟繁體版剴剴出養前雙軌責任關係樹原尺寸圖">
          <img src="../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp" width="1536" height="864" loading="lazy" decoding="async" alt="剴剴出養前雙軌責任關係樹。左側是家庭與出養服務軸，右側是托育登記與監督軸，中間標示教育部、衛福部、兒福聯盟及地方政府關係，底部以剴剴為權利主體。">
        </a>
        <p class="responsibility-tree-note"><b>讀圖順序：</b>先沿青綠色出養服務軸與金色托育監督軸閱讀，再對照右側五層責任樹；紅色虛線代表資訊未形成閉環，不表示各單位責任等量。</p>
        <div class="responsibility-tree-downloads" aria-label="雙軌責任關係樹下載"><a href="../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp" download>下載繁體 WEBP</a><a href="../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp" download>下載簡體 WEBP</a></div>
      </article>'''

HANS_VISUAL = '''<article class="responsibility-tree-visual" aria-labelledby="dualTrackTreeTitle">
        <header><small>DUAL-TRACK RESPONSIBILITY MAP</small><h3 id="dualTrackTreeTitle">剀剀出养前｜双轨责任关系树</h3><p>先看出养服务与托育监督如何同时延伸，再由右侧五层责任树逐层追问每一层原本能做什么、掌握什么、断在哪里。</p></header>
        <a class="responsibility-tree-image-link" href="../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp" target="_blank" rel="noopener" aria-label="打开简体版剀剀出养前双轨责任关系树原尺寸图">
          <img src="../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp" width="1536" height="864" loading="lazy" decoding="async" alt="剀剀出养前双轨责任关系树。左侧是家庭与出养服务轴，右侧是托育登记与监督轴，中间标示教育部、卫福部、儿福联盟及地方政府关系，底部以剀剀为权利主体。">
        </a>
        <p class="responsibility-tree-note"><b>读图顺序：</b>先沿青绿色出养服务轴与金色托育监督轴阅读，再对照右侧五层责任树；红色虚线代表资讯未形成闭环，不表示各单位责任等量。</p>
        <div class="responsibility-tree-downloads" aria-label="双轨责任关系树下载"><a href="../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp" download>下载简体 WEBP</a><a href="../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp" download>下载繁体 WEBP</a></div>
      </article>'''

CONFIGS = [
    (ROOT / 'index.html', TRAD_VISUAL),
    (ROOT / 'zh-Hans' / 'index.html', HANS_VISUAL),
]

for path, visual_template in CONFIGS:
    text = path.read_text(encoding='utf-8')
    text = text.replace('final-chapter.css?v=20260829-23', 'final-chapter.css?v=20260829-24')

    system_start, system_end, system_block = find_balanced_block(
        text,
        r'<section\b[^>]*\bid="system"[^>]*>',
        'section',
        f'{path} responsibility section',
    )
    visual_start, visual_end, _ = find_balanced_block(
        text,
        r'<(?:div|article)\b[^>]*\bclass="[^"]*responsibility-tree-visual[^"]*"[^>]*>',
        'div' if re.search(r'<div\b[^>]*\bclass="[^"]*responsibility-tree-visual', text, re.I | re.S) else 'article',
        f'{path} dual-track visual',
    )
    tree_start, tree_end, tree_block = find_balanced_block(
        text,
        r'<section\b[^>]*\bclass="[^"]*responsibility-tree-panel[^"]*"[^>]*>',
        'section',
        f'{path} five-layer tree',
    )

    if not (system_start <= tree_start < tree_end <= system_end):
        raise SystemExit(f'{path}: five-layer tree is not inside #system')
    if not (system_start <= visual_start < visual_end <= system_end):
        raise SystemExit(f'{path}: dual-track visual is not inside #system')

    first_start = min(visual_start, tree_start)
    last_end = max(visual_end, tree_end)
    middle = text[min(visual_end, tree_end):max(visual_start, tree_start)]
    if re.sub(r'<!--.*?-->|\s+', '', middle, flags=re.S):
        raise SystemExit(f'{path}: unexpected content between visual and five-layer tree')

    wrapper = f'''{PAIR_MARKER}\n    <div class="responsibility-tree-pair">\n      {visual_template}\n\n{tree_block}\n    </div>'''
    text = text[:first_start] + wrapper + text[last_end:]

    if text.count('class="responsibility-tree-pair"') != 1:
        raise SystemExit(f'{path}: pair wrapper count is not one')
    if text.count('class="responsibility-tree-visual"') != 1:
        raise SystemExit(f'{path}: visual count is not one')
    if text.count('class="responsibility-tree-panel reveal"') != 1:
        raise SystemExit(f'{path}: five-layer tree count is not one')
    if text.count('kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp') < 1:
        raise SystemExit(f'{path}: Simplified download asset is missing')
    if 'final-chapter.css?v=20260829-24' not in text:
        raise SystemExit(f'{path}: CSS cache version was not updated')
    path.write_text(text, encoding='utf-8')

css_path = ROOT / 'final-chapter.css'
css = css_path.read_text(encoding='utf-8')
if CSS_MARKER not in css:
    css += r'''

/* DUAL-TRACK-RESPONSIBILITY-PAIR-20260829 */
.responsibility-tree-pair{display:grid;grid-template-columns:minmax(340px,.76fr) minmax(0,1.24fr);gap:18px;align-items:start;margin:20px 0}.responsibility-tree-pair>.responsibility-tree-visual,.responsibility-tree-pair>.responsibility-tree-panel{min-width:0;margin:0}.responsibility-tree-visual{padding:18px;background:linear-gradient(145deg,#fffaf0,#ead9b9);border:1px solid rgba(210,160,82,.68);border-top:7px solid var(--teal);box-shadow:0 16px 38px rgba(6,31,43,.16)}.responsibility-tree-visual>header{text-align:center}.responsibility-tree-visual>header small{color:var(--red-dark);font-size:9px;font-weight:950;letter-spacing:.14em}.responsibility-tree-visual>header h3{margin:6px 0 8px;color:var(--ink);font:900 clamp(22px,2.2vw,32px)/1.38 var(--serif)}.responsibility-tree-visual>header p{margin:0 0 14px;color:#52625f;font-size:11px;line-height:1.72}.responsibility-tree-image-link{display:block;overflow:hidden;border:1px solid rgba(210,160,82,.64);background:#082d40;box-shadow:0 10px 24px rgba(5,30,42,.2)}.responsibility-tree-image-link img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:contain}.responsibility-tree-note{margin:12px 0 0;padding:12px 13px;background:rgba(255,255,255,.66);border-left:5px solid var(--gold);color:#52615e;font-size:10px;line-height:1.7}.responsibility-tree-note b{color:var(--ink)}.responsibility-tree-downloads{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.responsibility-tree-downloads a{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:8px 13px;border-radius:999px;background:var(--navy);color:#fff;font-size:10px;font-weight:950;text-decoration:none}.responsibility-tree-downloads a+ a{background:var(--teal)}.responsibility-tree-downloads a:hover,.responsibility-tree-downloads a:focus-visible{background:var(--red);outline:3px solid rgba(210,160,82,.34);outline-offset:2px}.responsibility-tree-pair>.responsibility-tree-panel{padding:clamp(17px,2.2vw,28px)}
@media(min-width:1181px){.responsibility-tree-pair>.responsibility-tree-visual{position:sticky;top:102px}}
@media(max-width:1180px){.responsibility-tree-pair{grid-template-columns:1fr}.responsibility-tree-pair>.responsibility-tree-visual{position:static}.responsibility-tree-downloads a{flex:1 1 180px}}
@media(max-width:640px){.responsibility-tree-pair{gap:13px;margin:14px 0}.responsibility-tree-visual{padding:13px}.responsibility-tree-visual>header h3{font-size:22px}.responsibility-tree-downloads{display:grid;grid-template-columns:1fr 1fr}.responsibility-tree-downloads a{min-width:0;padding-inline:8px}}
@media print{.responsibility-tree-pair{display:block}.responsibility-tree-pair>.responsibility-tree-visual{position:static;break-after:page}.responsibility-tree-downloads{display:none}}
'''
if css.count(CSS_MARKER) != 1:
    raise SystemExit(f'CSS marker count is {css.count(CSS_MARKER)}')
css_path.write_text(css, encoding='utf-8')

print('Placed the bilingual dual-track poster beside the five-layer responsibility tree.')
