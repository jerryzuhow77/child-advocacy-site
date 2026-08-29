from pathlib import Path

path = Path('.github/scripts/patch-kaikai-prologue-audio-and-menu-20260829.py')
text = path.read_text(encoding='utf-8')

# Add the localized visible label used when replacing the skip button.
if "'skip_visible': '略過／進入'" not in text:
    text = text.replace(
        "        'skip_label': '略過序幕、進入正文並繼續背景配樂',\n        'skip_title': '進入正文並繼續背景配樂',\n",
        "        'skip_label': '略過序幕、進入正文並繼續背景配樂',\n        'skip_title': '進入正文並繼續背景配樂',\n        'skip_visible': '略過／進入',\n",
        1,
    )
if "'skip_visible': '略过／进入'" not in text:
    text = text.replace(
        "        'skip_label': '略过序幕、进入正文并继续背景配乐',\n        'skip_title': '进入正文并继续背景配乐',\n",
        "        'skip_label': '略过序幕、进入正文并继续背景配乐',\n        'skip_title': '进入正文并继续背景配乐',\n        'skip_visible': '略过／进入',\n",
        1,
    )

# Rewrite the handful of source-code lines directly instead of relying on the
# escaping style used when this temporary script was first created.
lines = text.splitlines()
for index, line in enumerate(lines):
    stripped = line.strip()
    indent = line[:len(line) - len(line.lstrip())]
    if stripped.startswith('css_match = re.search('):
        lines[index] = indent + "css_match = re.search(r'final-chapter[.]css[?]v=20260829-([0-9]+)', text)"
    elif stripped.startswith('js_match = re.search('):
        lines[index] = indent + "js_match = re.search(r'final-chapter[.]js[?]v=20260829-([0-9]+)', text)"
    elif stripped.startswith("text = re.sub(r'final-chapter") and '.css' in stripped:
        lines[index] = indent + "text = re.sub(r'final-chapter[.]css[?]v=20260829-[0-9]+', f'final-chapter.css?v=20260829-{next_css_version}', text, count=1)"
    elif stripped.startswith("text = re.sub(r'final-chapter") and '.js' in stripped:
        lines[index] = indent + "text = re.sub(r'final-chapter[.]js[?]v=20260829-[0-9]+', f'final-chapter.js?v=20260829-{next_js_version}', text, count=1)"
    elif 'nav-group-major>summary:before' in stripped and stripped.startswith("r'"):
        lines[index] = indent + "r'[.]nav-group-major>summary:before[{][^}]*[}]',"
text = '\n'.join(lines) + '\n'

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

required = [
    "'skip_visible': '略過／進入'",
    "'skip_visible': '略过／进入'",
    'config["skip_visible"]',
    "final-chapter[.]css[?]v=20260829-([0-9]+)",
    "final-chapter[.]js[?]v=20260829-([0-9]+)",
    "r'[.]nav-group-major>summary:before[{][^}]*[}]'",
]
for phrase in required:
    if phrase not in text:
        raise SystemExit(f'Prepared patch is missing {phrase}')

path.write_text(text, encoding='utf-8')
print('Prepared localized prologue patch and cache-key matching.')
