from __future__ import annotations

from html import escape
from pathlib import Path

OUT = Path("/tmp/day5-poster-svg")
OUT.mkdir(parents=True, exist_ok=True)

COL = {
    "teal": "#0d5960",
    "ink": "#173840",
    "rust": "#a64b2d",
    "gold": "#c58d3b",
    "line": "#b27a4e",
    "leaf": "#5f8474",
    "rose": "#d9997f",
    "brown": "#6c4b3b",
    "muted": "#725d52",
}

DATA = {
    "hant": {
        "serif": "Noto Serif CJK TC",
        "sans": "Noto Sans CJK TC",
        "date": "DAY 5｜2025年4月29日（二）第五次審判期日",
        "experts": "鑑定人：許倬憲法醫師、呂立醫師",
        "slogan": ["讓醫學證據，替孩子留下", "不能被抹去的真相"],
        "footer": "護童行動聯盟｜第五日旁聽紀錄重製",
        "disclaimer": "本圖依庭審紀錄整理；重點標示不等同法院最終認定。",
        "forensic": {
            "subtitle": ["法醫研判", "死亡機轉與死因"],
            "left_title": "醫學判讀重點",
            "left": [
                ["外傷不一定從皮膚外觀呈現，", "皮下組織可能出血。"],
                ["顱內無出血，頭部外傷不是", "直接致死原因。"],
                ["屍斑不明顯、眼結膜蒼白、", "腦部血管缺血塌陷，支持缺血。"],
                ["久站會造成水腫；綑綁可能", "造成大範圍血液與組織液淤積。"],
            ],
            "right_title": "許倬憲法醫師｜研判死亡原因",
            "right_label": "直接死亡原因",
            "right": [
                ["甲、皮下軟組織血液及組織液", "淤積休克"],
                ["乙、頭、臉部、四肢多處", "外傷及瘀血"],
                ["丙、遭束縛約束、長時間罰站、", "毆打創傷"],
            ],
            "factor": "間接死亡原因（加重因子）：營養不良",
            "note": ["法醫師糾正：應為「低血容性休克」，", "不是「出血性休克」。"],
            "bottom_title": "鑑定方法與界線",
            "bottom": [
                ["解剖觀察、顯微鏡、毒物化學、", "血清證物與法醫電腦斷層綜合研判。"],
                ["臨床是功能判斷；法醫解剖是", "型態判斷。"],
                ["CT影像可以輔助，但不能取代", "法醫師對死因的綜合研判。"],
                ["傷的大小僅供參考；傷害要從", "組織裡面判讀。"],
            ],
            "page": "1 / 2",
        },
        "medical": {
            "subtitle": ["兒少保護醫療鑑定", "傷勢與照顧疏忽"],
            "left_title": "醫療科學證據",
            "left": [
                ["身上沒有看到瘀青，不代表", "沒有受過傷。"],
                ["下排門牙斷裂、脫落，沒有蛀牙，", "也不符合磨牙造成的醫療證據。"],
                ["PMCT顯示肩胛骨喙突骨折損傷。"],
                ["自我安撫行為不會造成瘀傷、", "出血或深層裂傷。"],
            ],
            "right_title": "呂立醫師｜兒少保護醫療鑑定",
            "right": [
                ["傷勢研判由5人以上專家會議進行，", "包含兒科、法醫、影像、骨科、眼科、", "牙科醫師與社工師；有疑義不納入報告。"],
                ["A童全身至少有42處確定傷勢；", "有些傷勢癒合後已看不到。"],
                ["A童符合七大項特徵，", "虐待機率非常非常高。"],
            ],
            "bottom_title": "鑑定小結與照顧疏忽",
            "bottom": [
                ["A童受有身體虐待、", "高度疑似性虐待。"],
                ["生長曲線衰退、慢性營養不良；", "傷勢未就醫與瀕死時延遲就醫，", "屬嚴重醫療疏忽。"],
                ["鑑定報告與法醫報告大致相符；", "呂立醫師認為營養不良是主要因素。"],
                ["死因：甲、血容性休克；", "乙、外傷、瘀傷；丙、營養不良。"],
            ],
            "page": "2 / 2",
        },
    },
    "hans": {
        "serif": "Noto Serif CJK SC",
        "sans": "Noto Sans CJK SC",
        "date": "DAY 5｜2025年4月29日（二）第五次审判期日",
        "experts": "鉴定人：许倬宪法医师、吕立医师",
        "slogan": ["让医学证据，替孩子留下", "不能被抹去的真相"],
        "footer": "护童行动联盟｜第五日旁听记录重制",
        "disclaimer": "本图依据庭审记录整理；重点标示不等同法院最终认定。",
        "forensic": {
            "subtitle": ["法医研判", "死亡机制与死因"],
            "left_title": "医学判读重点",
            "left": [
                ["外伤不一定从皮肤外观呈现，", "皮下组织可能出血。"],
                ["颅内无出血，头部外伤不是", "直接致死原因。"],
                ["尸斑不明显、眼结膜苍白、", "脑部血管缺血塌陷，支持缺血。"],
                ["久站会造成水肿；捆绑可能", "造成大范围血液与组织液淤积。"],
            ],
            "right_title": "许倬宪法医师｜研判死亡原因",
            "right_label": "直接死亡原因",
            "right": [
                ["甲、皮下软组织血液及组织液", "淤积休克"],
                ["乙、头、脸部、四肢多处", "外伤及淤血"],
                ["丙、遭束缚约束、长时间罚站、", "殴打创伤"],
            ],
            "factor": "间接死亡原因（加重因素）：营养不良",
            "note": ["法医师纠正：应为“低血容量性休克”，", "不是“出血性休克”。"],
            "bottom_title": "鉴定方法与界线",
            "bottom": [
                ["解剖观察、显微镜、毒物化学、", "血清证物与法医电脑断层综合研判。"],
                ["临床是功能判断；法医解剖是", "形态判断。"],
                ["CT影像可以辅助，但不能取代", "法医师对死因的综合研判。"],
                ["伤的大小仅供参考；伤害要从", "组织里面判读。"],
            ],
            "page": "1 / 2",
        },
        "medical": {
            "subtitle": ["儿少保护医疗鉴定", "伤势与照顾疏忽"],
            "left_title": "医疗科学证据",
            "left": [
                ["身上没有看到淤青，不代表", "没有受过伤。"],
                ["下排门牙断裂、脱落，没有蛀牙，", "也不符合磨牙造成的医疗证据。"],
                ["PMCT显示肩胛骨喙突骨折损伤。"],
                ["自我安抚行为不会造成淤伤、", "出血或深层裂伤。"],
            ],
            "right_title": "吕立医师｜儿少保护医疗鉴定",
            "right": [
                ["伤势研判由5人以上专家会议进行，", "包含儿科、法医、影像、骨科、眼科、", "牙科医师与社工师；有疑义不纳入报告。"],
                ["A童全身至少有42处确定伤势；", "有些伤势愈合后已看不到。"],
                ["A童符合七大项特征，", "虐待概率非常非常高。"],
            ],
            "bottom_title": "鉴定小结与照顾疏忽",
            "bottom": [
                ["A童受有身体虐待、", "高度疑似性虐待。"],
                ["生长曲线衰退、慢性营养不良；", "伤势未就医与濒死时延迟就医，", "属严重医疗疏忽。"],
                ["鉴定报告与法医报告大致相符；", "吕立医师认为营养不良是主要因素。"],
                ["死因：甲、血容量性休克；", "乙、外伤、淤伤；丙、营养不良。"],
            ],
            "page": "2 / 2",
        },
    },
}


