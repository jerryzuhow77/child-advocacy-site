import { chromium } from 'playwright-core';
import fs from 'node:fs';

const output = 'browser-validation/medical-root-entry';
fs.mkdirSync(output, { recursive: true });

const rootSites = {
  'zh-Hant': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/',
    lang: 'zh-Hant',
    title: '醫療責任釐清專區',
    summary: '監察院報告 × 兒盟與機構疏失 × 兩家診所 × 蔡函妤證詞',
    enter: '進入醫療責任釐清專區',
    footer: '醫療責任釐清專區',
    basePath: '/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/',
    displayedImage: '/child-advocacy-site/assets/art/kaikai-chapter2-hero-zh-Hant-20260828-v3.jpg'
  },
  'zh-Hans': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/?lang=zh-Hans',
    lang: 'zh-Hans',
    title: '医疗责任厘清专区',
    summary: '监察院报告 × 儿盟与机构失职 × 两家诊所 × 蔡函妤证词',
    enter: '进入医疗责任厘清专区',
    footer: '医疗责任厘清专区',
    basePath: '/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/zh-Hans/',
    displayedImage: '/child-advocacy-site/assets/art/kaikai-chapter2-hero-zh-Hans-20260828-v3.jpg'
  }
};

const hubSites = {
  'zh-Hant': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/',
    lang: 'zh-Hant',
    title: '醫療責任釐清專區',
    controlYuan: '監察院報告必須是整頁最醒目的官方主軸',
    institutions: '兒福聯盟不是唯一一層；但它也不能從制度責任圖中消失',
    clinics: '兩家診所必須分開寫',
    testimony: '蔡函妤醫師證詞',
    emergency: '急診與24°C'
  },
  'zh-Hans': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/zh-Hans/',
    lang: 'zh-Hans',
    title: '医疗责任厘清专区',
    controlYuan: '监察院报告必须是整页最醒目的官方主轴',
    institutions: '儿福联盟不是唯一一层；但它也不能从制度责任图中消失',
    clinics: '两家诊所必须分开写',
    testimony: '蔡函妤医师证词',
    emergency: '急诊与24°C'
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

const relevantFailures = failures => failures.filter(item =>
  !(item.type === 'media' && item.error === 'net::ERR_ABORTED')
);

