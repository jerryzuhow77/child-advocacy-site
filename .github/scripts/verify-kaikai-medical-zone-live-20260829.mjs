import { chromium } from 'playwright-core';
import fs from 'node:fs';

const output = 'browser-validation/medical-responsibility-zone-final';
fs.mkdirSync(output, { recursive: true });

const sites = {
  'zh-Hant': {
    page: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/',
    parent: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/',
    witness: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/witnesses/',
    title: '醫療責任釐清專區',
    parentGroup: '醫療責任',
    parentEntry: '醫療責任釐清專區',
    officialHeading: '監察院報告必須是整頁最醒目的官方主軸',
    institutionHeading: '兒福聯盟不是唯一一層；但它也不能從制度責任圖中消失',
    clinicHeading: '兩家診所必須分開寫',
    caixin: '采新牙醫診所',
    caixinBoundary: '不宜寫「監察院具名認定采新牙醫」',
    xinglong: '興隆內科小兒科診所',
    xinglongBoundary: '監察院公開報告未具名興隆，也未對該診所作個別違失認定',
    testimony: '蔡函妤醫師證詞',
    witnessEntry: '進入醫療責任釐清專區',
    officialFilter: '監察院正式認定',
    parentMedicalHref: '/medical-responsibility/',
    witnessMedicalHref: '/medical-responsibility/'
  },
  'zh-Hans': {
    page: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/medical-responsibility/zh-Hans/',
    parent: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    witness: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/witnesses/',
    title: '医疗责任厘清专区',
    parentGroup: '医疗责任',
    parentEntry: '医疗责任厘清专区',
    officialHeading: '监察院报告必须是整页最醒目的官方主轴',
    institutionHeading: '儿福联盟不是唯一一层；但它也不能从制度责任图中消失',
    clinicHeading: '两家诊所必须分开写',
    caixin: '采新牙医诊所',
    caixinBoundary: '不宜写“监察院具名认定采新牙医”',
    xinglong: '兴隆内科小儿科诊所',
    xinglongBoundary: '监察院公开报告未具名兴隆，也未对该诊所作个别失职认定',
    testimony: '蔡函妤医师证词',
    witnessEntry: '进入医疗责任厘清专区',
    officialFilter: '监察院正式认定',
    parentMedicalHref: '/medical-responsibility/zh-Hans/',
    witnessMedicalHref: '/medical-responsibility/zh-Hans/'
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

async function waitForHashTarget(page, id, timeout = 20000) {
  await page.waitForSelector(`#${id}`, { state: 'visible', timeout: 15000 });
  await page.waitForFunction((targetId) => location.hash === `#${targetId}`, id, { timeout });
  await page.waitForFunction((targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return false;
    const rect = target.getBoundingClientRect();
    return rect.top < innerHeight && rect.bottom > 0;
  }, id, { timeout });
  await page.waitForTimeout(450);
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
    const sameOriginHttpErrors = [];
    const sameOriginRequestFailures = [];

    page.on('pageerror', (error) => pageErrors.push(String(error)));
    page.on('response', (response) => {
      const parsed = new URL(response.url());
      if (parsed.hostname === 'jerryzuhow77.github.io' && response.status() >= 400) {
        sameOriginHttpErrors.push({ url: response.url(), status: response.status() });
      }
    });
    page.on('requestfailed', (request) => {
      const parsed = new URL(request.url());
      if (parsed.hostname === 'jerryzuhow77.github.io') {
        sameOriginRequestFailures.push({ url: request.url(), type: request.resourceType(), error: request.failure()?.errorText || '' });
      }
    });

    const result = {
      language,
      viewport: viewportName,
      dimensions: viewport,
      checks: {},
      medical: null,
      filter: null,
      mobileMenu: null,
      deepLink: null,
      parent: null,
      witness: null,
      pageErrors,
      sameOriginHttpErrors,
      sameOriginRequestFailures,
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

      result.medical = await page.evaluate((expected) => {
        const text = document.body?.textContent || '';
        const hrefs = [...document.querySelectorAll('a[href]')].map((link) => link.href);
        return {
          status: document.readyState,
          title: document.title,
          h1: (document.querySelector('h1')?.textContent || '').replace(/\s+/g, ''),
          officialHeading: text.includes(expected.officialHeading),
          institutionHeading: text.includes(expected.institutionHeading),
          clinicHeading: text.includes(expected.clinicHeading),
          caixin: text.includes(expected.caixin),
          caixinBoundary: text.includes(expected.caixinBoundary),
          xinglong: text.includes(expected.xinglong),
          xinglongBoundary: text.includes(expected.xinglongBoundary),
          testimony: text.includes(expected.testimony),
          sevenDeficiencies: text.includes('7類缺失') || text.includes('7类缺失'),
          controlYuanCase: text.includes('114社調0008') || text.includes('114社调0008'),
          navCount: document.querySelectorAll('#medicalNav a').length,
          topicCount: document.querySelectorAll('.topic-index a').length,
          sourceLevelCount: document.querySelectorAll('.source-level-card').length,
          findingCount: document.querySelectorAll('.finding-card').length,
          institutionCount: document.querySelectorAll('.institution-card').length,
          deficiencyCount: document.querySelectorAll('.deficiency-list li').length,
          clinicCount: document.querySelectorAll('.clinic-card').length,
          testimonySummaryCount: document.querySelectorAll('.testimony-summary article').length,
          testimonyEvidenceCount: document.querySelectorAll('.testimony-evidence article').length,
          closedLoopCount: document.querySelectorAll('.closed-loop li').length,
          sourceRecordCount: document.querySelectorAll('.source-record').length,
          languageSwitchCount: document.querySelectorAll('.language-switcher a').length,
          reportPdf: hrefs.includes('https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76497'),
          correctionPdf: hrefs.includes('https://cybsbox.cy.gov.tw/CYBSBoxSSL/edoc/download/76427'),
          controlYuanNews: hrefs.includes('https://www.cy.gov.tw/News_Content.aspx?n=640&s=34118'),
          courtRelease: hrefs.includes('https://www.judicial.gov.tw/tw/cp-1888-1528027-1ee8d-1.html'),
          judgment: hrefs.some((href) => href.startsWith('https://judgment.judicial.gov.tw/FJUD/data.aspx?')),
          css: document.querySelector('link[href*="medical-responsibility.css"]')?.href || '',
          js: document.querySelector('script[src*="medical-responsibility.js"]')?.src || '',
          overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
        };
      }, site);

      const officialButton = page.getByRole('button', { name: site.officialFilter });
      await officialButton.click();
      await page.waitForTimeout(300);
      result.filter = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('[data-source-level]')];
        const visible = cards.filter((card) => !card.hidden);
        return {
          visible: visible.length,
          hidden: cards.length - visible.length,
          onlyOfficial: visible.length > 0 && visible.every((card) => (card.dataset.sourceLevel || '').split(/\s+/).includes('official')),
          pressed: document.querySelector('[data-source-filter="official"]')?.getAttribute('aria-pressed') || ''
        };
      });
      await page.locator('[data-source-filter="all"]').click();

      if (viewportName === 'mobile') {
        await page.locator('#medicalMenuButton').click();
        await page.waitForFunction(() => document.getElementById('medicalNav')?.classList.contains('open'), null, { timeout: 5000 });
        const opened = await page.locator('#medicalNav').isVisible();
        await page.locator('#medicalNav a[href="#clinics"]').click();
        const target = await waitForHashTarget(page, 'clinics');
        const closed = !(await page.locator('#medicalNav').isVisible());
        result.mobileMenu = { opened, closed, target };
      } else {
        result.mobileMenu = { opened: true, closed: true, target: null };
      }

      await page.goto(`${site.page}?qa=deep-${Date.now()}-${language}-${viewportName}#clinics`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await waitForHashTarget(page, 'clinics');
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
      result.deepLink = await waitForHashTarget(page, 'clinics');

      await page.locator('#control-yuan').screenshot({
        path: `${output}/${language}-${viewportName}-control-yuan.png`,
        animations: 'disabled',
        caret: 'hide'
      });
      await page.locator('#clinics').screenshot({
        path: `${output}/${language}-${viewportName}-clinics.png`,
        animations: 'disabled',
        caret: 'hide'
      });

      const parentResponse = await page.goto(`${site.parent}?qa=parent-${Date.now()}-${language}-${viewportName}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await page.waitForSelector('#siteNav', { state: 'attached', timeout: 15000 });
      result.parent = await page.evaluate((expected) => {
        const groups = [...document.querySelectorAll('#siteNav .nav-group')];
        const medicalGroup = groups.find((group) => (group.querySelector('summary')?.textContent || '').trim() === expected.parentGroup);
        const medicalLinks = [...(medicalGroup?.querySelectorAll('a[href]') || [])];
        const evidenceGroup = groups.find((group) => ['證據勾稽', '证据勾稽'].includes((group.querySelector('summary')?.textContent || '').trim()));
        const evidenceHrefs = [...(evidenceGroup?.querySelectorAll('a[href]') || [])].map((link) => link.getAttribute('href'));
        const heroEntry = [...document.querySelectorAll('.hero-actions a[href]')].find((link) => (link.textContent || '').trim() === expected.parentEntry);
        const menuEntry = medicalLinks.find((link) => (link.textContent || '').trim() === expected.parentEntry);
        return {
          group: Boolean(medicalGroup),
          linkCount: medicalLinks.length,
          menuHref: menuEntry?.href || '',
          hero: Boolean(heroEntry),
          heroHref: heroEntry?.href || '',
          duplicateOldMedicalAnchors: evidenceHrefs.filter((href) => ['#dental-warning', '#medical-network-omissions', '#death-temperature-evidence'].includes(href)).length,
          overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
        };
      }, site);

      const witnessResponse = await page.goto(`${site.witness}?qa=witness-${Date.now()}-${language}-${viewportName}#witness-10-official-sources`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await page.waitForSelector('#witness-10-official-sources', { state: 'attached', timeout: 15000 });
      result.witness = await page.evaluate((expected) => {
        const official = document.getElementById('witness-10-official-sources');
        const allEntries = [...document.querySelectorAll('a[href]')].filter((link) => (link.textContent || '').trim() === expected.witnessEntry);
        const officialEntry = [...(official?.querySelectorAll('a[href]') || [])].find((link) => (link.textContent || '').trim() === expected.witnessEntry);
        const text = official?.textContent || '';
        return {
          globalEntryCount: allEntries.length,
          officialEntry: Boolean(officialEntry),
          href: officialEntry?.href || '',
          caixin: text.includes('采新'),
          xinglong: text.includes('興隆') || text.includes('兴隆'),
          overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
        };
      }, site);

      const checks = {
        pageHttp200: response?.status() === 200,
        localizedTitle: result.medical.title.includes(site.title) && result.medical.h1.includes(site.title.replace(/\s+/g, '')),
        officialEmphasis: result.medical.officialHeading && result.medical.institutionHeading && result.medical.sevenDeficiencies && result.medical.controlYuanCase,
        clinicBoundaries: result.medical.clinicHeading && result.medical.caixin && result.medical.caixinBoundary && result.medical.xinglong && result.medical.xinglongBoundary,
        testimonyIncluded: result.medical.testimony,
        expectedStructure: result.medical.navCount === 7
          && result.medical.topicCount === 4
          && result.medical.sourceLevelCount === 4
          && result.medical.findingCount === 4
          && result.medical.institutionCount === 5
          && result.medical.deficiencyCount === 7
          && result.medical.clinicCount === 2
          && result.medical.testimonySummaryCount === 4
          && result.medical.testimonyEvidenceCount === 3
          && result.medical.closedLoopCount === 7
          && result.medical.sourceRecordCount === 6,
        officialSources: result.medical.reportPdf && result.medical.correctionPdf && result.medical.controlYuanNews && result.medical.courtRelease && result.medical.judgment,
        localizedAssets: result.medical.css.includes('/medical-responsibility/medical-responsibility.css?v=20260829-1')
          && result.medical.js.includes('/medical-responsibility/medical-responsibility.js?v=20260829-2'),
        languageSwitch: result.medical.languageSwitchCount === 2,
        sourceFilterWorks: result.filter.visible > 0 && result.filter.hidden > 0 && result.filter.onlyOfficial && result.filter.pressed === 'true',
        mobileMenuWorks: result.mobileMenu.opened && result.mobileMenu.closed && (viewportName !== 'mobile' || result.mobileMenu.target?.visible),
        deepLinkReloadWorks: result.deepLink.hash === '#clinics' && result.deepLink.visible && result.deepLink.rendered,
        parentHttp200: parentResponse?.status() === 200,
        parentMainMenu: result.parent.group
          && result.parent.linkCount === 5
          && result.parent.menuHref.includes(site.parentMedicalHref)
          && result.parent.hero
          && result.parent.heroHref.includes(site.parentMedicalHref)
          && result.parent.duplicateOldMedicalAnchors === 0,
        witnessHttp200: witnessResponse?.status() === 200,
        witnessCanonicalEntry: result.witness.globalEntryCount === 1
          && result.witness.officialEntry
          && result.witness.href.includes(site.witnessMedicalHref)
          && result.witness.caixin
          && result.witness.xinglong,
        noHorizontalOverflow: result.medical.overflow <= 2 && result.deepLink.overflow <= 2 && result.parent.overflow <= 2 && result.witness.overflow <= 2,
        noPageErrors: pageErrors.length === 0,
        noSameOriginHttpErrors: sameOriginHttpErrors.length === 0,
        noSameOriginRequestFailures: sameOriginRequestFailures.length === 0
      };

      result.checks = checks;
      result.passed = Object.values(checks).every(Boolean);
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

const lines = ['# Kaikai medical responsibility zone final browser verification', ''];
for (const result of results) {
  lines.push(`## ${result.language} · ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  lines.push(`- Structure: institutions=${result.medical?.institutionCount ?? 'n/a'}, deficiencies=${result.medical?.deficiencyCount ?? 'n/a'}, clinics=${result.medical?.clinicCount ?? 'n/a'}, closed-loop=${result.medical?.closedLoopCount ?? 'n/a'}`);
  lines.push(`- Parent menu: group=${result.parent?.group ?? 'n/a'}, links=${result.parent?.linkCount ?? 'n/a'}, hero=${result.parent?.hero ?? 'n/a'}`);
  lines.push(`- Witness entry: count=${result.witness?.globalEntryCount ?? 'n/a'}, official-panel=${result.witness?.officialEntry ?? 'n/a'}`);
  lines.push(`- Filter: visible=${result.filter?.visible ?? 'n/a'}, hidden=${result.filter?.hidden ?? 'n/a'}`);
  lines.push(`- Deep link: ${result.deepLink?.hash ?? 'n/a'}, top=${result.deepLink?.top ?? 'n/a'}`);
  lines.push(`- Errors: page=${result.pageErrors.length}, HTTP=${result.sameOriginHttpErrors.length}, requests=${result.sameOriginRequestFailures.length}`);
  const failedChecks = Object.entries(result.checks || {}).filter(([, value]) => !value).map(([key]) => key);
  lines.push(`- Failed checks: ${failedChecks.length ? failedChecks.join(', ') : 'none'}`);
  if (result.exception) lines.push(`- Exception: ${result.exception.split('\n')[0]}`);
  lines.push('');
}
fs.writeFileSync(`${output}/summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
