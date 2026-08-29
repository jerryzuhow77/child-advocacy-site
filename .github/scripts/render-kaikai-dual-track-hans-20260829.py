from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path('assets/art')
SOURCE = ROOT / 'kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp'
OUTPUT = ROOT / 'kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp'
SANS = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
SERIF = '/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
FONT_INDEX_SC = 2

if not SOURCE.is_file():
    raise SystemExit(f'Missing Traditional source poster: {SOURCE}')

image = Image.open(SOURCE).convert('RGBA')
if image.size != (1536, 864):
    raise SystemExit(f'Unexpected source dimensions: {image.size}')


def panel(box, top, bottom, radius=18, outline=None, outline_width=2, shadow=True):
    x0, y0, x1, y1 = map(int, box)
    width, height = x1 - x0, y1 - y0
    if shadow:
        layer = Image.new('RGBA', image.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(layer)
        draw.rounded_rectangle((x0 + 4, y0 + 5, x1 + 4, y1 + 5), radius=radius, fill=(0, 0, 0, 82))
        image.alpha_composite(layer.filter(ImageFilter.GaussianBlur(5)))
    fill = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(fill)
    for y in range(height):
        ratio = y / max(1, height - 1)
        color = tuple(int(top[i] * (1 - ratio) + bottom[i] * ratio) for i in range(3)) + (255,)
        draw.line((0, y, width, y), fill=color)
    mask = Image.new('L', (width, height), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, width - 1, height - 1), radius=radius, fill=255)
    fill.putalpha(mask)
    image.alpha_composite(fill, (x0, y0))
    if outline:
        ImageDraw.Draw(image).rounded_rectangle((x0, y0, x1, y1), radius=radius, outline=outline, width=outline_width)


def text(box, value, font_path=SANS, max_size=40, min_size=9, fill=(9, 34, 57), stroke_width=0, stroke_fill=None, spacing=4, align='center'):
    x0, y0, x1, y1 = map(int, box)
    draw = ImageDraw.Draw(image)
    lines = value.split('\n')
    chosen = None
    boxes = None
    for size in range(max_size, min_size - 1, -1):
        font = ImageFont.truetype(font_path, size, index=FONT_INDEX_SC)
        metrics = [draw.textbbox((0, 0), line, font=font, stroke_width=stroke_width) for line in lines]
        widths = [metric[2] - metric[0] for metric in metrics]
        heights = [metric[3] - metric[1] for metric in metrics]
        if max(widths, default=0) <= x1 - x0 - 8 and sum(heights) + spacing * (len(lines) - 1) <= y1 - y0 - 6:
            chosen, boxes = font, metrics
            break
    if chosen is None:
        chosen = ImageFont.truetype(font_path, min_size, index=FONT_INDEX_SC)
        boxes = [draw.textbbox((0, 0), line, font=chosen, stroke_width=stroke_width) for line in lines]
    heights = [metric[3] - metric[1] for metric in boxes]
    y = y0 + ((y1 - y0) - sum(heights) - spacing * (len(lines) - 1)) / 2
    for line, metric, height in zip(lines, boxes, heights):
        width = metric[2] - metric[0]
        x = x0 + 7 if align == 'left' else x1 - width - 7 if align == 'right' else x0 + ((x1 - x0) - width) / 2
        draw.text((x, y - metric[1]), line, font=chosen, fill=fill, stroke_width=stroke_width, stroke_fill=stroke_fill or fill)
        y += height + spacing


cream_top, cream_bottom, cream_outline = (247, 233, 198), (229, 207, 164), (123, 84, 44)
teal_top, teal_bottom, teal_outline = (12, 127, 135), (3, 79, 88), (198, 171, 103)
navy_top, navy_bottom = (29, 70, 111), (9, 42, 74)
gold_top, gold_bottom = (164, 101, 16), (106, 57, 0)
red_top, red_bottom = (190, 40, 45), (113, 14, 17)
purple_top, purple_bottom = (111, 76, 118), (61, 40, 72)
navy_text, cream_text = (9, 34, 57), (249, 237, 208)

# Title and primary tracks.
panel((380, 10, 1160, 91), cream_top, cream_bottom, 24, cream_outline)
text((395, 14, 1145, 87), '剀剀出养前｜双轨责任关系树', SERIF, 48, 26, navy_text, 1, (240, 220, 180), 2)
panel((136, 151, 438, 205), teal_top, teal_bottom, 20, teal_outline)
text((145, 156, 429, 201), '家庭／出养服务轨', SERIF, 29, 18, cream_text, 1, (35, 44, 41), 2)
panel((574, 151, 950, 205), navy_top, navy_bottom, 20, (193, 156, 90))
text((585, 156, 940, 201), '案发当时｜中央双主管', SERIF, 28, 18, cream_text, 1, (20, 35, 48), 2)
panel((979, 141, 1338, 183), cream_top, cream_bottom, 17, cream_outline)
text((988, 146, 1329, 178), '2024.09.03起｜儿盟法人主管改隶卫福部', SANS, 18, 11, navy_text)
panel((1136, 181, 1420, 238), gold_top, gold_bottom, 18, (222, 186, 112))
text((1146, 186, 1410, 234), '托育登记／监督轨', SERIF, 29, 18, cream_text, 1, (53, 30, 4), 2)

