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
place_path.write_text(place.replace('width="1536" height="864"', 'width="960" height="540"'), encoding='utf-8')
print('Prepared dual-track renderer for the current 960×540 web asset.')
