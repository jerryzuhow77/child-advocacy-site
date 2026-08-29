import { chromium } from 'playwright-core';
import fs from 'node:fs';

const output = 'browser-validation/medical-omissions';
fs.mkdirSync(output, { recursive: true });

const sites = {
  'zh-Hant': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/',
    clinic: '興隆內科小兒科診所',
    boundary: '監察院公開調查報告沒有點名興隆內科小兒科診所',
    summary: '其他監察院認定或要求檢討的制度斷點',
    nav: '醫療漏接'
  },
  'zh-Hans': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    clinic: '兴隆内科小儿科诊所',
    boundary: '监察院公开调查报告没有点名兴隆内科小儿科诊所',
    summary: '其他监察院认定或要求检讨的制度断点',
    nav: '医疗漏接'
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

async function waitForAnchor(page, id) {
  await page.waitForSelector(`#${id}`, { state: 'visible', timeout: 15000 });
  await page.waitForFunction(targetId => {
    const target = document.getElementById(targetId);
    if (!target || location.hash !== `#${targetId}`) return false;
    const rect = target.getBoundingClientRect();
    return rect.top < innerHeight && rect.bottom > 0;
  }, id, { timeout: 12000 });
  await page.waitForTimeout(400);
  return page.locator(`#${id}`).evaluate(target => {
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
      colorScheme: 'light'
    });
    const page = await context.newPage();
    const pageErrors = [];
    const sameOriginErrors = [];
    page.on('pageerror', error => pageErrors.push(String(error)));
    page.on('response', response => {
      const parsed = new URL(response.url());
      if (parsed.hostname === 'jerryzuhow77.github.io' && response.status() >= 400) {
        sameOriginErrors.push({ url: response.url(), status: response.status() });
      }
    });

    const response = await page.goto(`${site.url}?qa=${Date.now()}-${language}-${viewportName}#medical-network-omissions`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    const anchor = await waitForAnchor(page, 'medical-network-omissions');
    await page.locator('.control-yuan-omissions').evaluate(element => { element.open = true; });
    await page.waitForTimeout(300);

    const state = await page.evaluate(({ clinic, boundary, summary, nav }) => {
      const section = document.getElementById('medical-network-omissions');
      const text = section.textContent || '';
      const cards = [...section.querySelectorAll('.medical-contact-card')];
      const omissions = [...section.querySelectorAll('.control-yuan-omission-grid article')];
      const details = section.querySelector('.control-yuan-omissions');
      const cardRects = cards.map(card => {
        const r = card.getBoundingClientRect();
        return { left: r.left, right: r.right, width: r.width };
      });
      const sourceHrefs = [...section.querySelectorAll('a')].map(link => link.href);
      const navLinks = [...document.querySelectorAll('a[href="#medical-network-omissions"]')];
      return {
        clinicPresent: text.includes(clinic),
        boundaryPresent: text.includes(boundary),
        summaryPresent: text.includes(summary),
        navPresent: navLinks.some(link => (link.textContent || '').trim() === nav),
        cardCount: cards.length,
        omissionCount: omissions.length,
        detailsOpen: details?.open === true,
        officialBadgeCount: section.querySelectorAll('.status-official').length,
        recordBadgeCount: section.querySelectorAll('.status-record').length,
        openBadgeCount: section.querySelectorAll('.status-open').length,
        controlYuanSource: sourceHrefs.includes('https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497'),
        pressSource: sourceHrefs.includes('https://www.cy.gov.tw/News_Content.aspx?Create=1&n=125&s=34118'),
        timelineSource: sourceHrefs.includes('https://www.children.org.tw/news/news_detail/kaikai-case-timeline'),
        cssVersion: document.querySelector('link[href*="final-chapter.css"]')?.href || '',
        cardsInsideViewport: cardRects.every(r => r.left >= -1 && r.right <= innerWidth + 1),
        overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
      };
    }, site);

    await page.locator('#medical-network-omissions').screenshot({
      path: `${output}/${language}-${viewportName}-medical-omissions.png`
    });

    const legacy = {};
    for (const id of ['dental-warning', 'death-temperature-evidence']) {
      await page.goto(`${site.url}?qa=legacy-${Date.now()}-${id}#${id}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      legacy[id] = await waitForAnchor(page, id);
    }

    const checks = {
      http200: response?.status() === 200,
      deepLinkVisible: anchor.hash === '#medical-network-omissions' && anchor.visible,
      clinicPresent: state.clinicPresent,
      evidenceBoundaryPresent: state.boundaryPresent,
      summaryPresent: state.summaryPresent,
      navPresent: state.navPresent,
      expectedCards: state.cardCount === 3 && state.omissionCount === 6,
      evidenceBadgesPresent: state.officialBadgeCount >= 2 && state.recordBadgeCount >= 2 && state.openBadgeCount >= 2,
      detailsWorks: state.detailsOpen,
      sourcesPresent: state.controlYuanSource && state.pressSource && state.timelineSource,
      cssVersionCurrent: state.cssVersion.includes('v=20260829-21'),
      responsiveCards: state.cardsInsideViewport,
      noHorizontalOverflow: state.overflow <= 2 && anchor.overflow <= 2,
      legacyDentalWorks: legacy['dental-warning'].hash === '#dental-warning' && legacy['dental-warning'].visible,
      legacyTemperatureWorks: legacy['death-temperature-evidence'].hash === '#death-temperature-evidence' && legacy['death-temperature-evidence'].visible,
      noPageErrors: pageErrors.length === 0,
      noSameOriginErrors: sameOriginErrors.length === 0
    };
    const passed = Object.values(checks).every(Boolean);
    if (!passed) failed = true;
    results.push({ language, viewport: viewportName, dimensions: viewport, checks, state, anchor, legacy, pageErrors, sameOriginErrors, passed });
    await context.close();
  }
}

await browser.close();
fs.writeFileSync(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
const lines = ['# Kaikai medical omissions browser verification', ''];
for (const result of results) {
  lines.push(`## ${result.language} · ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  lines.push(`- Cards: medical=${result.state.cardCount}; official omissions=${result.state.omissionCount}`);
  lines.push(`- Deep link top=${result.anchor.top}; overflow=${result.state.overflow}px`);
  lines.push(`- Existing anchors: dental=${result.legacy['dental-warning'].visible}; temperature=${result.legacy['death-temperature-evidence'].visible}`);
  lines.push(`- Errors: page=${result.pageErrors.length}; HTTP=${result.sameOriginErrors.length}`);
  const failedChecks = Object.entries(result.checks).filter(([, value]) => !value).map(([key]) => key);
  lines.push(`- Failed checks: ${failedChecks.length ? failedChecks.join(', ') : 'none'}`);
  lines.push('');
}
fs.writeFileSync(`${output}/summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
