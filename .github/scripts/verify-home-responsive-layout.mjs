import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const playwrightModule = process.env.PLAYWRIGHT_MODULE || 'playwright-core';
const { chromium } = require(playwrightModule);

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8765/';
const parsedBaseUrl = new URL(baseUrl);
const outputDir = process.env.QA_OUTPUT || path.resolve('browser-validation/home-responsive-layout');
const widths = process.env.QA_WIDTHS
  ? process.env.QA_WIDTHS.split(',').map(Number).filter(Number.isFinite)
  : [390, 760, 761, 1024, 1180, 1440];
const failures = [];
const reports = [];

await fs.mkdir(outputDir, { recursive: true });

function assert(condition, message, details = undefined) {
  if (condition) return;
  failures.push(details === undefined ? message : `${message}: ${JSON.stringify(details)}`);
}

async function captureSection(page, selector, destination) {
  const visible = await page.evaluate((targetSelector) => {
    const element = document.querySelector(targetSelector);
    if (!element) return false;
    element.scrollIntoView({ block: 'start' });
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }, selector);
  if (!visible) throw new Error(`Cannot capture ${selector}`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: destination, fullPage: false, animations: 'disabled', timeout: 30_000 });
}

const launchOptions = { headless: true };
if (process.env.CHROME_PATH) launchOptions.executablePath = process.env.CHROME_PATH;
const browser = await chromium.launch(launchOptions);

