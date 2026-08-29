from pathlib import Path

path = Path('.github/scripts/patch-kaikai-prologue-audio-and-menu-20260829.py')
text = path.read_text(encoding='utf-8')

text = text.replace(
    "        'skip_label': '略過序幕、進入正文並繼續背景配樂',\n        'skip_title': '進入正文並繼續背景配樂',\n",
    "        'skip_label': '略過序幕、進入正文並繼續背景配樂',\n        'skip_title': '進入正文並繼續背景配樂',\n        'skip_visible': '略過／進入',\n",
    1,
)
text = text.replace(
    "        'skip_label': '略过序幕、进入正文并继续背景配乐',\n        'skip_title': '进入正文并继续背景配乐',\n",
    "        'skip_label': '略过序幕、进入正文并继续背景配乐',\n        'skip_title': '进入正文并继续背景配乐',\n        'skip_visible': '略过／进入',\n",
    1,
)
old_pattern = """        r'<button class=\"entry-prologue__skip\" type=\"button\" data-prologue-skip aria-label=\"[^\"]*\" title=\"[^\"]*\">略過／進入<span aria-hidden=\"true\">↓</span></button>',
        f'<button class=\"entry-prologue__skip\" type=\"button\" data-prologue-skip aria-label=\"{config[\"skip_label\"]}\" title=\"{config[\"skip_title\"]}\">略過／進入<span aria-hidden=\"true\">↓</span></button>',
"""
new_pattern = """        r'<button class=\"entry-prologue__skip\" type=\"button\" data-prologue-skip aria-label=\"[^\"]*\" title=\"[^\"]*\">.*?<span aria-hidden=\"true\">↓</span></button>',
        f'<button class=\"entry-prologue__skip\" type=\"button\" data-prologue-skip aria-label=\"{config[\"skip_label\"]}\" title=\"{config[\"skip_title\"]}\">{config[\"skip_visible\"]}<span aria-hidden=\"true\">↓</span></button>',
"""
if old_pattern in text:
    text = text.replace(old_pattern, new_pattern, 1)
elif new_pattern not in text:
    raise SystemExit('Localized skip-button pattern was not found')

for phrase in ["'skip_visible': '略過／進入'", "'skip_visible': '略过／进入'", 'config["skip_visible"]']:
    if phrase not in text:
        raise SystemExit(f'Prepared patch is missing {phrase}')
path.write_text(text, encoding='utf-8')
print('Prepared localized prologue skip-button patch.')
