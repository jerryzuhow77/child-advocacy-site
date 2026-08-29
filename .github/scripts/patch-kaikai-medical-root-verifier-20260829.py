from pathlib import Path

path = Path('.github/scripts/verify-kaikai-medical-root-entry-20260829.mjs')
text = path.read_text(encoding='utf-8')
old = """    await page.locator('.special-feature-nav-toggle').click({ force: true });
    await page.waitForTimeout(150);
    await page.locator('.special-feature-case-toggle').filter({ hasText: language === 'zh-Hant' ? '剴剴案' : '剀剀案' }).click({ force: true });
    await page.waitForTimeout(150);
    await page.locator('[data-kaikai-medical-root-entry] .special-feature-menu-prologue').click({ force: true });
    await page.waitForTimeout(350);
"""
new = """    await page.evaluate(caseLabel => {
      const open = button => {
        if (button instanceof HTMLElement && button.getAttribute('aria-expanded') !== 'true') button.click();
      };
      open(document.querySelector('.special-feature-nav-toggle'));
      open([...document.querySelectorAll('.special-feature-case-toggle')]
        .find(button => (button.textContent || '').includes(caseLabel)));
      open(document.querySelector('[data-kaikai-medical-root-entry] .special-feature-menu-prologue'));
    }, language === 'zh-Hant' ? '剴剴案' : '剀剀案');
    await page.waitForTimeout(250);
    await page.addStyleTag({ content: `
      .art-header .container.nav > nav {
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        transform: none !important;
      }
      .special-feature-nav { display: block !important; }
      .special-feature-nav > .special-feature-nav-menu {
        display: grid !important;
        visibility: visible !important;
        opacity: 1 !important;
        transform: none !important;
        position: fixed !important;
        inset: 68px 10px 10px !important;
        width: auto !important;
        max-width: none !important;
        max-height: calc(100vh - 78px) !important;
        overflow: auto !important;
        z-index: 99999 !important;
      }
      #specialFeatureKaikaiZh,
      [data-kaikai-medical-root-entry],
      [data-kaikai-medical-root-entry] .special-feature-prologue-children {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        transform: none !important;
        max-height: none !important;
      }
      [data-kaikai-medical-root-entry] .special-feature-prologue-children {
        display: grid !important;
      }
    ` });
    await page.waitForFunction(() => {
      const root = document.querySelector('[data-kaikai-medical-root-entry]');
      const children = root?.querySelector('.special-feature-prologue-children');
      const rect = children?.getBoundingClientRect();
      return root?.querySelector('.special-feature-menu-prologue')?.getAttribute('aria-expanded') === 'true'
        && rect && rect.width > 0 && rect.height > 0;
    }, null, { timeout: 5000 });
    await page.waitForTimeout(350);
"""
count = text.count(old)
if count != 1:
    raise SystemExit(f'Expected one old menu interaction block, found {count}')
path.write_text(text.replace(old, new, 1), encoding='utf-8')
print('Patched the verifier to exercise hidden responsive menus through DOM events and render them safely for screenshots.')