# Family and adoption-service axis.
panel((181, 227, 415, 280), cream_top, cream_bottom, 16, cream_outline)
text((190, 233, 406, 274), '新北市政府社会局', SERIF, 25, 16, navy_text)
panel((184, 332, 414, 396), cream_top, cream_bottom, 18, cream_outline)
text((194, 336, 404, 389), '树莺社福中心\n脆弱家庭开案', SERIF, 25, 14, navy_text, spacing=3)
panel((305, 405, 418, 447), cream_top, cream_bottom, 15, cream_outline)
text((311, 409, 412, 443), '两次转介', SERIF, 21, 12, navy_text)

# Central dual supervision.
panel((456, 210, 681, 331), cream_top, cream_bottom, 15, cream_outline)
text((466, 216, 671, 262), '教育部', SERIF, 31, 20, navy_text)
panel((472, 258, 665, 296), cream_top, cream_bottom, 10, (173, 132, 81), 1, False)
text((478, 261, 659, 293), '基金会法人主管机关', SANS, 17, 11, navy_text)
panel((488, 294, 650, 326), cream_top, cream_bottom, 9, (173, 132, 81), 1, False)
text((493, 297, 645, 323), '会务／财务／董事会', SANS, 17, 10, navy_text)
panel((718, 210, 973, 332), cream_top, cream_bottom, 15, cream_outline)
text((728, 216, 963, 263), '卫生福利部', SERIF, 31, 20, navy_text)
panel((733, 258, 958, 298), cream_top, cream_bottom, 10, (173, 132, 81), 1, False)
text((739, 261, 952, 295), '收出养媒合业务主管机关', SANS, 17, 10, navy_text)
panel((759, 296, 933, 328), cream_top, cream_bottom, 9, (173, 132, 81), 1, False)
text((765, 299, 927, 325), '许可／检查／评鉴', SANS, 18, 11, navy_text)
panel((997, 243, 1151, 282), cream_top, cream_bottom, 12, cream_outline)
text((1003, 247, 1145, 278), '居托法规／指引', SANS, 18, 11, navy_text)
panel((496, 372, 652, 414), purple_top, purple_bottom, 14, (202, 159, 108))
text((503, 376, 645, 410), '财团法人监督', SERIF, 20, 12, cream_text, 1, (30, 25, 30), 2)
panel((752, 372, 932, 414), teal_top, teal_bottom, 14, teal_outline)
text((759, 376, 925, 410), '收出养业务监督', SERIF, 20, 12, cream_text, 1, (25, 35, 34), 2)

# Child-care registration/supervision axis.
panel((1246, 255, 1468, 312), cream_top, cream_bottom, 16, cream_outline)
text((1255, 261, 1459, 306), '台北市政府社会局', SERIF, 24, 15, navy_text)
panel((1352, 309, 1457, 352), gold_top, gold_bottom, 14, (222, 186, 112))
text((1358, 313, 1451, 348), '委托办理', SERIF, 20, 12, cream_text, 1, (40, 24, 3), 2)
panel((1230, 348, 1463, 426), cream_top, cream_bottom, 17, cream_outline)
text((1240, 353, 1453, 419), '文山区居托中心\n登记／访视／监督', SERIF, 25, 13, navy_text, spacing=3)
panel((1239, 439, 1355, 483), gold_top, gold_bottom, 14, (222, 186, 112))
text((1245, 443, 1349, 479), '居托监督', SERIF, 19, 12, cream_text, 1, (40, 24, 3), 2)

