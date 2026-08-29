import { chromium } from 'playwright-core';
import fs from 'node:fs';

const output = 'browser-validation/kaikai-chapter-two-major';
fs.mkdirSync(output, { recursive: true });

const sites = {
  'zh-Hant': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/',
    chapterUrl: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/',
    image: 'kaikai-chapter2-hero-zh-Hant-20260828-v3.jpg',
    title: '第二章｜沒人要的孩子？',
    subtitle: '孩子被選擇的人生',
    entry: '進入第二章主頁',
    brief: '先看五分鐘重點',
    cases: '查看實際傷害案例',
    menuTitle: '進入第二章｜沒人要的孩子？',
    fiveMinute: '五分鐘重點',
    outOfHome: '家外安置制度',
    harmCases: '實際傷害案例',
    responsibility: '責任連動與五層責任樹',
    witnesses: '13名證人全文',
    cardAction: '閱讀第二章 →',
    footer: '第二章｜沒人要的孩子？'
  },
  'zh-Hans': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/?lang=zh-Hans',
    chapterUrl: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    image: 'kaikai-chapter2-hero-zh-Hans-20260828-v3.jpg',
    title: '第二章｜没人要的孩子？',
    subtitle: '孩子被选择的人生',
    entry: '进入第二章主页',
    brief: '先看五分钟重点',
    cases: '查看实际伤害案例',
    menuTitle: '进入第二章｜没人要的孩子？',
    fiveMinute: '五分钟重点',
    outOfHome: '家外安置制度',
    harmCases: '实际伤害案例',
    responsibility: '责任联动与五层责任树',
    witnesses: '13名证人全文',
    cardAction: '阅读第二章 →',
    footer: '第二章｜没人要的孩子？'
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
      const type = request.resourceType();
      const error = request.failure()?.errorText || '';
      const expectedAbort = error === 'net::ERR_ABORTED' && ['media', 'image'].includes(type);
      if (parsed.hostname === 'jerryzuhow77.github.io' && !expectedAbort) {
        sameOriginRequestFailures.push({ url: request.url(), type, error });
      }
    });

    const result = {
      language,
      viewport: viewportName,
      dimensions: viewport,
      checks: {},
      state: null,
      menu: null,
      target: null,
      pageErrors,
      sameOriginHttpErrors,
      sameOriginRequestFailures,
      passed: false
    };
    results.push(result);

    try {
      const response = await page.goto(`${site.url}${site.url.includes('?') ? '&' : '?'}qa=${Date.now()}-${language}-${viewportName}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await page.waitForSelector('[data-kaikai-chapter-two-launch]', { state: 'visible', timeout: 20000 });
      await page.waitForFunction((expected) => {
        const launch = document.querySelector('[data-kaikai-chapter-two-launch]');
        const text = launch?.textContent || '';
        const image = launch?.querySelector('img');
        return text.includes(expected.title)
          && text.includes(expected.subtitle)
          && image instanceof HTMLImageElement
          && image.complete
          && image.naturalWidth > 0;
      }, site, { timeout: 30000 });
      await page.waitForTimeout(900);

      result.state = await page.evaluate((expected) => {
        const launch = document.querySelector('[data-kaikai-chapter-two-launch]');
        const launchText = launch?.textContent || '';
        const launchImage = launch?.querySelector('img');
        const launchLinks = [...(launch?.querySelectorAll('a[href]') || [])];
        const chapterGroup = document.querySelector('[data-kaikai-chapter-two-root-entry]');
        const chapterGroupText = chapterGroup?.textContent || '';
        const chapterLinks = [...(chapterGroup?.querySelectorAll('a[href]') || [])];
        const card = document.querySelector('[data-kaikai-chapter-two-card]');
        const cardText = card?.textContent || '';
        const cards = [...document.querySelectorAll('.home-crafted-card')];
        const chapterOneCard = document.querySelector('.home-crafted-card.is-kaikai-chapter-one');
        const footer = document.querySelector('[data-kaikai-chapter-two-footer]');
        const css = document.querySelector('link[href*="home-kaikai-chapter-two-20260829.css"]');
        const js = document.querySelector('script[src*="home-kaikai-chapter-two-20260829.js"]');
        return {
          documentLang: document.documentElement.lang,
          launchCount: document.querySelectorAll('[data-kaikai-chapter-two-launch]').length,
          launchTitle: launchText.includes(expected.title),
          launchSubtitle: launchText.includes(expected.subtitle),
          launchEntry: launchText.includes(expected.entry),
          launchBrief: launchText.includes(expected.brief),
          launchCases: launchText.includes(expected.cases),
          launchActionCount: launch?.querySelectorAll('.home-chapter-two-launch-actions a').length || 0,
          launchStatCount: launch?.querySelectorAll('.home-chapter-two-launch-stats > div').length || 0,
          launchImageSrc: launchImage?.currentSrc || launchImage?.src || '',
          launchImageWidth: launchImage?.naturalWidth || 0,
          launchImageHeight: launchImage?.naturalHeight || 0,
          launchHrefs: launchLinks.map((link) => link.href),
          groupCount: document.querySelectorAll('[data-kaikai-chapter-two-root-entry]').length,
          groupLinkCount: chapterLinks.length,
          menuTitle: chapterGroupText.includes(expected.menuTitle),
          fiveMinute: chapterGroupText.includes(expected.fiveMinute),
          outOfHome: chapterGroupText.includes(expected.outOfHome),
          harmCases: chapterGroupText.includes(expected.harmCases),
          responsibility: chapterGroupText.includes(expected.responsibility),
          witnesses: chapterGroupText.includes(expected.witnesses),
          groupHrefs: chapterLinks.map((link) => link.href),
          chapterOneGroupCount: document.querySelectorAll('.special-feature-prologue-group.is-kaikai-chapter-one').length,
          medicalGroupCount: document.querySelectorAll('[data-kaikai-medical-root-entry]').length,
          cardCount: document.querySelectorAll('[data-kaikai-chapter-two-card]').length,
          cardTitle: cardText.includes(expected.title),
          cardAction: cardText.includes(expected.cardAction),
          legacyCardCopyAbsent: !cardText.includes('終章') && !cardText.includes('终章') && !cardText.includes('672天'),
          cardHref: card?.href || '',
          cardImageSrc: card?.querySelector('img')?.currentSrc || card?.querySelector('img')?.src || '',
          cardIndex: cards.indexOf(card),
          chapterOneCardIndex: cards.indexOf(chapterOneCard),
          footerCount: document.querySelectorAll('[data-kaikai-chapter-two-footer]').length,
          footerText: (footer?.textContent || '').trim(),
          footerHref: footer?.href || '',
          cssHref: css?.href || '',
          jsSrc: js?.src || '',
          overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
        };
      }, site);

      const featureToggle = page.locator('.special-feature-nav-toggle');
      await featureToggle.click();
      await page.waitForFunction(() => document.querySelector('.special-feature-nav-toggle')?.getAttribute('aria-expanded') === 'true', null, { timeout: 8000 });
      const caseToggle = page.locator('.special-feature-case-toggle').first();
      await caseToggle.click();
      await page.waitForFunction(() => document.querySelector('.special-feature-case-toggle')?.getAttribute('aria-expanded') === 'true', null, { timeout: 8000 });
      const chapterToggle = page.locator('button[aria-controls="specialFeatureChapterTwoZh"]');
      await chapterToggle.click();
      await page.waitForFunction(() => document.querySelector('button[aria-controls="specialFeatureChapterTwoZh"]')?.getAttribute('aria-expanded') === 'true', null, { timeout: 8000 });
      await page.waitForTimeout(450);
      result.menu = await page.locator('[data-kaikai-chapter-two-root-entry]').evaluate((group) => {
        const children = group.querySelector('.special-feature-prologue-children');
        const rect = children.getBoundingClientRect();
        const style = getComputedStyle(children);
        return {
          expanded: group.querySelector('button')?.getAttribute('aria-expanded') === 'true',
          visible: style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0,
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      });

      await page.locator('[data-kaikai-chapter-two-launch]').screenshot({
        path: `${output}/${language}-${viewportName}-major-launch.png`,
        animations: 'disabled',
        caret: 'hide'
      });
      await page.locator('[data-kaikai-chapter-two-root-entry]').screenshot({
        path: `${output}/${language}-${viewportName}-chapter-two-menu.png`,
        animations: 'disabled',
        caret: 'hide'
      });

      const targetResponse = await context.request.get(site.chapterUrl, { timeout: 60000 });
      const targetHtml = await targetResponse.text();
      result.target = {
        status: targetResponse.status(),
        chapterBrief: targetHtml.includes('id="chapter-brief"'),
        placement: targetHtml.includes('id="placement-spectrum"'),
        harmCases: targetHtml.includes('id="placement-harm-cases"'),
        system: targetHtml.includes('id="system"'),
        witnessesHref: language === 'zh-Hant'
          ? targetHtml.includes('./witnesses/')
          : targetHtml.includes('./witnesses/') || targetHtml.includes('witnesses/'),
        title: targetHtml.includes(site.title)
      };

      const expectedGroupHrefs = [
        site.chapterUrl,
        `${site.chapterUrl}#chapter-brief`,
        `${site.chapterUrl}#placement-spectrum`,
        `${site.chapterUrl}#placement-harm-cases`,
        `${site.chapterUrl}#system`,
        `${site.chapterUrl}witnesses/`
      ];

      result.checks = {
        homepageHttp200: response?.status() === 200,
        localizedLanguage: language === 'zh-Hant' ? result.state.documentLang !== 'zh-Hans' : result.state.documentLang === 'zh-Hans',
        uniqueLaunch: result.state.launchCount === 1,
        localizedLaunch: result.state.launchTitle && result.state.launchSubtitle && result.state.launchEntry && result.state.launchBrief && result.state.launchCases,
        launchStructure: result.state.launchActionCount === 3 && result.state.launchStatCount === 4,
        localizedImage: result.state.launchImageSrc.endsWith(`/${site.image}`) && result.state.cardImageSrc.endsWith(`/${site.image}`),
        imageDecoded: result.state.launchImageWidth >= 1600 && result.state.launchImageHeight >= 900,
        uniqueChapterGroup: result.state.groupCount === 1 && result.state.groupLinkCount === 6,
        localizedMenuCopy: result.state.menuTitle && result.state.fiveMinute && result.state.outOfHome && result.state.harmCases && result.state.responsibility && result.state.witnesses,
        localizedMenuLinks: expectedGroupHrefs.every((href, index) => result.state.groupHrefs[index] === href),
        menuInteraction: result.menu.expanded && result.menu.visible,
        existingGroupsPreserved: result.state.chapterOneGroupCount === 1 && result.state.medicalGroupCount === 1,
        promotedCard: result.state.cardCount === 1 && result.state.cardTitle && result.state.cardAction && result.state.legacyCardCopyAbsent && result.state.cardHref === site.chapterUrl,
        cardFirstAmongChapters: result.state.cardIndex >= 0 && result.state.chapterOneCardIndex >= 0 && result.state.cardIndex < result.state.chapterOneCardIndex,
        footerEntry: result.state.footerCount === 1 && result.state.footerText === site.footer && result.state.footerHref === site.chapterUrl,
        productionAssets: result.state.cssHref.includes('home-kaikai-chapter-two-20260829.css?v=20260829-1') && result.state.jsSrc.includes('home-kaikai-chapter-two-20260829.js?v=20260829-1'),
        targetHttp200: result.target.status === 200,
        targetIsFullChapter: result.target.chapterBrief && result.target.placement && result.target.harmCases && result.target.system && result.target.title,
        noHorizontalOverflow: result.state.overflow <= 2,
        noPageErrors: pageErrors.length === 0,
        noSameOriginHttpErrors: sameOriginHttpErrors.length === 0,
        noSameOriginRequestFailures: sameOriginRequestFailures.length === 0
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

const lines = ['# Kaikai Chapter 2 major homepage publication browser verification', ''];
for (const result of results) {
  lines.push(`## ${result.language} · ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  lines.push(`- Launch: count=${result.state?.launchCount ?? 'n/a'}, actions=${result.state?.launchActionCount ?? 'n/a'}, stats=${result.state?.launchStatCount ?? 'n/a'}, image=${result.state?.launchImageWidth ?? 'n/a'}×${result.state?.launchImageHeight ?? 'n/a'}`);
  lines.push(`- Menu: links=${result.state?.groupLinkCount ?? 'n/a'}, expanded=${result.menu?.expanded ?? 'n/a'}, visible=${result.menu?.visible ?? 'n/a'}`);
  lines.push(`- Card order: Chapter 2=${result.state?.cardIndex ?? 'n/a'}, Chapter 1=${result.state?.chapterOneCardIndex ?? 'n/a'}`);
  lines.push(`- Target: HTTP=${result.target?.status ?? 'n/a'}, brief=${result.target?.chapterBrief ?? 'n/a'}, placement=${result.target?.placement ?? 'n/a'}, cases=${result.target?.harmCases ?? 'n/a'}`);
  lines.push(`- Overflow=${result.state?.overflow ?? 'n/a'}px; pageErrors=${result.pageErrors.length}; HTTP=${result.sameOriginHttpErrors.length}; requests=${result.sameOriginRequestFailures.length}`);
  const failedChecks = Object.entries(result.checks || {}).filter(([, value]) => !value).map(([key]) => key);
  lines.push(`- Failed checks: ${failedChecks.length ? failedChecks.join(', ') : 'none'}`);
  if (result.exception) lines.push(`- Exception: ${result.exception.split('\n')[0]}`);
  lines.push('');
}
fs.writeFileSync(`${output}/summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
