import { chromium } from 'playwright-core';
import fs from 'node:fs';

const output = 'browser-validation/out-of-home-care';
fs.mkdirSync(output, { recursive: true });

const sites = {
  'zh-Hant': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/',
    title: '八個制度缺陷，會讓家外安置從保護措施變成新的風險場域',
    casesTitle: '安置不是安全保證：三起具體傷害事件與一組系統性性暴力證據',
    dutyTitle: '不是換一個地址，而是國家接手一條持續保護鏈',
    navPlacement: '家外安置制度',
    navCases: '實際傷害案例',
    changuang: '花蓮｜禪光育幼院',
    returnCase: '2歲返家不到一年再遭嚴重虐待',
    specialNeeds: '特殊需求兒少安置於成人機構'
  },
  'zh-Hans': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    title: '八个制度缺陷，会让家外安置从保护措施变成新的风险场域',
    casesTitle: '安置不是安全保证：三起具体伤害事件与一组系统性性暴力证据',
    dutyTitle: '不是换一个地址，而是国家接手一条持续保护链',
    navPlacement: '家外安置制度',
    navCases: '实际伤害案例',
    changuang: '花莲｜禅光育幼院',
    returnCase: '2岁返家不到一年再遭严重虐待',
    specialNeeds: '特殊需求儿童安置于成人机构'
  }
};

const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 }
};

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

const results = [];
let failed = false;