for (const [language, site] of Object.entries(rootSites)) {
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
    const requestFailures = [];
    page.on('pageerror', error => pageErrors.push(String(error)));
    page.on('response', response => {
      const parsed = new URL(response.url());
      if (parsed.hostname === 'jerryzuhow77.github.io' && response.status() >= 400) {
        sameOriginErrors.push({ url: response.url(), status: response.status() });
      }
    });
    page.on('requestfailed', request => requestFailures.push({
      url: request.url(),
      type: request.resourceType(),
      error: request.failure()?.errorText || ''
    }));

    const joiner = site.url.includes('?') ? '&' : '?';
    const response = await page.goto(`${site.url}${joiner}qa=${Date.now()}-${language}-${viewportName}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.waitForFunction(expected => document.documentElement.lang === expected, site.lang, { timeout: 15000 });
    await page.waitForSelector('[data-kaikai-medical-root-entry]', { state: 'attached', timeout: 15000 });
    await page.waitForFunction(() => document.querySelector('script[data-cpa-site-layer="base"]'), null, { timeout: 15000 });
    await page.waitForTimeout(900);

    await page.locator('.special-feature-nav-toggle').click({ force: true });
    await page.waitForTimeout(150);
    await page.locator('.special-feature-case-toggle').filter({ hasText: language === 'zh-Hant' ? '剴剴案' : '剀剀案' }).click({ force: true });
    await page.waitForTimeout(150);
    await page.locator('[data-kaikai-medical-root-entry] .special-feature-menu-prologue').click({ force: true });
    await page.waitForTimeout(350);

    const entry = page.locator('[data-kaikai-medical-root-entry]');
    await entry.scrollIntoViewIfNeeded();
    const image = entry.locator('img');
    await image.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const img = document.querySelector('[data-kaikai-medical-root-entry] img');
      return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
    }, null, { timeout: 30000 });

    const state = await entry.evaluate((root, expected) => {
      const text = root.textContent || '';
      const links = [...root.querySelectorAll('.special-feature-prologue-children a')];
      const main = root.querySelector('.special-feature-menu-card');
      const img = root.querySelector('img');
      const rect = root.getBoundingClientRect();
      const footerLink = [...document.querySelectorAll('.home-footer-toolbar a')]
        .find(link => (link.textContent || '').trim() === expected.footer);
      const directChapterTwo = [...document.querySelectorAll('#specialFeatureKaikaiZh a')]
        .some(link => {
          const parsed = new URL(link.href);
          return parsed.pathname.endsWith('/kaikai-final-chapter/');
        });
      return {
        lang: document.documentElement.lang,
        title: text.includes(expected.title),
        summary: text.includes(expected.summary),
        enter: text.includes(expected.enter),
        groupExpanded: root.querySelector('.special-feature-menu-prologue')?.getAttribute('aria-expanded') === 'true',
        childrenVisible: (() => {
          const children = root.querySelector('.special-feature-prologue-children');
          const style = getComputedStyle(children);
          const childRect = children.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && childRect.width > 0 && childRect.height > 0;
        })(),
        linkCount: links.length,
        hrefs: links.map(link => link.href),
        mainHref: main?.href || '',
        imageSrc: img?.currentSrc || img?.src || '',
        imageWidth: img?.naturalWidth || 0,
        imageHeight: img?.naturalHeight || 0,
        imageAlt: img?.alt || '',
        footerText: footerLink?.textContent?.trim() || '',
        footerHref: footerLink?.href || '',
        noDirectChapterTwoEntry: !directChapterTwo,
        rendered: getComputedStyle(root).display !== 'none' && rect.width > 0 && rect.height > 0,
        overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
      };
    }, site);

    const targetResponse = await page.request.get(state.mainHref, { timeout: 30000 });
    await entry.screenshot({
      path: `${output}/root-${language}-${viewportName}-medical-menu.png`,
      animations: 'disabled',
      caret: 'hide'
    });

    const failures = relevantFailures(requestFailures);
    const checks = {
      http200: response?.status() === 200,
      languageCorrect: state.lang === site.lang,
      localizedCopy: state.title && state.summary && state.enter,
      menuWorks: state.groupExpanded && state.childrenVisible && state.rendered,
      completeRootEntry: state.linkCount === 5,
      localizedMainHref: new URL(state.mainHref).pathname === site.basePath,
      allDeepLinksLocalized: state.hrefs.every(href => new URL(href).pathname === site.basePath),
      localizedImage: new URL(state.imageSrc).pathname === site.displayedImage && state.imageWidth > 1000 && state.imageHeight > 500,
      footerEntryLocalized: state.footerText === site.footer && new URL(state.footerHref).pathname === site.basePath,
      medicalHubReachable: targetResponse.status() === 200,
      chapterTwoStillNotRootLinked: state.noDirectChapterTwoEntry,
      noHorizontalOverflow: state.overflow <= 2,
      noPageErrors: pageErrors.length === 0,
      noSameOriginErrors: sameOriginErrors.length === 0,
      noRelevantRequestFailures: failures.length === 0
    };
    const passed = Object.values(checks).every(Boolean);
    if (!passed) failed = true;
    results.push({ kind: 'root-entry', language, viewport: viewportName, dimensions: viewport, checks, state, pageErrors, sameOriginErrors, relevantFailures: failures, passed });
    await context.close();
  }
}

for (const [language, site] of Object.entries(hubSites)) {
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
    const requestFailures = [];
    page.on('pageerror', error => pageErrors.push(String(error)));
    page.on('response', response => {
      const parsed = new URL(response.url());
      if (parsed.hostname === 'jerryzuhow77.github.io' && response.status() >= 400) {
        sameOriginErrors.push({ url: response.url(), status: response.status() });
      }
    });
    page.on('requestfailed', request => requestFailures.push({
      url: request.url(), type: request.resourceType(), error: request.failure()?.errorText || ''
    }));

    const response = await page.goto(`${site.url}?qa=${Date.now()}-${language}-${viewportName}#control-yuan`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.waitForSelector('#control-yuan', { state: 'visible', timeout: 15000 });
    await page.waitForTimeout(750);

    const state = await page.evaluate(expected => {
      const text = document.body.textContent || '';
      const sourceHrefs = [...document.querySelectorAll('#sources a[href]')].map(link => link.href);
      const clinicText = document.getElementById('clinics')?.textContent || '';
      const witnessHref = document.querySelector('#cai-hanyu a[href*="witness-10"]')?.href || '';
      return {
        lang: document.documentElement.lang,
        pageTitle: text.includes(expected.title),
        controlYuan: text.includes(expected.controlYuan),
        institutions: text.includes(expected.institutions),
        clinics: text.includes(expected.clinics),
        testimony: text.includes(expected.testimony),
        emergency: text.includes(expected.emergency),
        sectionIds: ['control-yuan','institutions','clinics','cai-hanyu','emergency','closed-loop','sources'].every(id => document.getElementById(id)),
        institutionCount: document.querySelectorAll('#institutions .institution-card').length,
        deficiencyCount: document.querySelectorAll('#institutions .deficiency-list li').length,
        clinicCount: document.querySelectorAll('#clinics .clinic-card').length,
        closedLoopCount: document.querySelectorAll('#closed-loop .closed-loop li').length,
        sourceRecordCount: document.querySelectorAll('#sources .source-record').length,
        caixinBoundary: clinicText.includes('采新') && (clinicText.includes('匿名') || clinicText.includes('匿名')),
        xinglongBoundary: clinicText.includes('興隆') || clinicText.includes('兴隆'),
        witnessCanonical: witnessHref.includes('/witnesses/#witness-10'),
        officialReport: sourceHrefs.some(href => href === 'https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497'),
        correctionDocument: sourceHrefs.some(href => href === 'https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76427'),
        courtSource: sourceHrefs.some(href => href === 'https://www.judicial.gov.tw/tw/cp-1888-1528027-1ee8d-1.html'),
        overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
      };
    }, site);

    await page.locator('#control-yuan').screenshot({
      path: `${output}/hub-${language}-${viewportName}-control-yuan.png`,
      animations: 'disabled',
      caret: 'hide'
    });
    await page.locator('#clinics').scrollIntoViewIfNeeded();
    await page.locator('#clinics').screenshot({
      path: `${output}/hub-${language}-${viewportName}-clinics.png`,
      animations: 'disabled',
      caret: 'hide'
    });

    const failures = relevantFailures(requestFailures);
    const checks = {
      http200: response?.status() === 200,
      languageCorrect: state.lang === site.lang,
      allCoreSections: state.sectionIds,
      localizedCoreCopy: state.pageTitle && state.controlYuan && state.institutions && state.clinics && state.testimony && state.emergency,
      institutionsComplete: state.institutionCount === 5 && state.deficiencyCount === 7,
      clinicsSeparated: state.clinicCount === 2 && state.caixinBoundary && state.xinglongBoundary,
      testimonyLinked: state.witnessCanonical,
      closedLoopComplete: state.closedLoopCount === 7,
      officialSourcesPresent: state.sourceRecordCount >= 6 && state.officialReport && state.correctionDocument && state.courtSource,
      noHorizontalOverflow: state.overflow <= 2,
      noPageErrors: pageErrors.length === 0,
      noSameOriginErrors: sameOriginErrors.length === 0,
      noRelevantRequestFailures: failures.length === 0
    };
    const passed = Object.values(checks).every(Boolean);
    if (!passed) failed = true;
    results.push({ kind: 'medical-hub', language, viewport: viewportName, dimensions: viewport, checks, state, pageErrors, sameOriginErrors, relevantFailures: failures, passed });
    await context.close();
  }
}

