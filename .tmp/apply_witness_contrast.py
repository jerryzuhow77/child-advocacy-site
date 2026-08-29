from pathlib import Path

CSS_PATH = Path('hearing-records/prison-watch/kaikai-final-chapter/witnesses/witnesses.css')
PAGES = [
    Path('hearing-records/prison-watch/kaikai-final-chapter/witnesses/index.html'),
    Path('hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/witnesses/index.html'),
]
MARKER = 'WITNESS-CONTRAST-FIX-20260829'
OVERRIDE = r'''

/* WITNESS-CONTRAST-FIX-20260829
   Keep text readable when the mobile hero overlaps the light page background. */
.witness-hero-copy{
  background:linear-gradient(145deg,#0d4055 0%,#082f42 100%);
  border-color:rgba(255,255,255,.28);
  backdrop-filter:none;
}
.witness-hero-copy>p:not(.eyebrow){color:#f4fbfc;font-weight:600;text-shadow:0 1px 1px rgba(0,0,0,.22)}
.witness-hero-copy>p a{color:#fff}
.hero-rule span{background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.24);color:#fff}
.witness-source-boundary{
  background:#fff8e8;
  border-color:#d8c79f;
  color:#17343e;
  box-shadow:0 18px 42px rgba(4,29,42,.16);
  backdrop-filter:none;
}
.witness-source-boundary b{color:#8d3f33}
.witness-source-boundary p{color:#2a4650;font-weight:600}
.section-title p,.method-panel span,.calibration-grid p,.issue-row section p,
.witness-summary-grid p,.witness-summary-grid li,.official-sources a span{
  color:#314b54;
  font-weight:600;
}
.transcript-line{color:#203a43;font-weight:600}
.transcript-line .line-no{color:#63767c}
.transcript-panel summary small,.transcript-note,.transcript-meta{color:#425961;font-weight:600}
.witness-card-head p{color:#f0f7f8;font-weight:600}
.witness-breadcrumb{color:#eff6f7}
@media(max-width:720px){
  .witness-hero-copy,.witness-source-boundary{box-shadow:0 16px 34px rgba(4,29,42,.2)}
  .witness-hero-copy{background:linear-gradient(160deg,#0d4055 0%,#082f42 100%)}
  .witness-source-boundary{background:#fff8e8}
}
'''


def luminance(value: str) -> float:
    value = value.lstrip('#')
    rgb = [int(value[index:index + 2], 16) / 255 for index in (0, 2, 4)]
    linear = [component / 12.92 if component <= .04045 else ((component + .055) / 1.055) ** 2.4 for component in rgb]
    return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]


def contrast(foreground: str, background: str) -> float:
    high, low = sorted((luminance(foreground), luminance(background)), reverse=True)
    return (high + .05) / (low + .05)


css = CSS_PATH.read_text(encoding='utf-8')
if MARKER not in css:
    css = css.rstrip() + OVERRIDE + '\n'
CSS_PATH.write_text(css, encoding='utf-8')

for page in PAGES:
    text = page.read_text(encoding='utf-8')
    old = 'witnesses.css?v=20260829-2'
    new = 'witnesses.css?v=20260829-3'
    if old in text:
        text = text.replace(old, new, 1)
    elif new not in text:
        raise SystemExit(f'{page}: stylesheet version anchor not found')
    page.write_text(text, encoding='utf-8')

checks = {
    'hero body': ('#f4fbfc', '#082f42'),
    'source body': ('#2a4650', '#fff8e8'),
    'paper body': ('#314b54', '#fffaf0'),
    'transcript body': ('#203a43', '#fbfaf6'),
    'line numbers': ('#63767c', '#fbfaf6'),
    'source heading': ('#8d3f33', '#fff8e8'),
}
for name, pair in checks.items():
    value = contrast(*pair)
    if value < 4.5:
        raise SystemExit(f'{name}: insufficient contrast {value:.2f}:1')
    print(f'{name}: {value:.2f}:1')

final_css = CSS_PATH.read_text(encoding='utf-8')
if MARKER not in final_css:
    raise SystemExit('contrast marker missing')
if final_css.count('{') != final_css.count('}'):
    raise SystemExit('CSS brace count is unbalanced')
for page in PAGES:
    if 'witnesses.css?v=20260829-3' not in page.read_text(encoding='utf-8'):
        raise SystemExit(f'{page}: cache-busting version missing')

print('13-witness contrast correction validated.')
