import { chromium } from 'playwright-core';
import fs from 'node:fs';

const output = 'browser-validation/reader-optimizations';
fs.mkdirSync(output, { recursive: true });
const sites = {
  'zh-Hant': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/',
    guidedLabel: '15分鐘', routeQuick: '5分鐘｜只看法院與監察院認定', routeGuided: '15分鐘｜看人物、機構與醫療警訊', routeFull: '完整閱讀｜展開全部卷證導讀', takeaway: '一句結論', loop: '醫療警訊閉環圖', collapse: '收合配樂控制器', expand: '展開配樂控制器'
  },
  'zh-Hans': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    guidedLabel: '15分钟', routeQuick: '5分钟｜只看法院与监察院认定', routeGuided: '15分钟｜看人物、机构与医疗警讯', routeFull: '完整阅读｜展开全部卷证导读', takeaway: '一句结论', loop: '医疗警讯闭环图', collapse: '收合配乐控制器', expand: '展开配乐控制器'
  }
};
const viewports = { desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } };
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required'] });
const results = [];
let failed = false;

async function waitForDepth(page, depth) {
  await page.waitForFunction(expected => document.body.dataset.readingDepth === expected, depth, { timeout: 5000 });
  await page.waitForTimeout(250);
}
async function waitForHash(page, id) {
  await page.waitForFunction(targetId => {
    const target = document.getElementById(targetId);
    if (!target || location.hash !== `#${targetId}`) return false;
    const rect = target.getBoundingClientRect();
    return rect.top < innerHeight && rect.bottom > 0;
  }, id, { timeout: 12000 });
  await page.waitForTimeout(400);
}