# Grandmother, organization, and caregiver.
panel((88, 482, 218, 569), cream_top, cream_bottom, 17, cream_outline, 1, False)
text((95, 487, 211, 562), '外祖母\n监护人／出养人', SERIF, 27, 14, navy_text, spacing=4)
panel((279, 495, 426, 544), teal_top, teal_bottom, 15, teal_outline)
text((286, 500, 419, 539), '委托出养媒合', SERIF, 19, 11, cream_text, 1, (25, 35, 34), 2)
panel((526, 454, 770, 574), cream_top, cream_bottom, 16, cream_outline, 1, False)
text((537, 457, 759, 512), '儿福联盟', SERIF, 34, 22, navy_text)
panel((538, 512, 759, 562), teal_top, teal_bottom, 13, teal_outline, 1, False)
text((546, 517, 751, 557), '收出养媒合／出养前安置', SANS, 18, 10, cream_text, 1, (30, 40, 39), 2)
panel((766, 493, 879, 553), teal_top, teal_bottom, 14, teal_outline)
text((772, 497, 873, 549), '合作保母／\n转介收托／访视', SANS, 15, 9, cream_text, 1, (25, 35, 34), 2)
panel((969, 446, 1236, 505), cream_top, cream_bottom, 16, cream_outline, 1, False)
text((979, 450, 1226, 500), '刘彩萱', SERIF, 34, 22, navy_text)
panel((979, 505, 1222, 546), teal_top, teal_bottom, 13, teal_outline, 1, False)
text((986, 510, 1215, 542), '儿盟合作保母', SANS, 18, 11, cream_text, 1, (25, 35, 34), 2)
panel((978, 545, 1224, 582), gold_top, gold_bottom, 12, (222, 186, 112), 1, False)
text((985, 549, 1217, 578), '台北市登记居家托育人员', SANS, 17, 10, cream_text, 1, (40, 24, 3), 2)
panel((979, 580, 1227, 612), cream_top, cream_bottom, 10, cream_outline, 1, False)
text((985, 583, 1221, 609), '2023.09.01起｜24小时全日托育', SANS, 15, 9, navy_text)

# Unmatched status seal.
shadow = Image.new('RGBA', image.size, (0, 0, 0, 0))
draw = ImageDraw.Draw(shadow)
draw.ellipse((1279, 475, 1398, 594), fill=(0, 0, 0, 90))
image.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(5)))
draw = ImageDraw.Draw(image)
draw.ellipse((1275, 470, 1394, 589), fill=(169, 28, 31), outline=(235, 118, 88), width=3)
draw.ellipse((1280, 475, 1389, 584), outline=(245, 188, 143), width=2)
text((1287, 486, 1382, 572), '未媒合\n剀剀', SERIF, 30, 18, cream_text, 1, (68, 18, 18), 3)

# Contract, child status, clarification, and legend.
panel((478, 611, 1075, 669), red_top, red_bottom, 10, (239, 145, 102))
text((490, 617, 1063, 663), '外祖母 × 儿福联盟 × 刘彩萱｜三方托育契约', SERIF, 25, 14, cream_text, 1, (65, 15, 15), 2)
panel((755, 744, 1042, 805), cream_top, cream_bottom, 17, cream_outline)
text((766, 750, 1031, 799), '剀剀｜待出养儿童', SERIF, 27, 17, navy_text)
panel((749, 794, 1027, 843), (241, 193, 80), (211, 143, 23), 17, (170, 103, 15))
text((760, 800, 1016, 837), '不是孤儿；刘彩萱不是收养人', SANS, 17, 10, (28, 29, 23))
panel((1139, 643, 1515, 802), cream_top, cream_bottom, 13, cream_outline, 2, False)
text((1185, 661, 1500, 788), '● 案发时法人主管是教育部\n● 收出养业务主管是卫福部\n● 不是地方教育局', SANS, 19, 13, navy_text, spacing=8, align='left')
panel((1196, 611, 1452, 665), red_top, red_bottom, 15, (239, 145, 102))
text((1210, 616, 1440, 660), '关键厘清', SERIF, 27, 17, cream_text, 1, (65, 15, 15), 2)
panel((1078, 796, 1522, 848), cream_top, cream_bottom, 12, cream_outline, 1, False)
draw = ImageDraw.Draw(image)
legend_font = ImageFont.truetype(SANS, 15, index=FONT_INDEX_SC)
legend_small = ImageFont.truetype(SANS, 14, index=FONT_INDEX_SC)
draw.text((1090, 811), '图例：', font=legend_font, fill=navy_text)
draw.line((1150, 822, 1191, 822), fill=(14, 133, 141), width=7)
draw.polygon([(1191, 814), (1205, 822), (1191, 830)], fill=(14, 133, 141))
draw.text((1211, 810), '出养服务', font=legend_small, fill=navy_text)
draw.line((1301, 822, 1342, 822), fill=(184, 117, 15), width=7)
draw.polygon([(1342, 814), (1356, 822), (1342, 830)], fill=(184, 117, 15))
draw.text((1362, 810), '托育监督', font=legend_small, fill=navy_text)
for x in range(1445, 1485, 10):
    draw.line((x, 822, x + 6, 822), fill=(187, 42, 43), width=6)
draw.text((1490, 810), '资讯断点', font=legend_small, fill=navy_text)

image.convert('RGB').save(OUTPUT, 'WEBP', quality=92, method=6)
if not OUTPUT.is_file() or OUTPUT.stat().st_size < 100_000:
    raise SystemExit('Simplified poster export failed or is unexpectedly small')
print(f'Created {OUTPUT} ({OUTPUT.stat().st_size} bytes)')
