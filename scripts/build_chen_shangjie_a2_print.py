#!/usr/bin/env python3
"""Build A2 vector print masters for the 2026-11-06 court-observation action.

The web-preview JPEGs remain separate.  These print masters use vector type,
rules, illustration and QR modules; they are deliberately not a DPI relabel of
the 1229x1536 web assets.
"""

from pathlib import Path
import re
import qrcode
import qrcode.image.svg

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "downloads" / "chen-shangjie-20261106-a2-print"
QR = OUT / "qr"
SITE = "https://jerryzuhow77.github.io/child-advocacy-site/"
LINE = "https://line.me/ti/g2/0P5NIUSmC4jRXC5aQrgIIfRywBptTBuyhyhmYg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"


def make_qr(name: str, value: str) -> None:
    qr = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=12, border=4)
    qr.add_data(value)
    qr.make(fit=True)
    image = qr.make_image(image_factory=qrcode.image.svg.SvgPathImage)
    image.save(QR / name)


def inline_qr(name: str, x: int, y: int, size: int) -> str:
    """Inline the QR paths so standalone SVG and exported PDF never lose them."""
    source = (QR / name).read_text(encoding="utf-8")
    start = source.index('<svg')
    opening_end = source.index('>', start)
    view_box = re.search(r'viewBox="([^"]+)"', source[start:opening_end]).group(1)
    body = source[opening_end + 1:source.rfind('</svg>')]
    return f'<svg x="{x}" y="{y}" width="{size}" height="{size}" viewBox="{view_box}">{body}</svg>'