for (const [language, site] of Object.entries(sites)) {
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({ viewport, locale: language === 'zh-Hant' ? 'zh-TW' : 'zh-CN', colorScheme: 'light', reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const pageErrors = [];
    const sameOriginErrors = [];
    const failedRequests = [];
    page.on('pageerror', error => pageErrors.push(String(error)));
    page.on('response', response => {
      const parsed = new URL(response.url());
      if (parsed.hostname === 'jerryzuhow77.github.io' && response.status() >= 400) sameOriginErrors.push({ url: response.url(), status: response.status() });
    });
    page.on('requestfailed', request => failedRequests.push({ url: request.url(), type: request.resourceType(), error: request.failure()?.errorText || '' }));
    const result = { language, viewport: viewportName, dimensions: viewport, checks: {}, states: {}, pageErrors, sameOriginErrors, failedRequests, passed: false };
    results.push(result);

    try {
      const response = await page.goto(`${site.url}?qa=${Date.now()}-${language}-${viewportName}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForSelector('[data-audio-controller]', { state: 'visible', timeout: 15000 });
      await page.waitForSelector('#chapter-brief', { state: 'visible', timeout: 15000 });
      await page.waitForTimeout(650);
      result.states.assets = await page.evaluate(() => ({
        css: document.querySelector('link[href*="final-chapter.css"]')?.href || '',
        js: document.querySelector('script[src*="final-chapter.js"]')?.src || '',
        heavyCount: document.querySelectorAll('main section[data-heavy="true"]').length,
        lazyPuppetBefore: document.querySelector('[data-puppet-theatre]')?.dataset.runtimeReady || '',
        routeCount: document.querySelectorAll('[data-reading-route]').length,
        collapseCount: document.querySelectorAll('[data-audio-collapse]').length,
        overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
      }));
      result.states.routes = await page.locator('#chapter-brief').evaluate((section, expected) => {
        const text = section.textContent || '';
        return { quick: text.includes(expected.routeQuick), guided: text.includes(expected.routeGuided), full: text.includes(expected.routeFull), labels: [...document.querySelectorAll('[data-reading-depth] b')].map(node => (node.textContent || '').trim()) };
      }, site);

      await page.locator('[data-reading-depth="quick"]').click();
      await waitForDepth(page, 'quick');
      result.states.quick = await page.evaluate(() => ({ puppetHidden: document.getElementById('puppet-theatre')?.hidden === true, dentalVisible: document.getElementById('dental-warning')?.hidden === false, medicalVisible: document.getElementById('medical-network-omissions')?.hidden === false, tenDaysHidden: document.getElementById('ten-days')?.hidden === true }));
      await page.locator('[data-reading-depth="guided"]').click();
      await waitForDepth(page, 'guided');
      result.states.guided = await page.evaluate(() => ({ puppetVisible: document.getElementById('puppet-theatre')?.hidden === false, dentalVisible: document.getElementById('dental-warning')?.hidden === false, tenDaysHidden: document.getElementById('ten-days')?.hidden === true, guidedLabel: [...document.querySelectorAll('[data-reading-depth="guided"] b')].some(node => (node.textContent || '').trim().includes('15')) }));
      await page.locator('[data-reading-depth="full"]').click();
      await waitForDepth(page, 'full');
      result.states.full = await page.evaluate(() => {
        const tenDays = document.getElementById('ten-days');
        return { tenDaysVisible: tenDays?.hidden === false, tenDaysHeavy: tenDays?.dataset.heavy === 'true', contentVisibility: tenDays ? getComputedStyle(tenDays).contentVisibility : '' };
      });
      await page.locator('[data-reading-depth="guided"]').click();
      await waitForDepth(page, 'guided');

      if (viewportName === 'mobile') {
        result.states.audioTop = await page.locator('[data-audio-controller]').evaluate(controller => ({ collapsed: controller.classList.contains('is-collapsed'), width: Math.round(controller.getBoundingClientRect().width), aria: controller.querySelector('[data-audio-collapse]')?.getAttribute('aria-label') || '', bottom: getComputedStyle(controller).bottom }));
        await page.evaluate(() => window.scrollTo(0, 1000));
        await page.waitForFunction(() => document.querySelector('[data-audio-controller]')?.classList.contains('is-collapsed'), null, { timeout: 5000 });
        await page.waitForTimeout(350);
        result.states.audioCollapsed = await page.locator('[data-audio-controller]').evaluate(controller => {
          const rect = controller.getBoundingClientRect();
          return { collapsed: controller.classList.contains('is-collapsed'), width: Math.round(rect.width), height: Math.round(rect.height), aria: controller.querySelector('[data-audio-collapse]')?.getAttribute('aria-label') || '', timeVisible: getComputedStyle(controller.querySelector('time')).display !== 'none', volumeVisible: getComputedStyle(controller.querySelector('label')).display !== 'none' };
        });
        await page.screenshot({ path: `${output}/${language}-${viewportName}-audio-collapsed.png`, fullPage: false });
        await page.locator('[data-audio-collapse]').click();
        await page.waitForFunction(() => !document.querySelector('[data-audio-controller]')?.classList.contains('is-collapsed'), null, { timeout: 5000 });
        await page.waitForTimeout(350);
        result.states.audioExpanded = await page.locator('[data-audio-controller]').evaluate(controller => ({ collapsed: controller.classList.contains('is-collapsed'), width: Math.round(controller.getBoundingClientRect().width), aria: controller.querySelector('[data-audio-collapse]')?.getAttribute('aria-label') || '', timeVisible: getComputedStyle(controller.querySelector('time')).display !== 'none', volumeVisible: getComputedStyle(controller.querySelector('label')).display !== 'none' }));
        await page.screenshot({ path: `${output}/${language}-${viewportName}-audio-expanded.png`, fullPage: false });
        await page.evaluate(() => { location.hash = '#medical-network-omissions'; });
        await page.waitForFunction(() => document.querySelector('[data-audio-controller]')?.classList.contains('is-collapsed'), null, { timeout: 5000 });
        result.states.audioAnchorCollapse = true;
      } else {
        result.states.audioDesktop = await page.locator('[data-audio-controller]').evaluate(controller => ({ collapseDisplay: getComputedStyle(controller.querySelector('[data-audio-collapse]')).display, width: Math.round(controller.getBoundingClientRect().width) }));
      }

      await page.goto(`${site.url}?qa=medical-${Date.now()}-${language}-${viewportName}#medical-network-omissions`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await waitForHash(page, 'medical-network-omissions');
      await page.locator('.evidence-source-drawer').evaluateAll(nodes => nodes.forEach(node => { node.open = true; }));
      await page.waitForTimeout(300);
      result.states.medical = await page.locator('#medical-network-omissions').evaluate((section, expected) => {
        const text = section.textContent || '';
        const cards = [...section.querySelectorAll('.medical-contact-card')];
        const drawers = [...section.querySelectorAll('.evidence-source-drawer')];
        const cardRects = cards.map(card => { const rect = card.getBoundingClientRect(); return { left: rect.left, right: rect.right, width: rect.width }; });
        return {
          loopHeading: text.includes(expected.loop), loopNodes: section.querySelectorAll('.medical-alert-loop li').length,
          takeawayCount: section.querySelectorAll('.medical-card-takeaway').length, takeawayCopy: text.includes(expected.takeaway),
          drawerCount: drawers.length, drawersOpen: drawers.every(node => node.open), drawerMetadataCount: section.querySelectorAll('.source-drawer-body dl').length, sourceLinkCount: section.querySelectorAll('.evidence-source-drawer a[href]').length,
          cardsInsideViewport: cardRects.every(rect => rect.left >= -1 && rect.right <= innerWidth + 1),
          overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth),
          cssContentVisibility: getComputedStyle(section).contentVisibility, dataHeavy: section.dataset.heavy === 'true', dataReadingLevel: section.dataset.readingLevel || ''
        };
      }, site);
      await page.locator('#medical-network-omissions').screenshot({ path: `${output}/${language}-${viewportName}-medical-closed-loop.png` });

      await page.goto(`${site.url}?qa=lazy-${Date.now()}-${language}-${viewportName}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForSelector('[data-puppet-theatre]', { state: 'attached', timeout: 15000 });
      await page.waitForTimeout(450);
      const lazyBefore = await page.locator('[data-puppet-theatre]').getAttribute('data-runtime-ready');
      await page.locator('#puppet-theatre').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('[data-puppet-theatre]')?.dataset.runtimeReady === 'true', null, { timeout: 7000 });
      result.states.lazyPuppet = { before: lazyBefore || '', after: await page.locator('[data-puppet-theatre]').getAttribute('data-runtime-ready') || '' };

      await page.locator('[data-reading-depth="full"]').click();
      await waitForDepth(page, 'full');
      await page.evaluate(() => { location.hash = '#ten-days'; });
      await waitForHash(page, 'ten-days');
      result.states.heavyDeepLink = await page.locator('#ten-days').evaluate(section => {
        const rect = section.getBoundingClientRect();
        return { hash: location.hash, inlineContentVisibility: section.style.contentVisibility, computedContentVisibility: getComputedStyle(section).contentVisibility, visible: rect.top < innerHeight && rect.bottom > 0, top: Math.round(rect.top), dataHeavy: section.dataset.heavy === 'true' };
      });

      const relevantFailures = failedRequests.filter(item => !(item.type === 'media' && item.error === 'net::ERR_ABORTED'));
      result.checks = {
        http200: response?.status() === 200,
        assetVersions: result.states.assets.css.includes('v=20260829-22') && result.states.assets.js.includes('v=20260829-9'),
        routeCardsPresent: result.states.assets.routeCount === 3 && result.states.routes.quick && result.states.routes.guided && result.states.routes.full && result.states.routes.labels.some(label => label === site.guidedLabel),
        quickModeWorks: result.states.quick.puppetHidden && result.states.quick.dentalVisible && result.states.quick.medicalVisible && result.states.quick.tenDaysHidden,
        guidedModeWorks: result.states.guided.puppetVisible && result.states.guided.dentalVisible && result.states.guided.tenDaysHidden && result.states.guided.guidedLabel,
        fullModeWorks: result.states.full.tenDaysVisible && result.states.full.tenDaysHeavy && ['auto', 'visible'].includes(result.states.full.contentVisibility),
        medicalClosedLoop: result.states.medical.loopHeading && result.states.medical.loopNodes === 7,
        medicalTakeaways: result.states.medical.takeawayCount === 3 && result.states.medical.takeawayCopy,
        sourceDrawers: result.states.medical.drawerCount === 4 && result.states.medical.drawersOpen && result.states.medical.drawerMetadataCount === 4 && result.states.medical.sourceLinkCount >= 8,
        medicalResponsive: result.states.medical.cardsInsideViewport && result.states.medical.overflow <= 2,
        medicalPerformanceHints: result.states.medical.dataHeavy && result.states.medical.dataReadingLevel === 'quick' && ['auto', 'visible'].includes(result.states.medical.cssContentVisibility),
        lazyPuppetRuntime: result.states.lazyPuppet.before !== 'true' && result.states.lazyPuppet.after === 'true',
        heavyDeepLinkWorks: result.states.heavyDeepLink.hash === '#ten-days' && result.states.heavyDeepLink.visible && result.states.heavyDeepLink.dataHeavy && result.states.heavyDeepLink.inlineContentVisibility === 'visible',
        audioControllerUnique: result.states.assets.collapseCount === 1,
        audioMobileCompact: viewportName !== 'mobile' || (!result.states.audioTop.collapsed && result.states.audioCollapsed.collapsed && result.states.audioCollapsed.width <= 70 && result.states.audioCollapsed.height <= 70 && !result.states.audioCollapsed.timeVisible && !result.states.audioCollapsed.volumeVisible && !result.states.audioExpanded.collapsed && result.states.audioExpanded.width >= 250 && result.states.audioExpanded.timeVisible && result.states.audioExpanded.volumeVisible && result.states.audioCollapsed.aria === site.expand && result.states.audioExpanded.aria === site.collapse && result.states.audioAnchorCollapse),
        audioDesktopUnchanged: viewportName !== 'desktop' || result.states.audioDesktop.collapseDisplay === 'none',
        heavySectionsMarked: result.states.assets.heavyCount >= 10,
        noInitialOverflow: result.states.assets.overflow <= 2,
        noPageErrors: pageErrors.length === 0,
        noSameOriginErrors: sameOriginErrors.length === 0,
        noRelevantRequestFailures: relevantFailures.length === 0
      };
      result.relevantFailures = relevantFailures;
      result.passed = Object.values(result.checks).every(Boolean);
      if (!result.passed) failed = true;
    } catch (error) {
      result.exception = String(error?.stack || error);
      failed = true;
      await page.screenshot({ path: `${output}/${language}-${viewportName}-exception.png`, fullPage: false }).catch(() => {});
    }
    await context.close();
  }
}

await browser.close();
fs.writeFileSync(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
const lines = ['# Kaikai reader optimizations browser verification', ''];
for (const result of results) {
  lines.push(`## ${result.language} · ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  lines.push(`- Reading routes: ${result.states.assets?.routeCount ?? 'n/a'}; quick=${result.checks.quickModeWorks}; guided=${result.checks.guidedModeWorks}; full=${result.checks.fullModeWorks}`);
  lines.push(`- Medical: loop=${result.states.medical?.loopNodes ?? 'n/a'}, takeaways=${result.states.medical?.takeawayCount ?? 'n/a'}, drawers=${result.states.medical?.drawerCount ?? 'n/a'}`);
  if (result.viewport === 'mobile') lines.push(`- Audio: collapsed=${result.states.audioCollapsed?.width ?? 'n/a'}×${result.states.audioCollapsed?.height ?? 'n/a'}, expanded width=${result.states.audioExpanded?.width ?? 'n/a'}`);
  lines.push(`- Lazy puppet: before=${result.states.lazyPuppet?.before ?? 'n/a'}, after=${result.states.lazyPuppet?.after ?? 'n/a'}`);
  lines.push(`- Errors: page=${result.pageErrors.length}, HTTP=${result.sameOriginErrors.length}, requests=${result.relevantFailures?.length ?? 'n/a'}`);
  const failedChecks = Object.entries(result.checks || {}).filter(([, value]) => !value).map(([key]) => key);
  lines.push(`- Failed checks: ${failedChecks.length ? failedChecks.join(', ') : 'none'}`);
  if (result.exception) lines.push(`- Exception: ${result.exception.split('\n')[0]}`);
  lines.push('');
}
fs.writeFileSync(`${output}/summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
