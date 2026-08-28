import { chromium } from 'playwright-core';
import fs from 'node:fs';

const outputDirectory = 'browser-validation/artifacts';
fs.mkdirSync(outputDirectory, { recursive: true });

const sites = {
  'zh-Hant': 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/',
  'zh-Hans': 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/'
};
const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 }
};
const requiredIds = [
  'evidence-atlas',
  'witness-conflicts',
  'blood-boundary',
  'restraint-boundary',
  'responsibility-orbit',
  'dentalDutyTitle'
];
const deepLinkIds = [
  'evidence-atlas',
  'witness-conflicts',
  'blood-boundary',
  'restraint-boundary',
  'responsibility-orbit'
];

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const results = [];

const elementState = async (page, selector) => page.locator(selector).evaluate((element) => {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    className: element.className,
    opacity: Number(style.opacity),
    visibility: style.visibility,
    display: style.display,
    transform: style.transform,
    contentVisibility: style.contentVisibility,
    top: Math.round(rect.top),
    bottom: Math.round(rect.bottom),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    inViewport: rect.top < innerHeight && rect.bottom > 0
  };
});

const waitForStableHashTarget = async (page, id) => {
  await page.waitForFunction((targetId) => {
    const element = document.getElementById(targetId);
    if (!element || location.hash !== `#${targetId}`) return false;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return Number(style.opacity) >= 0.99
      && style.visibility !== 'hidden'
      && style.display !== 'none'
      && rect.top < innerHeight
      && rect.bottom > 0;
  }, id, { timeout: 8000 });
  await page.waitForTimeout(350);
  return elementState(page, `#${id}`);
};