await browser.close();
fs.writeFileSync(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
const lines = ['# Kaikai medical responsibility root-entry and hub verification', ''];
for (const result of results) {
  lines.push(`## ${result.kind} · ${result.language} · ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  if (result.kind === 'root-entry') {
    lines.push(`- Menu links=${result.state.linkCount}; image=${result.state.imageWidth}×${result.state.imageHeight}; href=${result.state.mainHref}`);
    lines.push(`- Localized title=${result.state.title}; summary=${result.state.summary}; footer=${result.state.footerText}`);
  } else {
    lines.push(`- Institutions=${result.state.institutionCount}; deficiencies=${result.state.deficiencyCount}; clinics=${result.state.clinicCount}; closed loop=${result.state.closedLoopCount}`);
    lines.push(`- Official report=${result.state.officialReport}; correction=${result.state.correctionDocument}; court=${result.state.courtSource}; witness=${result.state.witnessCanonical}`);
  }
  lines.push(`- Errors: page=${result.pageErrors.length}; HTTP=${result.sameOriginErrors.length}; requests=${result.relevantFailures.length}`);
  const failedChecks = Object.entries(result.checks).filter(([, value]) => !value).map(([key]) => key);
  lines.push(`- Failed checks: ${failedChecks.length ? failedChecks.join(', ') : 'none'}`);
  lines.push('');
}
fs.writeFileSync(`${output}/summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
