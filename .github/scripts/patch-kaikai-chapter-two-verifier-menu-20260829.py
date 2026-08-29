from pathlib import Path

path = Path('.github/scripts/verify-kaikai-chapter-two-major-20260829.mjs')
text = path.read_text(encoding='utf-8')
start = text.find("      const featureToggle = page.locator('.special-feature-nav-toggle');")
if start < 0:
    start = text.find("      const chapterToggle = page.locator('button[aria-controls=\"specialFeatureChapterTwoZh\"]');")
end = text.find("      const targetResponse = await context.request.get(site.chapterUrl", start)
if start < 0 or end < 0:
    raise SystemExit('Could not bound the old nested-menu verification block')

replacement = '''      const chapterToggle = page.locator('button[aria-controls="specialFeatureChapterTwoZh"]');
      await chapterToggle.evaluate((button) => button.click());
      await page.waitForFunction(() => document.querySelector('button[aria-controls="specialFeatureChapterTwoZh"]')?.getAttribute('aria-expanded') === 'true', null, { timeout: 8000 });
      result.menu = await page.locator('[data-kaikai-chapter-two-root-entry]').evaluate((group) => {
        const children = group.querySelector('.special-feature-prologue-children');
        return {
          expanded: group.querySelector(':scope > button')?.getAttribute('aria-expanded') === 'true',
          linkCount: children?.querySelectorAll('a[href]').length || 0,
          childId: children?.id || ''
        };
      });

      await page.locator('[data-kaikai-chapter-two-launch]').screenshot({
        path: `${output}/${language}-${viewportName}-major-launch.png`,
        animations: 'disabled',
        caret: 'hide'
      });

      await page.evaluate(() => {
        document.querySelector('[data-qa-chapter-two-menu-snapshot]')?.remove();
        const source = document.querySelector('[data-kaikai-chapter-two-root-entry]');
        if (!source) return;
        const snapshot = document.createElement('section');
        snapshot.dataset.qaChapterTwoMenuSnapshot = 'true';
        snapshot.style.cssText = 'display:block;position:relative;width:min(100%,1040px);margin:20px auto;padding:18px;background:#f4ead7;color:#173739;border:1px solid #d4a255;border-radius:20px;box-sizing:border-box;';
        const clone = source.cloneNode(true);
        clone.style.cssText = 'display:block!important;position:relative!important;visibility:visible!important;opacity:1!important;max-height:none!important;transform:none!important;';
        clone.querySelectorAll('*').forEach((node) => {
          node.hidden = false;
          node.style.visibility = 'visible';
          node.style.opacity = '1';
          node.style.maxHeight = 'none';
          node.style.transform = 'none';
        });
        const children = clone.querySelector('.special-feature-prologue-children');
        if (children) children.style.cssText += ';display:grid!important;position:relative!important;width:100%!important;height:auto!important;overflow:visible!important;';
        snapshot.append(clone);
        document.body.append(snapshot);
      });
      await page.locator('[data-qa-chapter-two-menu-snapshot]').screenshot({
        path: `${output}/${language}-${viewportName}-chapter-two-menu.png`,
        animations: 'disabled',
        caret: 'hide'
      });

'''

text = text[:start] + replacement + text[end:]
text = text.replace(
    'menuInteraction: result.menu.expanded && result.menu.visible,',
    "menuInteraction: result.menu.expanded && result.menu.linkCount === 6 && result.menu.childId === 'specialFeatureChapterTwoZh',",
)
if 'targetHtml.includes(site.title)' not in text:
    raise SystemExit('The target-title assertion is not fixed')
if 'result.menu.visible' in text:
    raise SystemExit('A stale hidden-menu visibility assertion remains')
if text.count('data-qa-chapter-two-menu-snapshot') < 2:
    raise SystemExit('Menu snapshot patch is incomplete')
path.write_text(text, encoding='utf-8')
print('Patched the Chapter 2 verifier for a stable nested-menu snapshot.')