def poster(locale: str, style: str) -> str:
    is_hans = locale == "zh-Hans"
    words = {
        "title": "陈尚洁案" if is_hans else "陳尚潔案",
        "subtitle": "二审第二次准备程序" if is_hans else "二審第二次準備程序",
        "call": "孩子的求救，不能被忽视" if is_hans else "孩子的求救，不能被忽視",
        "meeting": "12:30 集合｜台湾高等法院门口" if is_hans else "12:30 集合｜臺灣高等法院門口",
        "support": "当场声援并接受记者采访" if is_hans else "當場聲援並接受記者採訪",
        "official": "护童官网" if is_hans else "護童官網",
        "line": "护童 LINE 群" if is_hans else "護童 LINE 群",
        "note": "公开程序资讯以法院当日公告为准" if is_hans else "公開程序資訊以法院當日公告為準",
    }
    dark, accent, secondary, paper = ("#061b32", "#d63b32", "#e0ad54", "#eef3f5") if style == "neon" else ("#171310", "#bc1f24", "#b99146", "#f6f1e6")
    strokes = (
        f'<path d="M-20 760 C720 420 1380 940 2230 620 S3580 260 4300 650 L4300 1510 C3440 1220 2790 1510 1980 1180 S650 1240 -20 1430Z" fill="{dark}"/>'
        f'<path d="M-10 980 C610 760 990 1230 1600 970 S2780 590 4200 960" fill="none" stroke="{accent}" stroke-width="74" stroke-linecap="round"/>'
        f'<path d="M200 1310 C860 1030 1400 1450 2190 1160 S3330 880 4050 1120" fill="none" stroke="{secondary}" stroke-width="23" stroke-linecap="round" opacity=".9"/>'
    )
    columns = ''.join(f'<rect x="{2580+i*205}" y="1770" width="108" height="600" rx="22" fill="none" stroke="{secondary}" stroke-width="23"/>' for i in range(5))
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="420mm" height="594mm" viewBox="0 0 4200 5940" role="img" aria-labelledby="title desc">
  <title id="title">{words["title"]}｜{words["subtitle"]}｜A2 {style} print master</title>
  <desc id="desc">Vector A2 print master with two high-error-correction QR codes.</desc>
  <rect width="4200" height="5940" fill="{paper}"/>
  <rect x="110" y="110" width="3980" height="5720" rx="42" fill="none" stroke="{secondary}" stroke-width="10"/>
  {strokes}
  <g opacity=".97">{columns}<path d="M2470 1760h1300l-650-390zM2420 2390h1450M2510 2475h1270" fill="none" stroke="{secondary}" stroke-width="28" stroke-linecap="round"/></g>
  <text x="250" y="430" fill="{secondary}" font-family="Noto Sans CJK TC, Noto Sans CJK SC, sans-serif" font-size="74" font-weight="700" letter-spacing="12">COURT OBSERVATION · 2026.11.06</text>
  <text x="250" y="1730" fill="{paper}" font-family="Noto Serif CJK TC, Noto Serif CJK SC, serif" font-size="330" font-weight="900">{words["title"]}</text>
  <text x="260" y="2100" fill="{accent}" font-family="Noto Serif CJK TC, Noto Serif CJK SC, serif" font-size="286" font-weight="900">{words["subtitle"]}</text>
  <rect x="250" y="2540" width="3700" height="10" fill="{secondary}"/>
  <text x="250" y="2890" fill="{dark}" font-family="Noto Serif CJK TC, Noto Serif CJK SC, serif" font-size="210" font-weight="800">{words["call"]}</text>
  <text x="250" y="3220" fill="{accent}" font-family="Noto Sans CJK TC, Noto Sans CJK SC, sans-serif" font-size="138" font-weight="800">11/6（四）14:30 開庭</text>
  <text x="250" y="3475" fill="{dark}" font-family="Noto Sans CJK TC, Noto Sans CJK SC, sans-serif" font-size="122" font-weight="700">{words["meeting"]}</text>
  <text x="250" y="3695" fill="{dark}" font-family="Noto Sans CJK TC, Noto Sans CJK SC, sans-serif" font-size="112">{words["support"]}</text>
  <rect x="250" y="3920" width="3700" height="1" fill="{dark}" opacity=".35"/>
  <g><rect x="260" y="4140" width="700" height="700" rx="28" fill="#fff" stroke="{secondary}" stroke-width="16"/>{inline_qr("official-site.svg", 315, 4195, 590)}<text x="610" y="4960" text-anchor="middle" fill="{dark}" font-family="Noto Sans CJK TC, Noto Sans CJK SC, sans-serif" font-size="100" font-weight="800">{words["official"]}</text></g>
  <g><rect x="1150" y="4140" width="700" height="700" rx="28" fill="#fff" stroke="{secondary}" stroke-width="16"/>{inline_qr("line-community.svg", 1205, 4195, 590)}<text x="1500" y="4960" text-anchor="middle" fill="{dark}" font-family="Noto Sans CJK TC, Noto Sans CJK SC, sans-serif" font-size="100" font-weight="800">{words["line"]}</text></g>
  <text x="2100" y="4710" fill="{dark}" font-family="Noto Sans CJK TC, Noto Sans CJK SC, sans-serif" font-size="96" font-weight="700">旁聽證依法院公告時間本人領取</text>
  <text x="2100" y="4890" fill="{dark}" font-family="Noto Sans CJK TC, Noto Sans CJK SC, sans-serif" font-size="88">13:40–14:00｜刑事庭大廈一樓入口｜不得代領</text>
  <path d="M2100 5120h1580" stroke="{accent}" stroke-width="42" stroke-linecap="round"/><path d="M2100 5220h1150" stroke="{secondary}" stroke-width="18" stroke-linecap="round"/>
  <text x="250" y="5580" fill="{dark}" font-family="Noto Sans CJK TC, Noto Sans CJK SC, sans-serif" font-size="68">{words["note"]} · 印刷版：向量文字與 QR，不以網頁預覽圖的 DPI 標示代替印刷品質。</text>
</svg>'''


def main() -> None:
    QR.mkdir(parents=True, exist_ok=True)
    make_qr("official-site.svg", SITE)
    make_qr("line-community.svg", LINE)
    for locale in ("zh-Hant", "zh-Hans"):
        for style in ("ink", "neon"):
            (OUT / f"chen-shangjie-20261106-a2-{style}-{locale}.svg").write_text(poster(locale, style), encoding="utf-8")


if __name__ == "__main__":
    main()