try {
  for (const width of widths) {
    console.log(`[${width}] loading`);
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
      colorScheme: 'light',
      locale: 'zh-TW',
      reducedMotion: 'no-preference',
      // Audit the current release directly instead of letting an installing
      // PWA worker contend with or substitute resources during the run.
      serviceWorkers: 'block'
    });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { configurable: true, get: () => false });
      Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, get: () => 8 });
      Object.defineProperty(navigator, 'deviceMemory', { configurable: true, get: () => 8 });
      window.addEventListener('error', (event) => {
        console.error(`[window-error] ${event.message} @ ${event.filename || 'inline'}:${event.lineno || 0}:${event.colno || 0}`);
      });
    });

    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const sameOriginResourceErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.stack || error.message));
    page.on('response', (response) => {
      try {
        if (new URL(response.url()).origin === parsedBaseUrl.origin && response.status() >= 400) {
          sameOriginResourceErrors.push(`${response.status()} ${response.url()}`);
        }
      } catch (_) {}
    });
    page.on('requestfailed', (request) => {
      try {
        // Browsers routinely cancel an off-screen video range request while
        // the audit scrolls between sections; that is not a missing asset.
        if (request.resourceType() === 'media' && request.failure()?.errorText === 'net::ERR_ABORTED') return;
        if (new URL(request.url()).origin === parsedBaseUrl.origin) {
          sameOriginResourceErrors.push(`${request.failure()?.errorText || 'request failed'} ${request.url()}`);
        }
      } catch (_) {}
    });

    await page.route('**/*', async (route) => {
      const requestUrl = route.request().url();
      if (/global-protection.*(?:view-count|page-views)|counterapi\.com/i.test(requestUrl)) {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ count: 0, value: 0, views: 0 }) });
        return;
      }
      if (parsedBaseUrl.hostname !== 'jerryzuhow77.github.io' && requestUrl.startsWith('https://jerryzuhow77.github.io/child-advocacy-site/')) {
        const localUrl = new URL(requestUrl.slice('https://jerryzuhow77.github.io/child-advocacy-site/'.length), baseUrl).href;
        try {
          const response = await route.fetch({ url: localUrl });
          await route.fulfill({ response });
        } catch {
          await route.abort();
        }
        return;
      }
      const candidate = new URL(requestUrl);
      if (candidate.origin === parsedBaseUrl.origin && parsedBaseUrl.pathname === '/' && candidate.pathname.startsWith('/child-advocacy-site/')) {
        const localUrl = new URL(candidate.pathname.slice('/child-advocacy-site/'.length) + candidate.search, baseUrl).href;
        try {
          const response = await route.fetch({ url: localUrl });
          await route.fulfill({ response });
        } catch {
          await route.abort();
        }
        return;
      }
      const requestOrigin = new URL(requestUrl).origin;
      if (requestOrigin !== new URL(baseUrl).origin && !requestUrl.startsWith('data:')) {
        await route.abort();
        return;
      }
      await route.continue();
    });

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await page.waitForFunction(() => document.querySelectorAll('#home-media-reports .home-media-report-card').length >= 8, undefined, { timeout: 15_000 });
    await page.waitForSelector('.home-post-engagement', { timeout: 8_000 }).catch(() => {});
    // The production rail now autoplays. Stop it and normalize the starting
    // position before deterministic button/progress assertions.
    await page.evaluate(() => {
      const section = document.getElementById('home-media-reports');
      section?.dispatchEvent(new MouseEvent('mouseenter'));
      section?.querySelector('.home-media-report-viewport')?.scrollTo({ left: 0, behavior: 'auto' });
    });
    // The homepage intentionally animates section entry; scrolling through the DOM
    // avoids Playwright's "stable element" actionability wait racing that motion.
    await page.evaluate(() => document.getElementById('home-media-reports')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(1_700);
    console.log(`[${width}] auditing layout`);

    const initial = await page.evaluate((currentWidth) => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
      };
      const rectData = (element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      };
      const canonical = (href) => {
        const url = new URL(href, location.href);
        return `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/(?:index\.html)?$/, '/')}`.toLowerCase();
      };
      const roleSelectors = {
        news: '#home-media-reports .home-media-report-card a.home-media-report-action',
        pinned: '#news-flash .home-pinned-reports-track .home-pinned-report-card',
        recent: '#news-flash .home-document-disc-orbit .home-document-disc-card',
        activity: '#news-activity a.home-activity-feature'
      };
      const roleLinks = Object.fromEntries(Object.entries(roleSelectors).map(([role, selector]) => [
        role,
        [...document.querySelectorAll(selector)].map((link) => canonical(link.href))
      ]));
      const duplicates = [];
      const roles = Object.keys(roleLinks);
      for (let left = 0; left < roles.length; left += 1) {
        for (let right = left + 1; right < roles.length; right += 1) {
          const shared = [...new Set(roleLinks[roles[left]].filter((href) => roleLinks[roles[right]].includes(href)))];
          shared.forEach((href) => duplicates.push({ roles: [roles[left], roles[right]], href }));
        }
      }

      const toolbar = document.getElementById('cpa-four-language-toolbar');
      const mobileFooter = document.querySelector('.home-footer-mobile-bar');
      const mobileFooterStyle = mobileFooter ? getComputedStyle(mobileFooter) : null;
      const mediaViewport = document.querySelector('#home-media-reports .home-media-report-viewport');
      const mediaCards = [...document.querySelectorAll('#home-media-reports .home-media-report-card')];
      const viewportRect = mediaViewport.getBoundingClientRect();
      const visibleMediaCards = mediaCards.filter((card) => {
        const rect = card.getBoundingClientRect();
        return Math.min(rect.right, viewportRect.right) - Math.max(rect.left, viewportRect.left) >= 18;
      }).length;

      const bars = [...document.querySelectorAll('.home-post-engagement')].filter(visible);
      const barResults = bars.map((bar) => {
        const stats = [...bar.children].filter((child) => child.classList.contains('home-post-stat') && visible(child));
        const tops = [...new Set(stats.map((stat) => stat.offsetTop))];
        const widths = stats.map((stat) => stat.offsetWidth);
        const heights = stats.map((stat) => stat.offsetHeight);
        const icons = stats.flatMap((stat) => [...stat.querySelectorAll('.home-post-stat-icon')]).map(rectData);
        return {
          historical: Boolean(bar.closest('#home-historical-cases')),
          stats: stats.length,
          rows: tops.length,
          minWidth: widths.length ? Math.min(...widths) : 0,
          minHeight: heights.length ? Math.min(...heights) : 0,
          maxIconWidth: icons.length ? Math.max(...icons.map((icon) => icon.width)) : 0,
          maxIconHeight: icons.length ? Math.max(...icons.map((icon) => icon.height)) : 0
        };
      });

      const ratioSelectors = [
        '#home-media-reports .home-media-visual',
        '#news-flash .home-pinned-report-card>img',
        '#home-special-features .home-crafted-art',
        '.home-social-cases-section .home-case-reel-media',
        '#news-hearing-notes .home-hearing-ten-day-grid>a>img',
        '#home-historical-cases .home-historical-image',
        ...(currentWidth < 1100 ? ['#home-historical-cases .home-history-static-map>img'] : [])
      ];
      const ratios = ratioSelectors.flatMap((selector) => [...document.querySelectorAll(selector)]).filter(visible).map((element) => {
        const rect = element.getBoundingClientRect();
        return { selector: element.matches('img') ? 'img' : element.className, ratio: rect.width / rect.height, width: rect.width, height: rect.height };
      });

      const railSelectors = [
        '#home-media-reports .home-media-report-viewport',
        '#news-flash .home-pinned-reports-viewport',
        '#home-special-features .home-special-grid',
        '.home-social-cases-section .home-case-reel'
      ];
      const rails = railSelectors.map((selector) => {
        const element = document.querySelector(selector);
        return { selector, exists: Boolean(element), overflow: element ? element.scrollWidth - element.clientWidth : 0, overflowX: element ? getComputedStyle(element).overflowX : '' };
      });
      const controlSizes = [...document.querySelectorAll('#news-flash .home-pinned-arrow, #home-special-features .home-special-scroll-controls button')]
        .filter(visible)
        .map((element) => ({ className: element.className, ...rectData(element) }));
      const pinnedDots = [...document.querySelectorAll('#news-flash .home-pinned-dot')]
        .filter(visible)
        .map(rectData);
      const socialEngagementContainment = [...document.querySelectorAll('.home-social-cases-section .home-case-reel-card')].map((card) => {
        const bar = card.querySelector(':scope > .home-post-engagement');
        if (!bar) return { exists: false };
        const cardRect = card.getBoundingClientRect();
        const barRect = bar.getBoundingClientRect();
        return { exists: true, left: barRect.left - cardRect.left, right: cardRect.right - barRect.right };
      });
      const historicalGrid = document.querySelector('#home-historical-cases .home-historical-grid');
      const historicalStyle = historicalGrid ? getComputedStyle(historicalGrid) : null;
      const criticalThumbnailSources = [...document.querySelectorAll('a[href*="critical-seventeen-days"] img')]
        .map((image) => image.getAttribute('src') || '');

      return {
        width: currentWidth,
        order: {
          media: document.getElementById('home-media-reports')?.getBoundingClientRect().top,
          latest: document.getElementById('news-flash')?.getBoundingClientRect().top
        },
        counts: {
          media: mediaCards.length,
          pinned: document.querySelectorAll('#news-flash .home-pinned-reports-track .home-pinned-report-card').length,
          recent: document.querySelectorAll('#news-flash .home-document-disc-orbit .home-document-disc-card').length,
          seasonal: document.querySelectorAll('section[data-seasonal-art]').length,
          engagement: bars.length
        },
        duplicates,
        visibleTextArtifacts: {
          escapedNewline: document.body.innerText.includes('\\\\n'),
          encodedSpace: document.body.innerHTML.toLowerCase().includes('&#x20;')
        },
        hearing: {
          includesCountdownSeventeen: [...document.querySelectorAll('#news-hearing, #news-hearing-notes')]
            .some((section) => section.innerText.includes('倒數十七天')),
          criticalCardCount: document.querySelectorAll('#news-hearing .is-critical-seventeen-days, #news-hearing-notes .is-critical-seventeen-days').length
        },
        footerArticleCount: document.querySelectorAll('footer article').length,
        mobileFooter: {
          exists: Boolean(mobileFooter),
          display: mobileFooterStyle?.display || '',
          background: mobileFooterStyle?.backgroundColor || '',
          visibleLinks: mobileFooter ? [...mobileFooter.querySelectorAll('a')].filter(visible).length : 0,
          height: mobileFooter?.getBoundingClientRect().height || 0
        },
        toolbarPresent: Boolean(toolbar),
        toolbarHidden: !toolbar || !visible(toolbar),
        criticalThumbnailSources,
        media: {
          overflow: mediaViewport.scrollWidth - mediaViewport.clientWidth,
          visibleCards: visibleMediaCards,
          progress: Boolean(document.querySelector('#home-media-reports .home-media-report-progress')),
          previousDisabled: Boolean(document.querySelector('[data-home-media-direction="-1"]')?.disabled),
          nextDisabled: Boolean(document.querySelector('[data-home-media-direction="1"]')?.disabled)
        },
        barResults,
        ratios,
        rails,
        controlSizes,
        pinnedDots,
        socialEngagementContainment,
        historical: {
          display: historicalStyle?.display || '',
          columns: historicalStyle?.gridTemplateColumns || '',
          overflow: historicalGrid ? historicalGrid.scrollWidth - historicalGrid.clientWidth : 0,
          overflowX: historicalStyle?.overflowX || '',
          height: historicalGrid?.getBoundingClientRect().height || 0
        },
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      };
    }, width);

    assert(initial.order.media < initial.order.latest, `[${width}] 新聞專區必須位於最新快報之前`, initial.order);
    assert(initial.counts.media >= 8, `[${width}] 新聞專區文章數不足`, initial.counts.media);
    assert(initial.counts.pinned === 13, `[${width}] 置頂入口數量應為 13`, initial.counts.pinned);
    assert(initial.counts.recent === 7, `[${width}] 摩天輪近期文章數量應為 7`, initial.counts.recent);
    assert(initial.counts.seasonal === 17, `[${width}] 秋季水墨專區數量應為 17`, initial.counts.seasonal);
    assert(initial.counts.engagement >= 45, `[${width}] 互動控制列未完整建立`, initial.counts.engagement);
    assert(initial.duplicates.length === 0, `[${width}] 新聞／置頂／近期／活動角色仍有重複`, initial.duplicates);
    assert(!initial.visibleTextArtifacts.escapedNewline && !initial.visibleTextArtifacts.encodedSpace, `[${width}] 畫面仍有 \\n 或 &#x20; 文字殘留`, initial.visibleTextArtifacts);
    assert(!initial.hearing.includesCountdownSeventeen && initial.hearing.criticalCardCount === 0, `[${width}] 開庭資訊仍混入倒數十七天`, initial.hearing);
    assert(initial.footerArticleCount === 0, `[${width}] 網頁底端仍有置底文章專區`, initial.footerArticleCount);
    if (width <= 760) {
      assert(initial.mobileFooter.exists && initial.mobileFooter.display === 'grid', `[${width}] 手機底部導覽不存在`, initial.mobileFooter);
      assert(initial.mobileFooter.visibleLinks === 5, `[${width}] 手機底部導覽不是五個可見入口`, initial.mobileFooter);
      assert(initial.mobileFooter.height >= 60, `[${width}] 手機底部導覽過矮`, initial.mobileFooter);
      assert(!/^rgba?\(0, 0, 0(?:, 0)?\)$/.test(initial.mobileFooter.background), `[${width}] 手機底部導覽背景透明`, initial.mobileFooter);
    }
    assert(!initial.toolbarPresent && initial.toolbarHidden, `[${width}] 頂端語言工具列未從首頁移除`);
    assert(initial.criticalThumbnailSources.length >= 3
      && initial.criticalThumbnailSources.every((source) => /critical-seventeen-days-20260904\.webp(?:\?|$)/.test(source))
      && initial.criticalThumbnailSources.every((source) => !/chen-shangjie-hearing/i.test(source)),
    `[${width}] 倒數十七天仍使用錯誤開庭縮圖`, initial.criticalThumbnailSources);
    assert(initial.media.overflow > 100, `[${width}] 新聞專區沒有可橫向移動的內容`, initial.media);
    assert(initial.media.visibleCards >= 2, `[${width}] 新聞專區沒有露出下一張卡片`, initial.media);
    assert(initial.media.progress, `[${width}] 新聞滑軌缺少進度提示`);
    assert(initial.media.previousDisabled && !initial.media.nextDisabled, `[${width}] 新聞初始箭頭狀態錯誤`, initial.media);
    assert(initial.horizontalOverflow <= 2, `[${width}] 整頁出現非預期水平溢位`, initial.horizontalOverflow);

    initial.rails.forEach((rail) => {
      assert(rail.exists, `[${width}] 缺少橫向專區 ${rail.selector}`);
      assert(rail.overflow > 40, `[${width}] 專區不可水平瀏覽 ${rail.selector}`, rail);
      assert(['auto', 'scroll'].includes(rail.overflowX), `[${width}] 專區 overflow-x 設定錯誤 ${rail.selector}`, rail);
    });
    initial.ratios.forEach((item) => {
      assert(Math.abs(item.ratio - 1.6) <= 0.055, `[${width}] 縮圖不是穩定 16:10`, item);
    });
    initial.controlSizes.forEach((control) => {
      assert(control.width >= 43.5 && control.height >= 43.5, `[${width}] 置頂／專題滑軌控制小於 44px`, control);
    });
    initial.pinnedDots.forEach((dot, index) => {
      assert(dot.width >= 23.5 && dot.height >= 43.5, `[${width}] 第 ${index + 1} 個置頂分頁觸控區過小`, dot);
    });
    initial.socialEngagementContainment.forEach((bar, index) => {
      assert(bar.exists && bar.left >= -1 && bar.right >= -1, `[${width}] 第 ${index + 1} 張社會案件互動列遭裁切`, bar);
    });
    if (width <= 760) {
      assert(initial.historical.display === 'flex' && initial.historical.overflow > 40 && ['auto', 'scroll'].includes(initial.historical.overflowX), `[${width}] 歷史案件手機滑軌錯誤`, initial.historical);
    } else {
      assert(initial.historical.display === 'grid', `[${width}] 歷史案件桌機／平板網格錯誤`, initial.historical);
      assert(initial.historical.height < 3200, `[${width}] 歷史案件專區異常過長`, initial.historical);
    }
    initial.barResults.forEach((bar, index) => {
      const expectedRows = width >= 1100 && !bar.historical ? 1 : 2;
      assert(bar.stats === 4, `[${width}] 第 ${index + 1} 個互動列不是四個功能`, bar);
      assert(bar.rows === expectedRows, `[${width}] 第 ${index + 1} 個互動列斷行錯誤`, bar);
      assert(bar.minHeight >= (width <= 760 ? 43.5 : 39.5), `[${width}] 第 ${index + 1} 個互動按鈕過矮`, bar);
      assert(bar.minWidth >= 39.5, `[${width}] 第 ${index + 1} 個互動按鈕過窄`, bar);
      assert(bar.maxIconWidth <= 30 && bar.maxIconHeight <= 30, `[${width}] 偵測到巨大眼睛／圖示`, bar);
    });

    const mediaBefore = await page.locator('#home-media-reports .home-media-report-viewport').evaluate((element) => element.scrollLeft);
    await page.evaluate(() => document.querySelector('[data-home-media-direction="1"]')?.click());
    await page.waitForTimeout(650);
    const mediaAfter = await page.locator('#home-media-reports .home-media-report-viewport').evaluate((element) => element.scrollLeft);
    assert(mediaAfter > mediaBefore + 30, `[${width}] 新聞下一則按鈕沒有移動滑軌`, { mediaBefore, mediaAfter });
    await page.locator('#home-media-reports .home-media-report-viewport').evaluate((element) => {
      element.scrollTo({ left: element.scrollWidth, behavior: 'auto' });
    });
    await page.waitForTimeout(260);
    const mediaEnd = await page.evaluate(() => ({
      current: Number(document.querySelector('#home-media-reports .home-media-report-progress b')?.textContent || 0),
      nextDisabled: Boolean(document.querySelector('#home-media-reports [data-home-media-direction="1"]')?.disabled)
    }));
    assert(mediaEnd.current === initial.counts.media && mediaEnd.nextDisabled, `[${width}] 新聞滑軌終點進度或按鈕狀態錯誤`, mediaEnd);
    await page.locator('#home-media-reports .home-media-report-viewport').evaluate((element) => element.scrollTo({ left: 0, behavior: 'auto' }));
    await page.waitForTimeout(80);

    const mobile = width <= 760;
    if (!mobile) {
      await page.evaluate(() => {
        const control = document.querySelector('#news-flash .home-disc-motion-control');
        if (control?.getAttribute('aria-pressed') === 'false') control.click();
      });
      await page.waitForTimeout(80);
    }
    const ferrisBefore = await page.evaluate((isMobile) => {
      const orbit = document.querySelector('#news-flash .home-document-disc-orbit');
      const first = orbit?.querySelector('.home-document-disc-card');
      return isMobile ? orbit?.scrollLeft : getComputedStyle(first).transform;
    }, mobile);
    const ferrisLayout = await page.evaluate(() => {
      const orbit = document.querySelector('#news-flash .home-document-disc-orbit');
      const card = orbit?.querySelector('.home-document-disc-card');
      const motion = document.querySelector('#news-flash .home-disc-motion-control');
      const shell = document.querySelector('#news-flash [data-document-disc]');
      const previous = document.querySelector('#news-flash [data-disc-prev]');
      const next = document.querySelector('#news-flash [data-disc-next]');
      const shellRect = shell?.getBoundingClientRect();
      const previousRect = previous?.getBoundingClientRect();
      const nextRect = next?.getBoundingClientRect();
      const cardsInside = shellRect
        ? [...document.querySelectorAll('#news-flash .home-document-disc-card')].every((item) => {
            const rect = item.getBoundingClientRect();
            return rect.top >= shellRect.top - 2 && rect.bottom <= shellRect.bottom + 2 && rect.left >= shellRect.left - 2 && rect.right <= shellRect.right + 2;
          })
        : false;
      return {
        cardPosition: card ? getComputedStyle(card).position : '',
        orbitPosition: orbit ? getComputedStyle(orbit).position : '',
        motionExists: Boolean(motion),
        motionDisplay: motion ? getComputedStyle(motion).display : '',
        controlsSeparated: !shellRect || !previousRect || !nextRect
          ? false
          : previousRect.right < shellRect.left + shellRect.width / 2 && nextRect.left > shellRect.left + shellRect.width / 2,
        cardsInside
      };
    });
    assert(ferrisLayout.motionExists, `[${width}] 摩天輪缺少自動播放控制`, ferrisLayout);
    assert(mobile ? ferrisLayout.cardPosition === 'relative' : ferrisLayout.cardPosition === 'absolute', `[${width}] 摩天輪車廂定位模式錯誤`, ferrisLayout);
    assert(mobile ? ferrisLayout.orbitPosition === 'relative' : ferrisLayout.orbitPosition === 'absolute', `[${width}] 摩天輪軌道定位模式錯誤`, ferrisLayout);
    assert(mobile ? ferrisLayout.motionDisplay === 'none' : ferrisLayout.motionDisplay !== 'none', `[${width}] 摩天輪播放控制顯示狀態錯誤`, ferrisLayout);
    if (mobile) assert(ferrisLayout.controlsSeparated, `[${width}] 摩天輪左右控制重疊`, ferrisLayout);
    if (!mobile) assert(ferrisLayout.cardsInside, `[${width}] 摩天輪車廂超出外框`, ferrisLayout);
    const ferrisNextExists = await page.locator('#news-flash [data-disc-next]').count();
    assert(ferrisNextExists === 1, `[${width}] 摩天輪缺少下一則控制`, ferrisNextExists);
    await page.evaluate(() => document.querySelector('#news-flash [data-disc-next]')?.click());
    await page.waitForTimeout(700);
    const ferrisAfter = await page.evaluate((isMobile) => {
      const orbit = document.querySelector('#news-flash .home-document-disc-orbit');
      const first = orbit?.querySelector('.home-document-disc-card');
      return isMobile ? orbit?.scrollLeft : getComputedStyle(first).transform;
    }, mobile);
    assert(mobile ? ferrisAfter > ferrisBefore + 20 : ferrisAfter !== ferrisBefore, `[${width}] 摩天輪控制沒有產生移動`, { ferrisBefore, ferrisAfter });

    console.log(`[${width}] capturing sections`);
    try {
      await captureSection(page, '#home-media-reports', path.join(outputDir, `news-${width}.png`));
      await captureSection(page, '#news-hearing-notes', path.join(outputDir, `hearing-${width}.png`));
      if ([390, 761, 1180].includes(width)) {
        await captureSection(page, '#news-hearing-notes .home-hearing-ten-day-grid', path.join(outputDir, `hearing-days-${width}.png`));
        await captureSection(page, '#kaikai-memorial-20260908', path.join(outputDir, `memorial-${width}.png`));
        await captureSection(page, '#news-flash [data-document-disc]', path.join(outputDir, `ferris-${width}.png`));
        await captureSection(page, '#home-special-features', path.join(outputDir, `special-${width}.png`));
        await captureSection(page, '.home-social-cases-section', path.join(outputDir, `cases-${width}.png`));
      }
    } catch (error) {
      assert(false, `[${width}] 視覺截圖失敗`, error.message);
    }

    // Motion behavior has been proven above. Pause decorative timelines before
    // the full 17-section traversal so visual QA measures layout instead of
    // spending its time repainting off-screen ornaments.
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.gsap?.globalTimeline?.pause?.();
      window.ScrollTrigger?.getAll?.().forEach((trigger) => trigger.disable(false));
      document.querySelector('[data-pinned-reports]')?.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
      document.querySelector('[data-home-activity-shell]')?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      const freeze = document.createElement('style');
      freeze.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
      document.head.appendChild(freeze);
    });

    console.log(`[${width}] revealing seasonal artwork`);
    for (let index = 0; index < 17; index += 1) {
      await page.evaluate((sectionIndex) => {
        const section = document.querySelectorAll('section[data-seasonal-art]')[sectionIndex];
        section?.scrollIntoView({ block: 'center' });
      }, index);
      await page.waitForTimeout(110);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    const seasonal = await page.evaluate(() => {
      const sections = [...document.querySelectorAll('section[data-seasonal-art]')];
      return sections.map((section) => ({
        id: section.dataset.seasonalArt,
        ready: section.classList.contains('is-seasonal-art-ready'),
        active: getComputedStyle(section).getPropertyValue('--cpa-section-art-active').trim(),
        source: getComputedStyle(section).getPropertyValue('--cpa-section-art').trim()
      }));
    });
    const seasonalSources = seasonal.map((item) => item.source).filter(Boolean);
    assert(seasonal.every((item) => item.ready && item.active && item.active !== 'none'), `[${width}] 水墨背景未永久載入`, seasonal.filter((item) => !item.ready || !item.active || item.active === 'none'));
    assert(new Set(seasonalSources).size === 17, `[${width}] 17 個專區沒有使用 17 張不同背景`, seasonalSources);

    const heightSpreads = await page.evaluate(() => {
      const groups = {
        news: '#home-media-reports .home-media-report-card',
        pinned: '#news-flash .home-pinned-report-card',
        special: '#home-special-features .home-crafted-card',
        cases: '.home-social-cases-section .home-case-reel-card'
      };
      return Object.fromEntries(Object.entries(groups).map(([name, selector]) => {
        const heights = [...document.querySelectorAll(selector)].map((element) => element.getBoundingClientRect().height).filter(Boolean);
        return [name, { count: heights.length, spread: heights.length ? Math.max(...heights) - Math.min(...heights) : 0 }];
      }));
    });
    Object.entries(heightSpreads).forEach(([name, result]) => assert(result.spread <= 8, `[${width}] ${name} 卡片高度不一致`, result));

    assert(pageErrors.length === 0, `[${width}] 首頁 JavaScript 執行錯誤`, pageErrors);
    const unexpectedConsoleErrors = consoleErrors.filter((message) => message !== 'Failed to load resource: net::ERR_FAILED');
    assert(unexpectedConsoleErrors.length === 0, `[${width}] 首頁主控台錯誤`, unexpectedConsoleErrors);
    assert(sameOriginResourceErrors.length === 0, `[${width}] 首頁本機資源載入失敗`, sameOriginResourceErrors);
    reports.push({ width, initial, mediaMove: { before: mediaBefore, after: mediaAfter }, ferrisMove: { before: ferrisBefore, after: ferrisAfter }, ferrisLayout, seasonal, heightSpreads, consoleErrors, unexpectedConsoleErrors, sameOriginResourceErrors, pageErrors });
    await context.close();
    console.log(`[${width}] complete`);
  }
} finally {
  await browser.close();
}

const report = { baseUrl, generatedAt: new Date().toISOString(), widths, failures, reports };
await fs.writeFile(path.join(outputDir, 'report.json'), JSON.stringify(report, null, 2));

if (failures.length) {
  console.error(`Home responsive regression failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Home responsive regression passed at ${widths.join(', ')}px.`);
  console.log(`Artifacts: ${outputDir}`);
}
