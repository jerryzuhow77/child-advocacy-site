from pathlib import Path

hans_path = Path('hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/index.html')
hans = hans_path.read_text(encoding='utf-8')
assets = {
    'kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp': 3,
    'kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp': 1,
}
for filename, expected in assets.items():
    old = f'../../../assets/art/{filename}'
    new = f'../../../../assets/art/{filename}'
    count = hans.count(old)
    if count == expected:
        hans = hans.replace(old, new)
    elif count == 0 and hans.count(new) == expected:
        pass
    else:
        raise SystemExit(f'{filename}: unexpected relative-path counts old={count}, new={hans.count(new)}')
if hans.count('../../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp') != 3:
    raise SystemExit('Simplified display/download paths are not complete')
if hans.count('../../../../assets/art/kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp') != 1:
    raise SystemExit('Traditional download path on Simplified page is not complete')
hans_path.write_text(hans, encoding='utf-8')

verifier_path = Path('.github/scripts/verify-kaikai-dual-track-pair-20260829.mjs')
verifier = verifier_path.read_text(encoding='utf-8')
old = """    await page.waitForSelector('#system .responsibility-tree-pair', { state: 'visible', timeout: 15000 });
    await page.waitForFunction(() => {
      const image = document.querySelector('#system .responsibility-tree-visual img');
"""
new = """    await page.waitForSelector('#system .responsibility-tree-pair', { state: 'visible', timeout: 15000 });
    await page.locator('#system .responsibility-tree-visual img').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const image = document.querySelector('#system .responsibility-tree-visual img');
"""
if old in verifier:
    verifier = verifier.replace(old, new, 1)
elif new not in verifier:
    raise SystemExit('Could not find the verifier lazy-image block')
verifier_path.write_text(verifier, encoding='utf-8')
print('Corrected Simplified asset depth and made browser verification lazy-image aware.')
