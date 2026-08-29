import { chromium } from 'playwright-core';
import fs from 'node:fs';

const output = 'browser-validation/out-of-home-major-chapter';
fs.mkdirSync(output, { recursive: true });

const sites = {
  'zh-Hant': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/',
    majorSummary: '家外安置大篇章',
    majorTitle: '離開危險以後，誰持續保護孩子？',
    heroEntry: '家外安置大篇章',
    startLink: '開始閱讀完整專章',
    responsibilitySummary: '制度責任',
    navLabels: ['專章入口', '制度與法律路徑', '國家持續保護義務', '八項制度缺陷', '實際傷害案例', '官方數據板', '判讀界線'],
    dataLabel: '官方數據板',
    caseTitle: '安置不是安全保證：三起具體傷害事件與一組系統性性暴力證據'
  },
  'zh-Hans': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    majorSummary: '家外安置大篇章',
    majorTitle: '离开危险以后，谁持续保护孩子？',
    heroEntry: '家外安置大篇章',
    startLink: '开始阅读完整专章',
    responsibilitySummary: '制度責任',
    navLabels: ['专章入口', '制度与法律路径', '国家持续保护义务', '八项制度缺陷', '实际伤害案例', '官方数据板', '判读界线'],
    dataLabel: '官方数据板',
    caseTitle: '安置不是安全保证：三起具体伤害事件与一组系统性性暴力证据'
  }
};

const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 }
};

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required']
});

const results = [];
let failed = false;

async function dismissPrologue(page) {
  const skip = page.locator('[data-prologue-skip]');
  if (await skip.count()) {
    try {
      if (await skip.isVisible({ timeout: 2500 })) {
        await skip.click({ timeout: 5000 });
        await page.waitForFunction(() => {
          const overlay = document.querySelector('[data-entry-prologue]');
          return !overlay || overlay.hidden || getComputedStyle(overlay).display === 'none';
        }, null, { timeout: 7000 });
      }
    } catch (_) {
      await page.evaluate(() => {
        const overlay = document.querySelector('[data-entry-prologue]');
        if (overlay) overlay.hidden = true;
        document.body.classList.remove('prologue-active');
      });
    }
  }
}

async function waitForHash(page, id) {
  await page.waitForSelector(`#${id}`, { state: 'visible', timeout: 20000 });
  await page.waitForFunction((targetId) => location.hash === `#${targetId}`, id, { timeout: 12000 });
  await page.waitForFunction((targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return false;
    const rect = target.getBoundingClientRect();
    const style = getComputedStyle(target);
    return style.display !== 'none'
      && style.visibility !== 'hidden'
      && rect.top < innerHeight
      && rect.bottom > 0;
  }, id, { timeout: 20000 });
  await page.waitForTimeout(500);
  return page.locator(`#${id}`).evaluate((target) => {
    const rect = target.getBoundingClientRect();
    return {
      hash: location.hash,
      top: Math.round(rect.top),
      bottom: Math.round(rect.bottom),
      visible: rect.top < innerHeight && rect.bottom > 0,
      rendered: getComputedStyle(target).display !== 'none' && getComputedStyle(target).visibility !== 'hidden',
      overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
    };
  });
}