for (const [language, baseUrl] of Object.entries(sites)) {
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({
      viewport,
      locale: language === 'zh-Hant' ? 'zh-TW' : 'zh-CN',
      colorScheme: 'light'
    });
    const page = await context.newPage();
    const result = {
      language,
      viewport: viewportName,
      viewportSize: viewport,
      httpStatus: null,
      finalUrl: '',
      title: '',
      css: [],
      scripts: [],
      ids: {},
      textChecks: {},
      overflowPixels: null,
      menuNavigation: null,
      directLinks: {},
      reload: null,
      consoleErrors: [],
      pageErrors: [],
      failedRequests: [],
      badResponses: [],
      fatal: []
    };
    results.push(result);

    page.on('console', (message) => {
      if (message.type() === 'error') result.consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => result.pageErrors.push(String(error)));
    page.on('requestfailed', (request) => {
      result.failedRequests.push({
        url: request.url(),
        resourceType: request.resourceType(),
        error: request.failure()?.errorText || 'unknown'
      });
    });
    page.on('response', (response) => {
      if (response.status() >= 400) {
        result.badResponses.push({
          url: response.url(),
          status: response.status(),
          resourceType: response.request().resourceType()
        });
      }
    });

    try {
      const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(1400);
      result.httpStatus = response?.status() ?? null;
      result.finalUrl = page.url();
      result.title = await page.title();
      result.css = await page.locator('link[rel="stylesheet"]').evaluateAll((elements) => elements.map((element) => element.href));
      result.scripts = await page.locator('script[src]').evaluateAll((elements) => elements.map((element) => element.src));
      for (const id of requiredIds) result.ids[id] = await page.locator(`#${id}`).count();
      result.textChecks = {
        atlasTitle: await page.getByText(language === 'zh-Hant'
          ? '她在法庭上怎麼說？證據又怎麼回答？'
          : '她在法庭上怎么说？证据又怎么回答？', { exact: true }).count(),
        bloodTitle: await page.getByText(language === 'zh-Hant'
          ? '血跡證明空間，不直接證明單一行為人'
          : '血迹证明空间，不直接证明单一行为人', { exact: true }).count(),
        dateTriplet: await page.getByText(/2023\.09\.22.*09\.25.*09\.26/).count()
      };
      result.overflowPixels = await page.evaluate(() => (
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
      ));
      await page.screenshot({ path: `${outputDirectory}/${language}_${viewportName}_initial.png`, fullPage: false });

      // Follow the same path a reader follows: open Chapter menu, expand Evidence, click Evidence Atlas.
      await page.locator('#menuButton').click();
      const evidenceGroup = page.locator('.nav-group').filter({ has: page.locator('a[href="#evidence-atlas"]') });
      await evidenceGroup.evaluate((element) => { element.open = true; });
      const menuLink = page.locator('#siteNav a[href="#evidence-atlas"]');
      const linkVisible = await menuLink.isVisible();
      await menuLink.click({ timeout: 10000 });
      const menuState = await waitForStableHashTarget(page, 'evidence-atlas');
      result.menuNavigation = {
        linkVisible,
        hash: await page.evaluate(() => location.hash),
        menuExpanded: await page.locator('#menuButton').getAttribute('aria-expanded'),
        state: menuState
      };
      await page.screenshot({ path: `${outputDirectory}/${language}_${viewportName}_menu-evidence-atlas.png`, fullPage: false });

      // Load every new section directly. This catches content-visibility layout shifts.
      for (const id of deepLinkIds) {
        const directResponse = await page.goto(`${baseUrl}#${id}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForLoadState('networkidle', { timeout: 16000 }).catch(() => {});
        const state = await waitForStableHashTarget(page, id);
        result.directLinks[id] = {
          status: directResponse?.status() ?? null,
          hash: await page.evaluate(() => location.hash),
          state
        };
        await page.screenshot({ path: `${outputDirectory}/${language}_${viewportName}_${id}.png`, fullPage: false });
      }

      // Reload the longest first section while retaining the hash.
      await page.goto(`${baseUrl}#evidence-atlas`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await waitForStableHashTarget(page, 'evidence-atlas');
      const reloadResponse = await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForLoadState('networkidle', { timeout: 16000 }).catch(() => {});
      const reloadState = await waitForStableHashTarget(page, 'evidence-atlas');
      result.reload = {
        status: reloadResponse?.status() ?? null,
        hash: await page.evaluate(() => location.hash),
        state: reloadState
      };
      await page.screenshot({ path: `${outputDirectory}/${language}_${viewportName}_reload-evidence-atlas.png`, fullPage: false });

      if (result.httpStatus !== 200) result.fatal.push(`HTTP ${result.httpStatus}`);
      if (result.overflowPixels > 4) result.fatal.push(`horizontal overflow ${result.overflowPixels}px`);
      for (const [id, count] of Object.entries(result.ids)) {
        if (count !== 1) result.fatal.push(`#${id} count ${count}`);
      }
      for (const [name, count] of Object.entries(result.textChecks)) {
        if (count < 1) result.fatal.push(`${name} missing`);
      }
      if (!result.scripts.some((url) => url.includes('final-chapter.js?v=20260829-6'))) {
        result.fatal.push('new hash-stability JavaScript cache key missing');
      }
      if (!result.menuNavigation.linkVisible
        || result.menuNavigation.hash !== '#evidence-atlas'
        || !result.menuNavigation.state.inViewport
        || result.menuNavigation.state.opacity < 0.99) {
        result.fatal.push(`menu navigation failed: ${JSON.stringify(result.menuNavigation)}`);
      }
      for (const [id, direct] of Object.entries(result.directLinks)) {
        if (direct.status !== 200
          || direct.hash !== `#${id}`
          || !direct.state.inViewport
          || direct.state.opacity < 0.99) {
          result.fatal.push(`${id} direct link failed: ${JSON.stringify(direct)}`);
        }
      }
      if (result.reload.status !== 200
        || result.reload.hash !== '#evidence-atlas'
        || !result.reload.state.inViewport
        || result.reload.state.opacity < 0.99) {
        result.fatal.push(`reload failed: ${JSON.stringify(result.reload)}`);
      }
      if (result.pageErrors.length) result.fatal.push(`${result.pageErrors.length} page error(s)`);
    } catch (error) {
      result.fatal.push(`test exception: ${error?.message || error}`);
      result.exception = String(error?.stack || error);
      await page.screenshot({ path: `${outputDirectory}/${language}_${viewportName}_exception.png`, fullPage: false }).catch(() => {});
    } finally {
      await context.close();
    }
  }
}

await browser.close();

const report = {
  generatedAt: new Date().toISOString(),
  chromeExecutable: '/usr/bin/google-chrome',
  results
};
fs.writeFileSync(`${outputDirectory}/report.json`, JSON.stringify(report, null, 2));

const summary = ['# Kaikai final live-browser validation', ''];
for (const result of results) {
  summary.push(`## ${result.language} · ${result.viewport} (${result.viewportSize.width}×${result.viewportSize.height})`);
  summary.push(`- HTTP: ${result.httpStatus}`);
  summary.push(`- Horizontal overflow: ${result.overflowPixels}px`);
  summary.push(`- Required IDs: ${Object.values(result.ids).every((count) => count === 1) ? 'PASS' : 'FAIL'}`);
  summary.push(`- Menu → evidence atlas: ${result.menuNavigation?.state?.inViewport ? 'PASS' : 'FAIL'} (top ${result.menuNavigation?.state?.top ?? 'n/a'})`);
  for (const id of deepLinkIds) {
    const direct = result.directLinks[id];
    summary.push(`- Direct #${id}: ${direct?.state?.inViewport ? 'PASS' : 'FAIL'} (top ${direct?.state?.top ?? 'n/a'})`);
  }
  summary.push(`- Reload #evidence-atlas: ${result.reload?.state?.inViewport ? 'PASS' : 'FAIL'} (top ${result.reload?.state?.top ?? 'n/a'})`);
  summary.push(`- Page errors: ${result.pageErrors.length}; console errors: ${result.consoleErrors.length}; failed requests: ${result.failedRequests.length}; HTTP ≥400: ${result.badResponses.length}`);
  summary.push(`- Fatal checks: ${result.fatal.length ? result.fatal.join(' | ') : 'none'}`);
  summary.push('');
}
const fatalCount = results.reduce((total, result) => total + result.fatal.length, 0);
summary.push(`**Total fatal checks: ${fatalCount}**`);
fs.writeFileSync(`${outputDirectory}/summary.md`, summary.join('\n'));
console.log(summary.join('\n'));

if (fatalCount) process.exit(1);
