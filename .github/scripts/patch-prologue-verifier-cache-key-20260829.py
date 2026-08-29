from pathlib import Path

path = Path('.github/scripts/verify-kaikai-prologue-audio-and-menu-20260829.mjs')
text = path.read_text(encoding='utf-8')
old = """        currentAssets: /final-chapter\\.css\\?v=20260829-\\d+/.test(result.prologue.cssHref)
          && /final-chapter\\.js\\?v=20260829-\\d+/.test(result.prologue.jsSrc),
"""
new = """        currentAssets: result.prologue.cssHref.includes('final-chapter.css?v=20260829-prologue-audio-1')
          && result.prologue.jsSrc.includes('final-chapter.js?v=20260829-prologue-audio-1'),
"""
count = text.count(old)
if count != 1:
    raise SystemExit(f'Expected one stale cache assertion, found {count}')
path.write_text(text.replace(old, new, 1), encoding='utf-8')
print('Updated the prologue verifier to the descriptive cache key.')