for (const [language, site] of Object.entries(sites)) {
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({
      viewport,
      locale: language === 'zh-Hant' ? 'zh-TW' : 'zh-CN',
      colorScheme: 'light',
      reducedMotion: 'no-preference'
    });
    const page = await context.newPage();
    const pageErrors = [];
    const sameOriginErrors = [];
    const requestFailures = [];

    page.on('pageerror', (error) => pageErrors.push(String(error)));
    page.on('response', (response) => {
      const parsed = new URL(response.url());
      if (parsed.hostname === 'jerryzuhow77.github.io' && response.status() >= 400) {
        sameOriginErrors.push({ url: response.url(), status: response.status() });
      }
    });
    page.on('requestfailed', (request) => {
      const parsed = new URL(request.url());
      const type = request.resourceType();
      const error = request.failure()?.errorText || '';
      const expectedMediaAbort = type === 'media' && error === 'net::ERR_ABORTED';
      if (parsed.hostname === 'jerryzuhow77.github.io' && !expectedMediaAbort) {
        requestFailures.push({ url: request.url(), type, error });
      }
    });

    const result = {
      language,
      viewport: viewportName,
      dimensions: viewport,
      checks: {},
      state: null,
      menu: null,
      deepLinks: {},
      pageErrors,
      sameOriginErrors,
      requestFailures,
      passed: false
    };
    results.push(result);

    try {
      const response = await page.goto(`${site.url}?qa=${Date.now()}-${language}-${viewportName}#out-of-home-chapter`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await dismissPrologue(page);
      result.deepLinks.major = await waitForHash(page, 'out-of-home-chapter');
      await page.waitForSelector('#placement-spectrum', { state: 'attached', timeout: 15000 });
      await page.waitForTimeout(700);

      result.state = await page.evaluate(async (expected) => {
        const major = document.getElementById('out-of-home-chapter');
        const placement = document.getElementById('placement-spectrum');
        const majorText = major?.textContent || '';
        const placementText = placement?.textContent || '';
        const heroEntry = [...document.querySelectorAll('.hero-actions a[href]')]
          .find((link) => (link.textContent || '').trim() === expected.heroEntry);
        const cssLink = document.querySelector('link[href*="final-chapter.css"]');
        let cssMarker = false;
        try {
          const cssText = await fetch(cssLink.href, { cache: 'no-store' }).then((res) => res.text());
          cssMarker = cssText.includes('OUT-OF-HOME-MAJOR-CHAPTER-20260829');
        } catch (_) {}
        const stats = [...(major?.querySelectorAll('.out-of-home-major-stats span') || [])];
        const links = [...(major?.querySelectorAll('.out-of-home-major-links a') || [])];
        const inner = major?.querySelector('.out-of-home-major-inner');
        const statsGrid = major?.querySelector('.out-of-home-major-stats');
        const linksGrid = major?.querySelector('.out-of-home-major-links');
        const majorRect = major?.getBoundingClientRect();
        return {
          titlePresent: majorText.includes(expected.majorTitle),
          startLinkPresent: links.some((link) => (link.textContent || '').trim() === expected.startLink && link.getAttribute('href') === '#placement-spectrum'),
          majorCount: document.querySelectorAll('#out-of-home-chapter').length,
          placementCount: document.querySelectorAll('#placement-spectrum').length,
          stateDutyCount: document.querySelectorAll('#placement-state-duty').length,
          failuresCount: document.querySelectorAll('#placement-failures').length,
          casesCount: document.querySelectorAll('#placement-harm-cases').length,
          dataPanelCount: document.querySelectorAll('#placement-data-panel').length,
          boundaryCount: document.querySelectorAll('#placement-boundary').length,
          statsCount: stats.length,
          statValues: stats.map((item) => item.querySelector('b')?.textContent?.trim() || ''),
          linkCount: links.length,
          caseTitle: placementText.includes(expected.caseTitle),
          failureCards: placement?.querySelectorAll('.placement-failure-grid article').length || 0,
          harmCards: placement?.querySelectorAll('.placement-harm-card').length || 0,
          dataCells: placement?.querySelectorAll('.placement-data-grid div').length || 0,
          heroEntry: Boolean(heroEntry),
          heroHref: heroEntry?.getAttribute('href') || '',
          readingLevel: major?.dataset.readingLevel || '',
          innerColumns: inner ? getComputedStyle(inner).gridTemplateColumns : '',
          statsColumns: statsGrid ? getComputedStyle(statsGrid).gridTemplateColumns : '',
          linksDisplay: linksGrid ? getComputedStyle(linksGrid).display : '',
          majorVisible: Boolean(majorRect && majorRect.top < innerHeight && majorRect.bottom > 0),
          cssHref: cssLink?.href || '',
          cssMarker,
          overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
        };
      }, site);

      const menuButton = page.locator('#menuButton');
      if (await menuButton.isVisible()) await menuButton.click();
      await page.waitForFunction(() => {
        const nav = document.getElementById('siteNav');
        return nav && getComputedStyle(nav).display !== 'none';
      }, null, { timeout: 5000 });

      const group = page.locator('#siteNav .nav-group-major');
      await group.waitFor({ state: 'visible', timeout: 10000 });
      const summary = group.locator('summary');
      if (!(await group.getAttribute('open'))) await summary.click();
      await page.waitForFunction(() => document.querySelector('#siteNav .nav-group-major')?.hasAttribute('open'), null, { timeout: 5000 });

      result.menu = await page.evaluate((expected) => {
        const groups = [...document.querySelectorAll('#siteNav .nav-group')];
        const major = groups.find((item) => (item.querySelector('summary')?.textContent || '').trim().endsWith(expected.majorSummary));
        const responsibility = groups.find((item) => (item.querySelector('summary')?.textContent || '').trim() === expected.responsibilitySummary);
        const majorLinks = [...(major?.querySelectorAll('a[href]') || [])];
        const responsibilityHrefs = [...(responsibility?.querySelectorAll('a[href]') || [])].map((link) => link.getAttribute('href'));
        const labels = majorLinks.map((link) => (link.textContent || '').trim());
        const hrefs = majorLinks.map((link) => link.getAttribute('href'));
        return {
          groupCount: document.querySelectorAll('#siteNav .nav-group-major').length,
          summary: (major?.querySelector('summary')?.textContent || '').trim(),
          open: major?.hasAttribute('open') || false,
          linkCount: majorLinks.length,
          labels,
          hrefs,
          allExpectedLabels: expected.navLabels.every((label) => labels.includes(label)),
          oldPlacementLinksRemoved: !responsibilityHrefs.includes('#placement-spectrum') && !responsibilityHrefs.includes('#placement-harm-cases'),
          navOverflow: Math.max(0, (document.getElementById('siteNav')?.scrollWidth || 0) - (document.getElementById('siteNav')?.clientWidth || 0))
        };
      }, site);

      await page.locator('#out-of-home-chapter').screenshot({
        path: `${output}/${language}-${viewportName}-major-chapter.png`,
        animations: 'disabled',
        caret: 'hide'
      });
      await group.screenshot({
        path: `${output}/${language}-${viewportName}-major-menu.png`,
        animations: 'disabled',
        caret: 'hide'
      });

      for (const id of ['placement-failures', 'placement-harm-cases', 'placement-data-panel', 'placement-boundary']) {
        await page.goto(`${site.url}?qa=${id}-${Date.now()}-${language}-${viewportName}#${id}`, {
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });
        await dismissPrologue(page);
        const first = await waitForHash(page, id);
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
        await dismissPrologue(page);
        const reload = await waitForHash(page, id);
        result.deepLinks[id] = { first, reload };
      }

      await page.locator('#placement-harm-cases').screenshot({
        path: `${output}/${language}-${viewportName}-harm-cases.png`,
        animations: 'disabled',
        caret: 'hide'
      });

      const desktopLayout = result.state.innerColumns.trim().split(/\s+/).length >= 2
        && result.state.statsColumns.trim().split(/\s+/).length === 4;
      const mobileLayout = result.state.innerColumns.trim().split(/\s+/).length === 1
        && result.state.statsColumns.trim().split(/\s+/).length === 2;
      const deepLinksPass = ['placement-failures', 'placement-harm-cases', 'placement-data-panel', 'placement-boundary']
        .every((id) => result.deepLinks[id]?.first?.hash === `#${id}`
          && result.deepLinks[id]?.first?.visible
          && result.deepLinks[id]?.reload?.hash === `#${id}`
          && result.deepLinks[id]?.reload?.visible
          && result.deepLinks[id]?.first?.overflow <= 2
          && result.deepLinks[id]?.reload?.overflow <= 2);

      result.checks = {
        http200: response?.status() === 200,
        localizedMajorChapter: result.state.titlePresent && result.state.startLinkPresent,
        uniqueStructure: result.state.majorCount === 1
          && result.state.placementCount === 1
          && result.state.stateDutyCount === 1
          && result.state.failuresCount === 1
          && result.state.casesCount === 1
          && result.state.dataPanelCount === 1
          && result.state.boundaryCount === 1,
        chapterScaleCorrect: result.state.statsCount === 4
          && result.state.statValues.join(',') === '6,8,4,8'
          && result.state.linkCount === 4
          && result.state.failureCards === 8
          && result.state.harmCards === 4
          && result.state.dataCells === 8,
        existingContentPreserved: result.state.caseTitle,
        heroEntryPresent: result.state.heroEntry && result.state.heroHref === '#out-of-home-chapter',
        alwaysVisibleGateway: result.state.readingLevel === 'quick' && result.state.majorVisible,
        majorNavigation: result.menu.groupCount === 1
          && result.menu.open
          && result.menu.linkCount === 7
          && result.menu.allExpectedLabels
          && result.menu.oldPlacementLinksRemoved,
        cssDeployed: result.state.cssHref.includes('final-chapter.css?v=20260829-') && result.state.cssMarker,
        responsiveMajorLayout: viewportName === 'desktop' ? desktopLayout : mobileLayout,
        noHorizontalOverflow: result.state.overflow <= 2 && result.menu.navOverflow <= 2,
        majorDeepLink: result.deepLinks.major.hash === '#out-of-home-chapter' && result.deepLinks.major.visible,
        subsectionDeepLinks: deepLinksPass,
        noPageErrors: pageErrors.length === 0,
        noSameOriginErrors: sameOriginErrors.length === 0,
        noRelevantRequestFailures: requestFailures.length === 0
      };
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

const lines = ['# Kaikai out-of-home care major chapter browser verification', ''];
for (const result of results) {
  lines.push(`## ${result.language} · ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  lines.push(`- Major chapter: stats=${result.state?.statsCount ?? 'n/a'}, links=${result.state?.linkCount ?? 'n/a'}, reading-level=${result.state?.readingLevel ?? 'n/a'}`);
  lines.push(`- Main menu: group=${result.menu?.groupCount ?? 'n/a'}, links=${result.menu?.linkCount ?? 'n/a'}, old-links-removed=${result.menu?.oldPlacementLinksRemoved ?? 'n/a'}`);
  lines.push(`- Existing content: failures=${result.state?.failureCards ?? 'n/a'}, cases=${result.state?.harmCards ?? 'n/a'}, data=${result.state?.dataCells ?? 'n/a'}`);
  lines.push(`- Layout: inner=${result.state?.innerColumns ?? 'n/a'}; stats=${result.state?.statsColumns ?? 'n/a'}`);
  lines.push(`- Errors: page=${result.pageErrors.length}; HTTP=${result.sameOriginErrors.length}; requests=${result.requestFailures.length}`);
  const failedChecks = Object.entries(result.checks || {}).filter(([, value]) => !value).map(([key]) => key);
  lines.push(`- Failed checks: ${failedChecks.length ? failedChecks.join(', ') : 'none'}`);
  if (result.exception) lines.push(`- Exception: ${result.exception.split('\n')[0]}`);
  lines.push('');
}
fs.writeFileSync(`${output}/summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
