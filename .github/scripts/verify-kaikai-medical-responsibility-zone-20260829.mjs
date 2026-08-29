import { chromium } from 'playwright-core';
import fs from 'node:fs';

const output = 'browser-validation/medical-responsibility-zone';
fs.mkdirSync(output, { recursive: true });

const sites = {
  'zh-Hant': {
    page: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/',
    parent: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/',
    witness: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/witnesses/',
    title: '醫療責任釐清專區',
    parentMenu: '醫療責任',
    parentEntry: '醫療責任釐清專區',
    officialTitle: '監察院報告必須是整頁最醒目的官方主軸',
    institutionsTitle: '兒福聯盟不是唯一一層；但它也不能從制度責任圖中消失',
    clinicTitle: '兩家診所必須分開寫',
    caixinBoundary: '不宜寫「監察院具名認定采新牙醫」',
    xinglongBoundary: '監察院公開報告未具名興隆，也未對該診所作個別違失認定',
    witnessTitle: '蔡函妤醫師證詞',
    witnessEntry: '進入醫療責任釐清專區',
    filterLabel: '監察院正式認定',
    cssPath: '/medical-responsibility/medical-responsibility.css?v=20260829-1',
    jsPath: '/medical-responsibility/medical-responsibility.js?v=20260829-2'
  },
  'zh-Hans': {
    page: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/zh-Hans/',
    parent: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    witness: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/witnesses/',
    title: '医疗责任厘清专区',
    parentMenu: '医疗责任',
    parentEntry: '医疗责任厘清专区',
    officialTitle: '监察院报告必须是整页最醒目的官方主轴',
    institutionsTitle: '儿福联盟不是唯一一层；但它也不能从制度责任图中消失',
    clinicTitle: '两家诊所必须分开写',
    caixinBoundary: '不宜写“监察院具名认定采新牙医”',
    xinglongBoundary: '监察院公开报告未具名兴隆，也未对该诊所作个别失职认定',
    witnessTitle: '蔡函妤医师证词',
    witnessEntry: '进入医疗责任厘清专区',
    filterLabel: '监察院正式认定',
    cssPath: '/medical-responsibility/medical-responsibility.css?v=20260829-1',
    jsPath: '/medical-responsibility/medical-responsibility.js?v=20260829-2'
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

async function waitForHash(page, id) {
  await page.waitForSelector(`#${id}`, { state: 'visible', timeout: 15000 });
  await page.waitForFunction((targetId) => location.hash === `#${targetId}`, id, { timeout: 12000 });
  await page.waitForFunction((targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return false;
    const rect = target.getBoundingClientRect();
    return rect.top < innerHeight && rect.bottom > 0;
  }, id, { timeout: 20000 });
  await page.waitForTimeout(450);
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
    const failedRequests = [];
    page.on('pageerror', (error) => pageErrors.push(String(error)));
    page.on('response', (response) => {
      const parsed = new URL(response.url());
      if (parsed.hostname === 'jerryzuhow77.github.io' && response.status() >= 400) {
        sameOriginErrors.push({ url: response.url(), status: response.status() });
      }
    });
    page.on('requestfailed', (request) => {
      failedRequests.push({ url: request.url(), type: request.resourceType(), error: request.failure()?.errorText || '' });
    });

    const result = {
      language,
      viewport: viewportName,
      dimensions: viewport,
      checks: {},
      pageState: null,
      parentState: null,
      witnessState: null,
      filterState: null,
      deepLink: null,
      pageErrors,
      sameOriginErrors,
      failedRequests,
      passed: false
    };
    results.push(result);

    try {
      const response = await page.goto(`${site.page}?qa=${Date.now()}-${language}-${viewportName}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await page.waitForSelector('#control-yuan', { state: 'attached', timeout: 15000 });
      await page.waitForSelector('#clinics', { state: 'attached', timeout: 15000 });
      await page.waitForTimeout(900);

      result.pageState = await page.evaluate((expected) => {
        const text = document.body?.textContent || '';
        const officialLinks = [...document.querySelectorAll('a[href]')].map((link) => link.href);
        const langLinks = [...document.querySelectorAll('.language-switcher a')];
        return {
          title: document.title,
          h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, '') || '',
          navLinks: document.querySelectorAll('#medicalNav a').length,
          topicCards: document.querySelectorAll('.topic-index a').length,
          sourceLevelCards: document.querySelectorAll('.source-level-card').length,
          findingCards: document.querySelectorAll('.finding-card').length,
          institutionCards: document.querySelectorAll('.institution-card').length,
          deficiencyItems: document.querySelectorAll('.deficiency-list li').length,
          clinicCards: document.querySelectorAll('.clinic-card').length,
          testimonySummaryCards: document.querySelectorAll('.testimony-summary article').length,
          testimonyEvidenceCards: document.querySelectorAll('.testimony-evidence article').length,
          closedLoopItems: document.querySelectorAll('.closed-loop li').length,
          sourceRecords: document.querySelectorAll('.source-record').length,
          dataSourceCards: document.querySelectorAll('[data-source-level]').length,
          officialTitle: text.includes(expected.officialTitle),
          institutionsTitle: text.includes(expected.institutionsTitle),
          clinicTitle: text.includes(expected.clinicTitle),
          witnessTitle: text.includes(expected.witnessTitle),
          caixinBoundary: text.includes(expected.caixinBoundary),
          xinglongBoundary: text.includes(expected.xinglongBoundary),
          sevenDeficiencies: text.includes('7類缺失') || text.includes('7类缺失'),
          childWelfare: text.includes('兒福聯盟') || text.includes('儿福联盟'),
          controlYuanPdf: officialLinks.includes('https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497'),
          correctionPdf: officialLinks.includes('https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76427'),
          controlYuanNews: officialLinks.includes('https://www.cy.gov.tw/News_Content.aspx?n=640&s=34118'),
          courtRelease: officialLinks.includes('https://www.judicial.gov.tw/tw/cp-1888-1528027-1ee8d-1.html'),
          judgment: officialLinks.some((href) => href.startsWith('https://judgment.judicial.gov.tw/FJUD/data.aspx?')),
          languageLinks: langLinks.length,
          cssHref: document.querySelector('link[href*="medical-responsibility.css"]')?.href || '',
          jsSrc: document.querySelector('script[src*="medical-responsibility.js"]')?.src || '',
          overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
        };
      }, site);

      if (viewportName === 'mobile') {
        await page.locator('#medicalMenuButton').click();
        await page.waitForFunction(() => document.getElementById('medicalNav')?.classList.contains('open'), null, { timeout: 5000 });
        result.pageState.mobileMenuOpen = await page.locator('#medicalNav').isVisible();
        await page.locator('#medicalNav a[href="#clinics"]').click();
        await waitForHash(page, 'clinics');
        result.pageState.mobileMenuClosedAfterClick = !(await page.locator('#medicalNav').isVisible());
      } else {
        result.pageState.mobileMenuOpen = true;
        result.pageState.mobileMenuClosedAfterClick = true;
      }

      const filterButton = page.getByRole('button', { name: site.filterLabel });
      await filterButton.click();
      await page.waitForTimeout(250);
      result.filterState = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('[data-source-level]')];
        const visible = cards.filter((card) => !card.hidden);
        return {
          visible: visible.length,
          hidden: cards.length - visible.length,
          onlyOfficial: visible.every((card) => (card.dataset.sourceLevel || '').split(/\s+/).includes('official')),
          pressed: document.querySelector('[data-source-filter="official"]')?.getAttribute('aria-pressed') || ''
        };
      });
      await page.locator('[data-source-filter="all"]').click();

      await page.goto(`${site.page}?qa=deep-${Date.now()}-${language}-${viewportName}#clinics`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await waitForHash(page, 'clinics');
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
      await waitForHash(page, 'clinics');
      result.deepLink = await page.locator('#clinics').evaluate((section) => {
        const rect = section.getBoundingClientRect();
        return { hash: location.hash, top: Math.round(rect.top), visible: rect.top < innerHeight && rect.bottom > 0 };
      });
      await page.locator('#clinics').screenshot({
        path: `${output}/${language}-${viewportName}-clinics.png`,
        animations: 'disabled',
        caret: 'hide'
      });
      await page.locator('#institutions').screenshot({
        path: `${output}/${language}-${viewportName}-institutions.png`,
        animations: 'disabled',
        caret: 'hide'
      });

      const parentResponse = await page.goto(`${site.parent}?qa=parent-${Date.now()}-${language}-${viewportName}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await page.waitForSelector('#siteNav', { state: 'attached', timeout: 15000 });
      result.parentState = await page.evaluate((expected) => {
        const groups = [...document.querySelectorAll('#siteNav .nav-group')];
        const links = [...document.querySelectorAll('#siteNav a[href]')];
        const heroLinks = [...document.querySelectorAll('.hero-actions a[href]')];
        const medicalGroup = groups.find((group) => (group.querySelector('summary')?.textContent || '').trim() === expected.parentMenu);
        const entry = links.find((link) => (link.textContent || '').trim() === expected.parentEntry);
        return {
          medicalGroup: Boolean(medicalGroup),
          medicalGroupLinks: medicalGroup?.querySelectorAll('a').length || 0,
          menuEntryHref: entry?.href || '',
          heroEntry: heroLinks.some((link) => (link.textContent || '').trim() === expected.parentEntry),
          duplicateMedicalAnchorsInEvidenceGroup: (() => {
            const evidence = groups.find((group) => ['證據勾稽', '证据勾稽'].includes((group.querySelector('summary')?.textContent || '').trim()));
            const hrefs = [...(evidence?.querySelectorAll('a') || [])].map((link) => link.getAttribute('href'));
            return hrefs.filter((href) => ['#dental-warning', '#medical-network-omissions', '#death-temperature-evidence'].includes(href)).length;
          })(),
          overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
        };
      }, site);

      const witnessResponse = await page.goto(`${site.witness}?qa=witness-${Date.now()}-${language}-${viewportName}#witness-10-official-sources`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await page.waitForSelector('#witness-10-official-sources', { state: 'attached', timeout: 15000 });
      result.witnessState = await page.locator('#witness-10-official-sources').evaluate((section, expected) => {
        const link = [...section.querySelectorAll('a[href]')].find((item) => (item.textContent || '').trim() === expected.witnessEntry);
        return {
          entry: Boolean(link),
          href: link?.href || '',
          caixin: (section.textContent || '').includes('采新'),
          xinglong: (section.textContent || '').includes('興隆') || (section.textContent || '').includes('兴隆')
        };
      }, site);

      const relevantFailures = failedRequests.filter((item) => !(item.type === 'media' && item.error === 'net::ERR_ABORTED'));
      result.relevantFailures = relevantFailures;
      result.checks = {
        pageHttp200: response?.status() === 200,
        localizedTitle: result.pageState.title.includes(site.title) && result.pageState.h1.includes(site.title.replace(/\s+/g, '')),
        expectedStructure: result.pageState.navLinks === 7
          && result.pageState.topicCards === 4
          && result.pageState.sourceLevelCards === 4
          && result.pageState.findingCards === 4
          && result.pageState.institutionCards === 5
          && result.pageState.deficiencyItems === 7
          && result.pageState.clinicCards === 2
          && result.pageState.testimonySummaryCards === 4
          && result.pageState.testimonyEvidenceCards === 3
          && result.pageState.closedLoopItems === 7
          && result.pageState.sourceRecords === 6,
        officialEmphasis: result.pageState.officialTitle && result.pageState.institutionsTitle && result.pageState.sevenDeficiencies && result.pageState.childWelfare,
        clinicBoundaries: result.pageState.clinicTitle && result.pageState.caixinBoundary && result.pageState.xinglongBoundary,
        witnessContent: result.pageState.witnessTitle,
        officialSources: result.pageState.controlYuanPdf && result.pageState.correctionPdf && result.pageState.controlYuanNews && result.pageState.courtRelease && result.pageState.judgment,
        languageSwitch: result.pageState.languageLinks === 2,
        assetVersions: result.pageState.cssHref.includes(site.cssPath) && result.pageState.jsSrc.includes(site.jsPath),
        sourceFilterWorks: result.filterState.visible > 0 && result.filterState.hidden > 0 && result.filterState.onlyOfficial && result.filterState.pressed === 'true',
        mobileMenuWorks: result.pageState.mobileMenuOpen && result.pageState.mobileMenuClosedAfterClick,
        deepLinkReloadWorks: result.deepLink.hash === '#clinics' && result.deepLink.visible,
        parentHttp200: parentResponse?.status() === 200,
        parentMainMenu: result.parentState.medicalGroup && result.parentState.medicalGroupLinks === 5 && result.parentState.menuEntryHref.startsWith(site.page) && result.parentState.heroEntry && result.parentState.duplicateMedicalAnchorsInEvidenceGroup === 0,
        witnessHttp200: witnessResponse?.status() === 200,
        witnessEntry: result.witnessState.entry && result.witnessState.href.startsWith(site.page) && result.witnessState.caixin && result.witnessState.xinglong,
        noHorizontalOverflow: result.pageState.overflow <= 2 && result.parentState.overflow <= 2,
        noPageErrors: pageErrors.length === 0,
        noSameOriginErrors: sameOriginErrors.length === 0,
        noRelevantRequestFailures: relevantFailures.length === 0
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
const lines = ['# Kaikai medical responsibility zone browser verification', ''];
for (const result of results) {
  lines.push(`## ${result.language} · ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  lines.push(`- Structure: institutions=${result.pageState?.institutionCards ?? 'n/a'}, clinics=${result.pageState?.clinicCards ?? 'n/a'}, closed-loop=${result.pageState?.closedLoopItems ?? 'n/a'}, sources=${result.pageState?.sourceRecords ?? 'n/a'}`);
  lines.push(`- Parent menu: group=${result.parentState?.medicalGroup ?? 'n/a'}, links=${result.parentState?.medicalGroupLinks ?? 'n/a'}, hero=${result.parentState?.heroEntry ?? 'n/a'}`);
  lines.push(`- Witness entry: ${result.witnessState?.entry ?? 'n/a'}; filter visible/hidden=${result.filterState?.visible ?? 'n/a'}/${result.filterState?.hidden ?? 'n/a'}`);
  lines.push(`- Deep link: ${result.deepLink?.hash ?? 'n/a'}, top=${result.deepLink?.top ?? 'n/a'}`);
  lines.push(`- Errors: page=${result.pageErrors.length}; HTTP=${result.sameOriginErrors.length}; requests=${result.relevantFailures?.length ?? 'n/a'}`);
  const failedChecks = Object.entries(result.checks || {}).filter(([, value]) => !value).map(([key]) => key);
  lines.push(`- Failed checks: ${failedChecks.length ? failedChecks.join(', ') : 'none'}`);
  if (result.exception) lines.push(`- Exception: ${result.exception.split('\n')[0]}`);
  lines.push('');
}
fs.writeFileSync(`${output}/summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
