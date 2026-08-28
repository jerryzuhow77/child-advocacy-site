from pathlib import Path

path = Path("hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/index.html")
html = path.read_text(encoding="utf-8")

old_font_url = (
    "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700;800;900"
    "&amp;family=Noto+Serif+TC:wght@600;700;900&amp;display=swap"
)
new_font_url = (
    "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800;900"
    "&amp;family=Noto+Serif+SC:wght@600;700;900&amp;display=swap"
)

if old_font_url in html:
    html = html.replace(old_font_url, new_font_url, 1)
elif new_font_url not in html:
    raise SystemExit("Simplified font stylesheet anchor not found")

css_link = '  <link rel="stylesheet" href="../final-chapter.css?v=20260828-17">'
override = '''  <link rel="stylesheet" href="../final-chapter.css?v=20260828-17">
  <style id="zh-hans-font-stack">
    html[lang="zh-Hans"] {
      --serif: "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
      --sans: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Source Han Sans SC", sans-serif;
    }
  </style>'''

if 'id="zh-hans-font-stack"' not in html:
    if html.count(css_link) != 1:
        raise SystemExit(f"Expected one shared CSS link, found {html.count(css_link)}")
    html = html.replace(css_link, override, 1)

path.write_text(html, encoding="utf-8")
print("Simplified Chinese font stack corrected")
