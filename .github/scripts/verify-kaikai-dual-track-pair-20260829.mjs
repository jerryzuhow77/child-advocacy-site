import { chromium } from 'playwright-core';
import fs from 'node:fs';

const output = 'browser-validation/dual-track-pair';
fs.mkdirSync(output, { recursive: true });
const sites = {
  'zh-Hant': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/',
    title: '剴剴出養前｜雙軌責任關係樹',
    treeTitle: '五層責任明細樹＋法人治理旁軸',
    displayedAsset: 'kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp',
    firstDownload: '下載繁體 WEBP',
    secondDownload: '下載簡體 WEBP'
  },
  'zh-Hans': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    title: '剀剀出养前｜双轨责任关系树',
    treeTitle: '五层责任明细树＋法人治理旁轴',
    displayedAsset: 'kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp',
    firstDownload: '下载简体 WEBP',
    secondDownload: '下载繁体 WEBP'
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

for (const [language, site] of Object.entries(sites)) {
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const context = await browser.newContext({
      viewport,
      locale: language === 'zh-Hant' ? 'zh-TW' : 'zh-CN',
      colorScheme: 'light',
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    const pageErrors = [];
    const sameOriginErrors = [];
    const failedRequests = [];
    page.on('pageerror', error => pageErrors.push(String(error)));
    page.on('response', response => {
      const parsed = new URL(response.url());
      if (parsed.hostname === 'jerryzuhow77.github.io' && response.status() >= 400) {
        sameOriginErrors.push({ url: response.url(), status: response.status() });
      }
    });
    page.on('requestfailed', request => {
      failedRequests.push({ url: request.url(), type: request.resourceType(), error: request.failure()?.errorText || '' });
    });

    const response = await page.goto(`${site.url}?qa=${Date.now()}-${language}-${viewportName}#system`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.waitForSelector('#system .responsibility-tree-pair', { state: 'visible', timeout: 15000 });
    await page.locator('#system .responsibility-tree-visual img').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const image = document.querySelector('#system .responsibility-tree-visual img');
      return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
    }, null, { timeout: 30000 });
    await page.waitForTimeout(900);

    const state = await page.locator('#system .responsibility-tree-pair').evaluate((pair, expected) => {
      const visual = pair.querySelector('.responsibility-tree-visual');
      const panel = pair.querySelector('.responsibility-tree-panel');
      const image = visual.querySelector('img');
      const downloads = [...visual.querySelectorAll('.responsibility-tree-downloads a')];
      const pairRect = pair.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const text = pair.textContent || '';
      return {
        hash: location.hash,
        titlePresent: text.includes(expected.title),
        treeTitlePresent: text.includes(expected.treeTitle),
        pairCount: document.querySelectorAll('#system .responsibility-tree-pair').length,
        visualCount: pair.querySelectorAll('.responsibility-tree-visual').length,
        panelCount: pair.querySelectorAll('.responsibility-tree-panel').length,
        imageSrc: image.currentSrc || image.src,
        imageNaturalWidth: image.naturalWidth,
        imageNaturalHeight: image.naturalHeight,
        imageComplete: image.complete,
        downloadTexts: downloads.map(link => (link.textContent || '').trim()),
        downloadHrefs: downloads.map(link => link.href),
        gridTemplateColumns: getComputedStyle(pair).gridTemplateColumns,
        pairRect: { left: Math.round(pairRect.left), right: Math.round(pairRect.right), top: Math.round(pairRect.top), bottom: Math.round(pairRect.bottom), width: Math.round(pairRect.width) },
        visualRect: { left: Math.round(visualRect.left), right: Math.round(visualRect.right), top: Math.round(visualRect.top), bottom: Math.round(visualRect.bottom), width: Math.round(visualRect.width) },
        panelRect: { left: Math.round(panelRect.left), right: Math.round(panelRect.right), top: Math.round(panelRect.top), bottom: Math.round(panelRect.bottom), width: Math.round(panelRect.width) },
        overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth),
        cssHref: document.querySelector('link[href*="final-chapter.css"]')?.href || ''
      };
    }, site);

    await page.locator('#system .responsibility-tree-pair').screenshot({
      path: `${output}/${language}-${viewportName}-responsibility-pair.png`,
      animations: 'disabled',
      caret: 'hide'
    });

    const ratio = state.imageNaturalWidth / Math.max(1, state.imageNaturalHeight);
    const desktopSideBySide = state.visualRect.right <= state.panelRect.left + 3
      && Math.abs(state.visualRect.top - state.panelRect.top) <= 4;
    const mobileStacked = state.visualRect.bottom <= state.panelRect.top + 3
      && Math.abs(state.visualRect.left - state.panelRect.left) <= 4;
    const relevantFailures = failedRequests.filter(item => !(item.type === 'media' && item.error === 'net::ERR_ABORTED'));
    const checks = {
      http200: response?.status() === 200,
      correctDeepLink: state.hash === '#system',
      localizedTitles: state.titlePresent && state.treeTitlePresent,
      uniquePair: state.pairCount === 1 && state.visualCount === 1 && state.panelCount === 1,
      localizedDisplayedImage: state.imageSrc.endsWith(`/${site.displayedAsset}`),
      imageDecoded: state.imageComplete && state.imageNaturalWidth >= 900 && state.imageNaturalHeight >= 500 && Math.abs(ratio - 16 / 9) < 0.01,
      bothDownloads: state.downloadTexts.includes(site.firstDownload)
        && state.downloadTexts.includes(site.secondDownload)
        && state.downloadHrefs.some(href => href.endsWith('/kaikai-dual-track-responsibility-tree-zh-Hant-20260829.webp'))
        && state.downloadHrefs.some(href => href.endsWith('/kaikai-dual-track-responsibility-tree-zh-Hans-20260829.webp')),
      desktopSideBySide: viewportName !== 'desktop' || desktopSideBySide,
      mobileStacked: viewportName !== 'mobile' || mobileStacked,
      cardsInsideViewport: state.visualRect.left >= -1 && state.visualRect.right <= viewport.width + 1
        && state.panelRect.left >= -1 && state.panelRect.right <= viewport.width + 1,
      cssVersionCurrent: state.cssHref.includes('v=20260829-24'),
      noHorizontalOverflow: state.overflow <= 2,
      noPageErrors: pageErrors.length === 0,
      noSameOriginErrors: sameOriginErrors.length === 0,
      noRelevantRequestFailures: relevantFailures.length === 0
    };
    const passed = Object.values(checks).every(Boolean);
    if (!passed) failed = true;
    results.push({ language, viewport: viewportName, dimensions: viewport, checks, state, pageErrors, sameOriginErrors, relevantFailures, passed });
    await context.close();
  }
}

await browser.close();
fs.writeFileSync(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
const lines = ['# Bilingual dual-track responsibility poster browser verification', ''];
for (const result of results) {
  lines.push(`## ${result.language} · ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  lines.push(`- Image: ${result.state.imageNaturalWidth}×${result.state.imageNaturalHeight}; ${result.state.imageSrc}`);
  lines.push(`- Visual rect: ${JSON.stringify(result.state.visualRect)}`);
  lines.push(`- Five-layer tree rect: ${JSON.stringify(result.state.panelRect)}`);
  lines.push(`- Grid columns: ${result.state.gridTemplateColumns}; overflow=${result.state.overflow}px`);
  lines.push(`- Errors: page=${result.pageErrors.length}; HTTP=${result.sameOriginErrors.length}; requests=${result.relevantFailures.length}`);
  const failedChecks = Object.entries(result.checks).filter(([, value]) => !value).map(([key]) => key);
  lines.push(`- Failed checks: ${failedChecks.length ? failedChecks.join(', ') : 'none'}`);
  lines.push('');
}
fs.writeFileSync(`${output}/summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
