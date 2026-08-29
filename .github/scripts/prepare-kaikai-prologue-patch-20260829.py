from pathlib import Path

path = Path('.github/scripts/patch-kaikai-prologue-audio-and-menu-20260829.py')
text = path.read_text(encoding='utf-8')

# Add localized visible copy for the skip/enter button.
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

# The current CSS cache key is descriptive (for example mobile-panorama-1),
# rather than an integer. Replace the old numeric-only version block with a
# stable publication cache key and accept any existing non-quote value.
lines = text.splitlines()
try:
    version_start = next(i for i, line in enumerate(lines) if line.strip() == 'css_versions: list[int] = []')
    version_end = next(i for i, line in enumerate(lines[version_start:], start=version_start) if line.strip().startswith('next_js_version ='))
except StopIteration as error:
    raise SystemExit('Could not locate the original cache-version block') from error

version_block = [
    'for config in HTML_CONFIGS:',
    "    text = config['path'].read_text(encoding='utf-8')",
    "    css_match = re.search(r'final-chapter[.]css[?]v=[^\"\\\']+', text)",
    "    js_match = re.search(r'final-chapter[.]js[?]v=[^\"\\\']+', text)",
    '    if not css_match or not js_match:',
    "        raise SystemExit(f\"{config['path']}: CSS or JS cache version not found\")",
    '',
    "next_css_version = 'prologue-audio-1'",
    "next_js_version = 'prologue-audio-1'",
]
lines[version_start:version_end + 1] = version_block

for index, line in enumerate(lines):
    stripped = line.strip()
    indent = line[:len(line) - len(line.lstrip())]
    if stripped.startswith("text = re.sub(r'final-chapter") and '.css' in stripped:
        lines[index] = indent + "text = re.sub(r'final-chapter[.]css[?]v=[^\"\\\']+', f'final-chapter.css?v=20260829-{next_css_version}', text, count=1)"
    elif stripped.startswith("text = re.sub(r'final-chapter") and '.js' in stripped:
        lines[index] = indent + "text = re.sub(r'final-chapter[.]js[?]v=[^\"\\\']+', f'final-chapter.js?v=20260829-{next_js_version}', text, count=1)"
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
    "next_css_version = 'prologue-audio-1'",
    "next_js_version = 'prologue-audio-1'",
    "final-chapter[.]css[?]v=[^\"\\\']+",
    "final-chapter[.]js[?]v=[^\"\\\']+",
    "r'[.]nav-group-major>summary:before[{][^}]*[}]'",
]
for phrase in required:
    if phrase not in text:
        raise SystemExit(f'Prepared patch is missing {phrase}')

path.write_text(text, encoding='utf-8')
print('Prepared localized prologue patch for descriptive cache keys.')
