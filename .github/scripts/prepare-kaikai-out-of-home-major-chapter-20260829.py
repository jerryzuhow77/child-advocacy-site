from pathlib import Path

patch_path = Path('.github/scripts/promote-kaikai-out-of-home-major-chapter-20260829.py')
patch = patch_path.read_text(encoding='utf-8')
old = "        'path': ROOT / 'zh-Hans' / 'index.html',\n        'responsibility_summary': '制度責任',\n"
new = "        'path': ROOT / 'zh-Hans' / 'index.html',\n        'responsibility_summary': '制度责任',\n"
if old in patch:
    patch = patch.replace(old, new, 1)
elif new not in patch:
    raise SystemExit('Simplified responsibility summary was not found in the promotion script')
patch_path.write_text(patch, encoding='utf-8')

verifier_path = Path('.github/scripts/verify-kaikai-out-of-home-major-chapter-20260829.mjs')
verifier = verifier_path.read_text(encoding='utf-8')
old_config = "  'zh-Hans': {\n    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',\n    majorSummary: '家外安置大篇章',\n    majorTitle: '离开危险以后，谁持续保护孩子？',\n    heroEntry: '家外安置大篇章',\n    startLink: '开始阅读完整专章',\n    responsibilitySummary: '制度責任',\n"
new_config = "  'zh-Hans': {\n    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',\n    majorSummary: '家外安置大篇章',\n    majorTitle: '离开危险以后，谁持续保护孩子？',\n    heroEntry: '家外安置大篇章',\n    startLink: '开始阅读完整专章',\n    responsibilitySummary: '制度责任',\n"
if old_config in verifier:
    verifier = verifier.replace(old_config, new_config, 1)
elif new_config not in verifier:
    raise SystemExit('Simplified verifier configuration was not found')

old_open = "      if (!(await group.getAttribute('open'))) await summary.click();\n"
new_open = "      if (!(await group.evaluate((element) => element.hasAttribute('open')))) await summary.click();\n"
if old_open in verifier:
    verifier = verifier.replace(old_open, new_open, 1)
elif new_open not in verifier:
    raise SystemExit('Major navigation open-state check was not found')
verifier_path.write_text(verifier, encoding='utf-8')

print('Prepared localized out-of-home major chapter scripts.')
