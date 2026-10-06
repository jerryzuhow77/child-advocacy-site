"""Regression check for the designated Jiajia hearing display sources only."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUALIFIER = re.compile(
    r'待官方公告確[認认]|待官方公告确认|尚未取得官方直接公告[確确][認认]|'
    r'awaiting official confirmation|No direct official announcement|'
    r'公式発表による確認待ち|公式発表は未確認',
    re.I,
)
TARGETS = {
    'news/liangping-naimilk-jiajia-hearing-20261007/index.html': (
        '既有資料標註 16:45 為開庭', '約 16:30 為集合', '新海報標示 16:30 未註明用途'
    ),
    'news/liangping-naimilk-jiajia-hearing-20261007/zh-Hans/index.html': (
        '既有资料标注 16:45 为开庭', '约 16:30 为集合', '新海报标示 16:30 未注明用途'
    ),
    'en/features/social-observation/three-cases-hearings-202610-11/index.html': (
        '16:45 is listed as the hearing time', '16:30 as the gathering time',
        'poster lists 16:30 without stating which it is'
    ),
    'en/news/three-upcoming-hearings-20261004/index.html': (
        '16:45 is listed as the hearing time', '16:30 as the gathering time',
        'poster lists 16:30 without'
    ),
    'ja/features/social-observation/three-cases-hearings-202610-11/index.html': (
        '16:45を開廷時刻', '16:30頃を集合時刻', 'ポスターは16:30とだけ示し'
    ),
    'ja/news/three-upcoming-hearings-20261004/index.html': (
        '16:45を開廷時刻', '16:30頃を集合時刻', 'ポスターは16:30とだけ示し'
    ),
}
units = 0
for path, phrases in TARGETS.items():
    text = (ROOT / path).read_text(encoding='utf-8')
    assert QUALIFIER.search(text), f'Missing official-confirmation boundary: {path}'
    for phrase in phrases:
        assert phrase in text, f'Missing separate time-role boundary in {path}: {phrase}'
        units += 1

news_desk = (ROOT / 'assets/news-desk-20260903.js').read_text(encoding='utf-8')
for phrase in ('16:45 為開庭', '16:30 為集合', '新海報標示 16:30 未註明用途'):
    assert phrase in news_desk, f'Missing news-desk boundary: {phrase}'
    units += 1
assert QUALIFIER.search(news_desk), 'Missing news-desk official-confirmation boundary'

bulletins = json.loads((ROOT / 'data/latest-bulletins.json').read_text(encoding='utf-8'))
jiajia = next(item for section in ('pinned', 'items') for item in bulletins[section]
              if item.get('id') == 'jiajia-hearing-20261007')
for locale in ('zh-Hant', 'zh-Hans'):
    summary = jiajia['summary'][locale]
    assert QUALIFIER.search(summary), f'Missing bulletin boundary: {locale}'
    assert '16:45' in summary and '16:30' in summary, f'Missing time comparison: {locale}'
    units += 1

homepage = (ROOT / 'assets/home-jiajia-hearing-reminder-20261006.js').read_text(encoding='utf-8')
assert '未註明是集合或開庭時間' in homepage
assert '未注明是集合或开庭时间' in homepage
assert '均待法院公告確認' in homepage
assert '均待法院公告确认' in homepage
units += 4
print(f'PASS: {units} designated Jiajia display checks retain separate time roles and official-confirmation boundaries.')