def text(x: float, y: float, value: str, size: float, fill: str, family: str, weight: int = 400, anchor: str = "start") -> str:
    return f'<text x="{x}" y="{y}" font-family="{escape(family)}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{escape(value)}</text>'


def multiline(x: float, y: float, values: list[str], size: float, line_height: float, fill: str, family: str, weight: int = 400, anchor: str = "start") -> str:
    body = [f'<text x="{x}" y="{y}" font-family="{escape(family)}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">']
    for index, value in enumerate(values):
        body.append(f'<tspan x="{x}" dy="{0 if index == 0 else line_height}">{escape(value)}</tspan>')
    body.append("</text>")
    return "".join(body)


def card(x: int, y: int, width: int, height: int, radius: int = 24, fill: str = "#fff7e8", stroke: str = "#b27a4e", shadow: bool = True, opacity: float = 1) -> str:
    parts: list[str] = []
    if shadow:
        parts.append(f'<rect x="{x + 7}" y="{y + 11}" width="{width}" height="{height}" rx="{radius}" fill="#5d4435" opacity=".20"/>')
    parts.append(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="2" opacity="{opacity}"/>')
    return "".join(parts)


def pill(x: int, y: int, width: int, height: int, label: str, fill: str, family: str, size: int = 23) -> str:
    return f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{height / 2}" fill="{fill}"/>' + text(x + width / 2, y + height * .67, label, size, "#fff", family, 700, "middle")


def bullets(x: int, y: int, blocks: list[list[str]], family: str, size: int = 20, line_height: int = 28, gap: int = 18, color: str = "#a64b2d") -> str:
    parts: list[str] = []
    cursor = y
    for block in blocks:
        parts.append(f'<circle cx="{x}" cy="{cursor - 7}" r="6" fill="{color}"/>')
        parts.append(multiline(x + 20, cursor, block, size, line_height, COL["ink"], family))
        cursor += line_height * len(block) + gap
    return "".join(parts)


def flower(cx: int, cy: int, scale: float = 1) -> str:
    petals: list[str] = []
    for dx, dy, angle in [(0, -26, 0), (24, -9, 55), (15, 20, 110), (-15, 20, 250), (-24, -9, 305)]:
        px, py = cx + dx * scale, cy + dy * scale
        petals.append(f'<ellipse cx="{px}" cy="{py}" rx="16" ry="28" transform="rotate({angle} {px} {py})" fill="{COL["rose"]}" stroke="#b9755d" stroke-width="2"/>')
    return "".join(petals) + f'<circle cx="{cx}" cy="{cy}" r="13" fill="#e9c47e"/><circle cx="{cx}" cy="{cy}" r="5" fill="#a56e3f"/>'


def courthouse(x: int, y: int, scale: float = 1) -> str:
    width = 270 * scale
    parts = [
        f'<polygon points="{x},{y + 38 * scale} {x + width / 2},{y} {x + width},{y + 38 * scale}" fill="#ddc7a5" stroke="#9d7751" stroke-width="3"/>',
        f'<rect x="{x + 18 * scale}" y="{y + 38 * scale}" width="{width - 36 * scale}" height="{95 * scale}" fill="#cdb18b" stroke="#9d7751" stroke-width="3"/>',
    ]
    for index in range(5):
        column_x = x + (48 + 43 * index) * scale
        parts.append(f'<rect x="{column_x}" y="{y + 51 * scale}" width="{16 * scale}" height="{70 * scale}" rx="5" fill="#eadcc2" stroke="#a37b54" stroke-width="2"/>')
    parts.append(f'<rect x="{x + 10 * scale}" y="{y + 132 * scale}" width="{width - 20 * scale}" height="{15 * scale}" fill="#a27a52"/>')
    parts.append(text(x + width / 2, y + 31 * scale, "⚖", 32 * scale, COL["brown"], "Noto Sans Symbols 2", 700, "middle"))
    return "".join(parts)


def evidence_board(x: int, y: int, width: int = 382, height: int = 410, family: str = "Noto Sans CJK TC") -> str:
    parts = [card(x, y, width, height, 18, "#d8c2a1", "#9d7751", True)]
    center = x + width / 2
    top = y + 92
    parts.append(f'<circle cx="{center}" cy="{top}" r="28" fill="#ead9bd" stroke="#8d6e57" stroke-width="3"/>')
    parts.append(f'<path d="M{center},{top + 29} C{center - 30},{top + 55} {center - 35},{top + 120} {center - 22},{top + 168} L{center - 34},{top + 260} M{center},{top + 72} L{center},{top + 265} M{center},{top + 85} L{center - 78},{top + 145} M{center},{top + 85} L{center + 78},{top + 145} M{center},{top + 265} L{center - 55},{top + 345} M{center},{top + 265} L{center + 55},{top + 345}" fill="none" stroke="#8d6e57" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>')
    for dx, dy in [(-50, 145), (44, 155), (-18, 205), (29, 225), (-34, 295), (40, 310)]:
        parts.append(f'<circle cx="{center + dx}" cy="{top + dy}" r="8" fill="#a64932" opacity=".85"/>')
    labels = [("頭顱影像", x + 18, y + 24), ("肩胛骨影像", x + width - 132, y + 24), ("口腔影像", x + 18, y + height - 112), ("影像紀錄", x + width - 132, y + height - 112)]
    for label, px, py in labels:
        parts.append(f'<rect x="{px}" y="{py}" width="114" height="92" rx="10" fill="#bba17e" stroke="#8d6e57" stroke-width="2"/>')
        parts.append(text(px + 57, py + 18, label, 14, COL["brown"], family, 600, "middle"))
    parts.append(f'<circle cx="{x + 75}" cy="{y + 76}" r="25" fill="none" stroke="#6f655e" stroke-width="7"/><circle cx="{x + 66}" cy="{y + 70}" r="4" fill="#6f655e"/><circle cx="{x + 84}" cy="{y + 70}" r="4" fill="#6f655e"/><path d="M{x + 65},{y + 87} Q{x + 75},{y + 95} {x + 85},{y + 87}" fill="none" stroke="#6f655e" stroke-width="4"/>')
    parts.append(f'<path d="M{x + width - 75},{y + 55} C{x + width - 103},{y + 70} {x + width - 100},{y + 98} {x + width - 65},{y + 106} C{x + width - 48},{y + 90} {x + width - 48},{y + 65} {x + width - 75},{y + 55}Z" fill="none" stroke="#6f655e" stroke-width="6"/>')
    parts.append(f'<rect x="{x + 43}" y="{y + height - 80}" width="64" height="42" rx="12" fill="#e6d6bd" stroke="#6f655e" stroke-width="4"/><path d="M{x + 52},{y + height - 59} H{x + 98}" stroke="#6f655e" stroke-width="4"/>')
    parts.append(f'<path d="M{x + width - 103},{y + height - 80} L{x + width - 47},{y + height - 38} M{x + width - 47},{y + height - 80} L{x + width - 103},{y + height - 38}" stroke="#6f655e" stroke-width="6"/>')
    return "".join(parts)


def child(x: int, y: int, scale: float = .85) -> str:
    parts = [f'<ellipse cx="{x}" cy="{y + 250 * scale}" rx="{105 * scale}" ry="{25 * scale}" fill="#5e4a3c" opacity=".24"/>']
    parts.append(f'<circle cx="{x}" cy="{y}" r="{66 * scale}" fill="#d9a879" stroke="#8f694c" stroke-width="4"/>')
    parts.append(f'<path d="M{x - 55 * scale},{y - 25 * scale} Q{x},{y - 80 * scale} {x + 56 * scale},{y - 15 * scale} Q{x + 25 * scale},{y - 45 * scale} {x - 55 * scale},{y - 25 * scale}" fill="#3f332c"/>')
    parts.append(f'<circle cx="{x - 22 * scale}" cy="{y + 4 * scale}" r="{6 * scale}" fill="#342a25"/><circle cx="{x + 22 * scale}" cy="{y + 4 * scale}" r="{6 * scale}" fill="#342a25"/>')
    parts.append(f'<path d="M{x - 14 * scale},{y + 30 * scale} Q{x},{y + 20 * scale} {x + 14 * scale},{y + 30 * scale}" fill="none" stroke="#815c4c" stroke-width="4"/>')
    parts.append(f'<rect x="{x - 72 * scale}" y="{y + 62 * scale}" width="{144 * scale}" height="{128 * scale}" rx="{48 * scale}" fill="#7aa0a7" stroke="#476c73" stroke-width="4"/>')
    for stripe_y in [y + 82 * scale, y + 113 * scale, y + 144 * scale, y + 175 * scale]:
        parts.append(f'<rect x="{x - 66 * scale}" y="{stripe_y}" width="{132 * scale}" height="{12 * scale}" rx="6" fill="#d4e0dd" opacity=".9"/>')
    parts.append(f'<path d="M{x - 52 * scale},{y + 185 * scale} Q{x - 105 * scale},{y + 245 * scale} {x - 22 * scale},{y + 245 * scale} M{x + 52 * scale},{y + 185 * scale} Q{x + 105 * scale},{y + 245 * scale} {x + 22 * scale},{y + 245 * scale}" fill="none" stroke="#587d86" stroke-width="36" stroke-linecap="round"/>')
    parts.append(f'<path d="M{x - 70 * scale},{y + 105 * scale} Q{x - 120 * scale},{y + 155 * scale} {x - 20 * scale},{y + 174 * scale} M{x + 70 * scale},{y + 105 * scale} Q{x + 120 * scale},{y + 155 * scale} {x + 20 * scale},{y + 174 * scale}" fill="none" stroke="#7aa0a7" stroke-width="28" stroke-linecap="round"/>')
    return "".join(parts)


def build(language: str, kind: str) -> str:
    data = DATA[language]
    item = data[kind]
    serif, sans = data["serif"], data["sans"]
    svg: list[str] = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536" viewBox="0 0 1024 1536">',
        '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eadbc5"/><stop offset=".55" stop-color="#ccb08b"/><stop offset="1" stop-color="#a98769"/></linearGradient><linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8e9"/><stop offset="1" stop-color="#f2e2c8"/></linearGradient><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="8" result="n"/><feColorMatrix in="n" type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .10"/></feComponentTransfer></filter></defs>',
        '<rect width="1024" height="1536" fill="url(#bg)"/><rect width="1024" height="1536" fill="#fff" opacity=".13" filter="url(#grain)"/>',
        '<path d="M0 1180 Q180 1070 360 1190 T720 1190 T1080 1190 V1536 H0Z" fill="#174f58" opacity=".18"/><path d="M0 1270 Q200 1140 400 1280 T800 1280 T1200 1280 V1536 H0Z" fill="#355f59" opacity=".22"/>',
        courthouse(655, 38, 1.05),
        flower(900, 120, .8),
        flower(954, 190, .55),
        evidence_board(610, 190, 382, 410, sans),
        card(20, 570, 600, 820, 24, "#d6c09d", "#9a754e", True, .72),
        pill(62, 605, 500, 56, item["right_title"], COL["teal"], sans, 22),
        child(472, 1075, .85),
        card(28, 36, 584, 560, 28, "url(#paper)", COL["line"], True),
        text(58, 135, "悲劇" if language == "hant" else "悲剧", 70, COL["teal"], serif, 900),
        text(198, 135, "不忘", 70, COL["rust"], serif, 900),
        text(60, 205, data["date"], 23, COL["rust"], sans, 700),
        f'<line x1="58" y1="228" x2="565" y2="228" stroke="{COL["line"]}" stroke-width="2"/>',
        text(58, 300, item["subtitle"][0], 39, COL["ink"], serif, 800),
        text(58, 350, item["subtitle"][1], 39, COL["ink"], serif, 800),
        pill(55, 380, 525, 58, data["experts"], COL["teal"], sans, 22),
        card(55, 465, 525, 100, 20, "#fbf1df", COL["line"], False),
        multiline(318, 510, data["slogan"], 26, 36, COL["ink"], serif, 700, "middle"),
        card(24, 720, 352, 490, 24, "#fff7e8", COL["line"], True),
        pill(44, 742, 312, 54, item["left_title"], COL["teal"], sans, 24),
        bullets(60, 840, item["left"], sans, 20, 28, 18, COL["rust"]),
        card(535, 500, 462, 515 if kind == "forensic" else 520, 24, "#fff7e8", COL["line"], True),
        pill(558, 524, 416, 56, item["right_title"], COL["rust"] if kind == "forensic" else COL["teal"], sans, 21),
    ]
    if kind == "forensic":
        svg.extend([
            text(565, 630, item["right_label"] + "：", 26, COL["rust"], sans, 800),
            bullets(580, 682, item["right"], sans, 20, 28, 14, COL["rust"]),
            text(565, 866, item["factor"], 22, COL["rust"], sans, 700),
            card(558, 913, 416, 80, 16, "#f1e2c9", COL["gold"], False),
            multiline(766, 948, item["note"], 20, 27, COL["teal"], sans, 800, "middle"),
        ])
    else:
        svg.append(bullets(570, 630, item["right"], sans, 20, 28, 22, COL["rust"]))
    bottom_y = 1035
    svg.extend([
        card(624, bottom_y, 373, 365, 24, "#fff7e8", COL["line"], True),
        pill(646, bottom_y + 22, 329, 55, item["bottom_title"], COL["gold"] if kind == "forensic" else COL["teal"], sans, 23),
        bullets(664, bottom_y + 118, item["bottom"], sans, 18, 26, 15, COL["gold"] if kind == "forensic" else COL["teal"]),
        card(250, 1398, 520, 44, 18, "#fff8e9", "#dfc8aa", False, .92),
        text(510, 1427, data["disclaimer"], 17, COL["muted"], sans, 500, "middle"),
        '<rect x="0" y="1460" width="1024" height="76" fill="#074c55" opacity=".96"/>',
        text(42, 1510, data["footer"], 24, "#fff4df", sans, 700),
        text(970, 1510, item["page"], 25, "#fff4df", sans, 800, "end"),
        "</svg>",
    ])
    return "".join(svg)


for language in ("hant", "hans"):
    for kind in ("forensic", "medical"):
        destination = OUT / f"day5-{kind}-{language}.svg"
        destination.write_text(build(language, kind), encoding="utf-8")
        print(destination)