async function waitForTarget(page, id) {
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
      failuresDeepLink: null,
      casesDeepLink: null,
      legacySystem: null,
      pageErrors,
      sameOriginErrors,
      requestFailures,
      passed: false
    };
    results.push(result);

    try {
      const response = await page.goto(`${site.url}?qa=${Date.now()}-${language}-${viewportName}#placement-spectrum`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await waitForTarget(page, 'placement-spectrum');
      await page.waitForSelector('#placement-failures', { state: 'attached', timeout: 15000 });
      await page.waitForSelector('#placement-harm-cases', { state: 'attached', timeout: 15000 });
      await page.waitForTimeout(700);

      result.state = await page.evaluate(async (expected) => {
        const placement = document.getElementById('placement-spectrum');
        const failures = document.getElementById('placement-failures');
        const cases = document.getElementById('placement-harm-cases');
        const text = placement?.textContent || '';
        const navLinks = [...document.querySelectorAll('#siteNav a[href]')];
        const sourceHrefs = [...(placement?.querySelectorAll('a[href]') || [])].map((link) => link.href);
        const failureCards = [...(failures?.querySelectorAll('.placement-failure-grid article') || [])];
        const harmCards = [...(cases?.querySelectorAll('.placement-harm-card') || [])];
        const dataCells = [...(cases?.querySelectorAll('.placement-data-grid div') || [])];
        const cssLink = document.querySelector('link[href*="final-chapter.css"]');
        let cssMarker = false;
        try {
          const cssText = await fetch(cssLink.href, { cache: 'no-store' }).then((response) => response.text());
          cssMarker = cssText.includes('OUT-OF-HOME-CARE-FAILURES-20260829');
        } catch (_) {}
        const cardRects = [...failureCards, ...harmCards].map((card) => {
          const rect = card.getBoundingClientRect();
          return { left: rect.left, right: rect.right, width: rect.width };
        });
        return {
          dutyTitle: text.includes(expected.dutyTitle),
          failureTitle: text.includes(expected.title),
          casesTitle: text.includes(expected.casesTitle),
          changuang: text.includes(expected.changuang),
          returnCase: text.includes(expected.returnCase),
          specialNeeds: text.includes(expected.specialNeeds),
          failureCount: failureCards.length,
          harmCount: harmCards.length,
          dataGroupCount: cases?.querySelectorAll('.placement-data-groups > article').length || 0,
          dataCellCount: dataCells.length,
          stateDutyListCount: placement?.querySelectorAll('.placement-state-duty li').length || 0,
          navPlacement: navLinks.some((link) => (link.textContent || '').trim() === expected.navPlacement && link.getAttribute('href') === '#placement-spectrum'),
          navCases: navLinks.some((link) => (link.textContent || '').trim() === expected.navCases && link.getAttribute('href') === '#placement-harm-cases'),
          reportSource: sourceHrefs.includes('https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497'),
          returnSource: sourceHrefs.includes('https://www.cy.gov.tw/News_Content.aspx?n=125&s=24201'),
          changuangSource: sourceHrefs.includes('https://www.cy.gov.tw/CyBsBoxContent.aspx?n=133&s=49298'),
          sexualViolenceSource: sourceHrefs.includes('https://nhrc.cy.gov.tw/News_Content.aspx?n=7460&s=2171&sms=12390'),
          specialNeedsSource: sourceHrefs.includes('https://www.cy.gov.tw/News_Content.aspx?n=213&s=32249'),
          mohwReviewSource: sourceHrefs.includes('https://www.mohw.gov.tw/cp-2704-78052-1.html'),
          mohwVisitSource: sourceHrefs.includes('https://www.mohw.gov.tw/cp-16-82575-1.html'),
          cssHref: cssLink?.href || '',
          cssMarker,
          failureColumns: failures ? getComputedStyle(failures.querySelector('.placement-failure-grid')).gridTemplateColumns : '',
          caseColumns: cases ? getComputedStyle(cases.querySelector('.placement-harm-case-grid')).gridTemplateColumns : '',
          cardsInsideViewport: cardRects.every((rect) => rect.left >= -1 && rect.right <= innerWidth + 1),
          overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
        };
      }, site);

      await page.locator('#placement-failures').screenshot({
        path: `${output}/${language}-${viewportName}-system-failures.png`,
        animations: 'disabled',
        caret: 'hide'
      });
      await page.locator('#placement-harm-cases').screenshot({
        path: `${output}/${language}-${viewportName}-harm-cases.png`,
        animations: 'disabled',
        caret: 'hide'
      });

      await page.goto(`${site.url}?qa=failures-${Date.now()}-${language}-${viewportName}#placement-failures`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      result.failuresDeepLink = await waitForTarget(page, 'placement-failures');
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
      result.failuresDeepLink.reload = await waitForTarget(page, 'placement-failures');

      await page.goto(`${site.url}?qa=cases-${Date.now()}-${language}-${viewportName}#placement-harm-cases`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      result.casesDeepLink = await waitForTarget(page, 'placement-harm-cases');
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
      result.casesDeepLink.reload = await waitForTarget(page, 'placement-harm-cases');

      await page.goto(`${site.url}?qa=legacy-${Date.now()}-${language}-${viewportName}#system`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      result.legacySystem = await waitForTarget(page, 'system');

      const desktopGrid = result.state.failureColumns.trim().split(/\s+/).length >= 4
        && result.state.caseColumns.trim().split(/\s+/).length >= 2;
      const mobileGrid = result.state.failureColumns.trim().split(/\s+/).length === 1
        && result.state.caseColumns.trim().split(/\s+/).length === 1;

      result.checks = {
        http200: response?.status() === 200,
        localizedHeadings: result.state.dutyTitle && result.state.failureTitle && result.state.casesTitle,
        actualCasesPresent: result.state.changuang && result.state.returnCase && result.state.specialNeeds,
        expectedStructure: result.state.stateDutyListCount === 6
          && result.state.failureCount === 8
          && result.state.harmCount === 4
          && result.state.dataGroupCount === 2
          && result.state.dataCellCount === 8,
        navigationUpdated: result.state.navPlacement && result.state.navCases,
        officialSourcesPresent: result.state.reportSource
          && result.state.returnSource
          && result.state.changuangSource
          && result.state.sexualViolenceSource
          && result.state.specialNeedsSource
          && result.state.mohwReviewSource
          && result.state.mohwVisitSource,
        cssDeployed: result.state.cssHref.includes('final-chapter.css?v=20260829-') && result.state.cssMarker,
        responsiveGrid: viewportName === 'desktop' ? desktopGrid : mobileGrid,
        cardsInsideViewport: result.state.cardsInsideViewport,
        noHorizontalOverflow: result.state.overflow <= 2
          && result.failuresDeepLink.overflow <= 2
          && result.casesDeepLink.overflow <= 2
          && result.legacySystem.overflow <= 2,
        failuresDeepLink: result.failuresDeepLink.hash === '#placement-failures'
          && result.failuresDeepLink.visible
          && result.failuresDeepLink.reload.hash === '#placement-failures'
          && result.failuresDeepLink.reload.visible,
        casesDeepLink: result.casesDeepLink.hash === '#placement-harm-cases'
          && result.casesDeepLink.visible
          && result.casesDeepLink.reload.hash === '#placement-harm-cases'
          && result.casesDeepLink.reload.visible,
        legacySystemStillWorks: result.legacySystem.hash === '#system' && result.legacySystem.visible,
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

const lines = ['# Kaikai out-of-home care expansion browser verification', ''];
for (const result of results) {
  lines.push(`## ${result.language} · ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  lines.push(`- Structure: duty=${result.state?.stateDutyListCount ?? 'n/a'}, failures=${result.state?.failureCount ?? 'n/a'}, cases=${result.state?.harmCount ?? 'n/a'}, data=${result.state?.dataCellCount ?? 'n/a'}`);
  lines.push(`- Grid: failures=${result.state?.failureColumns ?? 'n/a'}; cases=${result.state?.caseColumns ?? 'n/a'}`);
  lines.push(`- Deep links: failures=${result.failuresDeepLink?.top ?? 'n/a'}, cases=${result.casesDeepLink?.top ?? 'n/a'}, system=${result.legacySystem?.top ?? 'n/a'}`);
  lines.push(`- Overflow=${result.state?.overflow ?? 'n/a'}px; pageErrors=${result.pageErrors.length}; HTTP=${result.sameOriginErrors.length}; requests=${result.requestFailures.length}`);
  const failedChecks = Object.entries(result.checks || {}).filter(([, value]) => !value).map(([key]) => key);
  lines.push(`- Failed checks: ${failedChecks.length ? failedChecks.join(', ') : 'none'}`);
  if (result.exception) lines.push(`- Exception: ${result.exception.split('\n')[0]}`);
  lines.push('');
}
fs.writeFileSync(`${output}/summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
