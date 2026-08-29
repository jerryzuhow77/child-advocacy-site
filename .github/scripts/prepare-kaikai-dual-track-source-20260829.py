from pathlib import Path

render_path = Path('.github/scripts/render-kaikai-dual-track-hans-20260829.py')
render = render_path.read_text(encoding='utf-8')
old_source = """image = Image.open(SOURCE).convert('RGBA')
if image.size != (1536, 864):
    raise SystemExit(f'Unexpected source dimensions: {image.size}')
"""
new_source = """image = Image.open(SOURCE).convert('RGBA')
source_size = image.size
if source_size not in {(960, 540), (1536, 864)}:
    raise SystemExit(f'Unexpected source dimensions: {source_size}')
if source_size != (1536, 864):
    image = image.resize((1536, 864), Image.Resampling.LANCZOS)
"""
if render.count(old_source) != 1:
    raise SystemExit(f'Expected one source-dimension block, found {render.count(old_source)}')
render = render.replace(old_source, new_source, 1)
old_save = """image.convert('RGB').save(OUTPUT, 'WEBP', quality=92, method=6)
if not OUTPUT.is_file() or OUTPUT.stat().st_size < 100_000:
"""
new_save = """result = image.convert('RGB')
if result.size != source_size:
    result = result.resize(source_size, Image.Resampling.LANCZOS)
result.save(OUTPUT, 'WEBP', quality=92, method=6)
if not OUTPUT.is_file() or OUTPUT.stat().st_size < 80_000:
"""
if render.count(old_save) != 1:
    raise SystemExit(f'Expected one output block, found {render.count(old_save)}')
render_path.write_text(render.replace(old_save, new_save, 1), encoding='utf-8')

place_path = Path('.github/scripts/place-kaikai-dual-track-poster-20260829.py')
place = place_path.read_text(encoding='utf-8')
count = place.count('width="1536" height="864"')
if count != 2:
    raise SystemExit(f'Expected two HTML dimensions, found {count}')
place = place.replace('width="1536" height="864"', 'width="960" height="540"')
old_pairing = """    first_start = min(visual_start, tree_start)
    last_end = max(visual_end, tree_end)
    middle = text[min(visual_end, tree_end):max(visual_start, tree_start)]
    if re.sub(r'<!--.*?-->|\\s+', '', middle, flags=re.S):
        raise SystemExit(f'{path}: unexpected content between visual and five-layer tree')

    wrapper = f'''{PAIR_MARKER}\\n    <div class=\"responsibility-tree-pair\">\\n      {visual_template}\\n\\n{tree_block}\\n    </div>'''
    text = text[:first_start] + wrapper + text[last_end:]
"""
new_pairing = """    # Remove the existing standalone visual from its old location, preserve any
    # intervening explanatory content, then wrap the five-layer tree at its own
    # location. This makes the placement robust even when notes sit between them.
    text = text[:visual_start] + text[visual_end:]
    tree_start, tree_end, tree_block = find_balanced_block(
        text,
        r'<section\\b[^>]*\\bclass=\"[^\"]*responsibility-tree-panel[^\"]*\"[^>]*>',
        'section',
        f'{path} five-layer tree after visual removal',
    )
    wrapper = f'''{PAIR_MARKER}\\n    <div class=\"responsibility-tree-pair\">\\n      {visual_template}\\n\\n{tree_block}\\n    </div>'''
    text = text[:tree_start] + wrapper + text[tree_end:]
"""
if place.count(old_pairing) != 1:
    raise SystemExit(f'Expected one adjacency-dependent pairing block, found {place.count(old_pairing)}')
place = place.replace(old_pairing, new_pairing, 1)
old_tail = """css_path.write_text(css, encoding='utf-8')

print('Placed the bilingual dual-track poster beside the five-layer responsibility tree.')
"""
new_tail = """css_path.write_text(css, encoding='utf-8')

# Generated wrapper placement can leave indentation-only lines where the old
# standalone visual lived. Normalize all touched text files before diff checks.
for output_path in [ROOT / 'index.html', ROOT / 'zh-Hans' / 'index.html', css_path]:
    generated = output_path.read_text(encoding='utf-8')
    normalized = '\\n'.join(line.rstrip() for line in generated.splitlines()) + '\\n'
    output_path.write_text(normalized, encoding='utf-8')

print('Placed the bilingual dual-track poster beside the five-layer responsibility tree.')
"""
if place.count(old_tail) != 1:
    raise SystemExit(f'Expected one placement-script tail, found {place.count(old_tail)}')
place = place.replace(old_tail, new_tail, 1)
place_path.write_text(place, encoding='utf-8')
print('Prepared dual-track renderer, robust placement, and whitespace normalization.')
