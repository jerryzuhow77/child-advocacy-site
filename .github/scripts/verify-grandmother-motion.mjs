import { chromium } from 'playwright-core';
import fs from 'node:fs';

const root = 'http://127.0.0.1:8765/child-advocacy-site/';
const outputDir = 'browser-validation/september-advocacy/grandmother-motion';
const widths = [320, 360, 390, 412, 768, 1280];
const locales = [
  { lang: 'zh-Hant', path: 'features/kaikai-grandmother-rescue-barriers/', controls: ['略過動畫', '重播動畫'] },
  { lang: 'zh-Hans', path: 'zh-Hans/features/kaikai-grandmother-rescue-barriers/', controls: ['略过动画', '重播动画'] },
  { lang: 'en', path: 'en/features/kaikai-grandmother-rescue-barriers/', controls: ['Skip animation', 'Replay animation'] },
  { lang: 'ja', path: 'ja/features/kaikai-grandmother-rescue-barriers/', controls: ['アニメーションをスキップ', 'アニメーションを再生'] }
];

fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox']
});
const results = [];

async function keepLocalRequests(context) {
  await context.route('**/*', (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.origin === 'http://127.0.0.1:8765') route.continue();
    else route.abort();
  });
}

function recordFailure(record, message) {
  record.failures.push(message);
}

try {
  for (const locale of locales) {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: width <= 412 ? 844 : 915 } });
      await keepLocalRequests(context);
      const page = await context.newPage();
      const record = { lang: locale.lang, width, failures: [] };
      const runtimeErrors = [];
      results.push(record);

      page.on('pageerror', (error) => runtimeErrors.push(error.message));
      page.on('console', (message) => {
        const text = message.text();
        if (message.type() === 'error' && !text.includes('Failed to load resource: net::ERR_FAILED')) {
          runtimeErrors.push(text);
        }
      });

      try {
        const response = await page.goto(root + locale.path, { waitUntil: 'networkidle' });
        if (!response || response.status() !== 200) recordFailure(record, `HTTP ${response?.status() ?? 'missing'}`);
        await page.locator('html.motion-ready').waitFor({ state: 'attached', timeout: 8_000 });

        const initial = await page.evaluate(() => ({
          lang: document.documentElement.lang,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          stage: Boolean(document.querySelector('.hero-motion-stage')),
          progress: Boolean(document.querySelector('.story-progress')),
          controls: Array.from(document.querySelectorAll('.motion-control')).map((button) => button.textContent.trim()),
          scriptCount: Array.from(document.scripts).filter((script) => script.src.includes('/page-motion.js?v=20260912-1')).length,
          styleCount: Array.from(document.styleSheets).filter((sheet) => sheet.href?.includes('/page.css?v=20260912-7')).length
        }));

        if (initial.lang !== locale.lang) recordFailure(record, `locale ${initial.lang}`);
        if (initial.overflow > 2) recordFailure(record, `initial overflow ${initial.overflow}px`);
        if (!initial.stage || !initial.progress) recordFailure(record, 'motion chrome missing');
        if (JSON.stringify(initial.controls) !== JSON.stringify(locale.controls)) recordFailure(record, `controls ${initial.controls.join(' | ')}`);
        if (initial.scriptCount !== 1 || initial.styleCount !== 1) recordFailure(record, 'versioned motion assets missing or duplicated');

        await page.locator('.motion-control--replay').click();
        await page.waitForTimeout(120);
        const replay = await page.evaluate(() => ({
          opacity: Number(getComputedStyle(document.querySelector('.hero-copy > *')).opacity),
          complete: document.documentElement.classList.contains('motion-intro-complete')
        }));
        if (replay.complete || replay.opacity >= 0.99) recordFailure(record, 'replay did not restart intro');

        await page.locator('.motion-control--skip').click();
        await page.waitForTimeout(80);
        const skipped = await page.evaluate(() => ({
          opacity: Number(getComputedStyle(document.querySelector('.hero-copy > *')).opacity),
          complete: document.documentElement.classList.contains('motion-intro-complete')
        }));
        if (!skipped.complete || skipped.opacity < 0.99) recordFailure(record, 'skip did not complete intro');

        if ((width === 360 && locale.lang !== 'en') || (width === 412 && locale.lang === 'en') || (width === 1280 && locale.lang === 'zh-Hant')) {
          await page.screenshot({ path: `${outputDir}/hero-${locale.lang}-${width}.png`, fullPage: false });
        }

        const sectionCount = await page.locator('.paper > section').count();
        for (let index = 0; index < sectionCount; index += 1) {
          await page.locator('.paper > section').nth(index).scrollIntoViewIfNeeded();
          await page.waitForTimeout(35);
        }
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(1_350);

        const final = await page.evaluate(() => {
          const animated = Array.from(document.querySelectorAll(
            '.paper .section-label, .paper .subsection-label, .qa-grid > *, .aid-flow > *, .timeline > *, .evidence-grid > *, .questions > *, .route-list > *, .chain > *, .change-grid > *, .chapter-next > *, .comparison-table tbody > *, .knowledge-table tbody > *, .missing-evidence tbody > *'
          ));
          const hidden = animated.filter((element) => {
            const style = getComputedStyle(element);
            return style.visibility === 'hidden' || Number(style.opacity) < 0.98;
          }).length;
          const highlights = Array.from(document.querySelectorAll('.fluorescent')).map((mark) => getComputedStyle(mark).backgroundSize);
          const progress = document.querySelector('.story-progress__fill');
          const progressTrack = progress?.parentElement;
          const progressRatio = progress && progressTrack
            ? progress.getBoundingClientRect().width / progressTrack.getBoundingClientRect().width
            : 0;
          const timelineProgress = Number.parseFloat(getComputedStyle(document.querySelector('.timeline')).getPropertyValue('--timeline-progress'));
          return {
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            hidden,
            incompleteHighlights: highlights.filter((size) => !size.startsWith('100%')).length,
            progressRatio,
            timelineProgress
          };
        });

        if (final.overflow > 2) recordFailure(record, `final overflow ${final.overflow}px`);
        if (final.hidden) recordFailure(record, `${final.hidden} animated elements remain hidden`);
        if (final.incompleteHighlights) recordFailure(record, `${final.incompleteHighlights} highlights remain incomplete`);
        if (final.progressRatio < 0.98) recordFailure(record, `reading progress ${final.progressRatio}`);
        if (final.timelineProgress < 0.98) recordFailure(record, `timeline progress ${final.timelineProgress}`);
        if (runtimeErrors.length) recordFailure(record, `runtime: ${runtimeErrors.join(' | ')}`);
      } catch (error) {
        recordFailure(record, error.message);
      }

      await context.close();
    }
  }

  for (const locale of locales) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce'
    });
    await keepLocalRequests(context);
    const page = await context.newPage();
    const record = { lang: locale.lang, mode: 'reduced', failures: [] };
    results.push(record);

    try {
      const response = await page.goto(root + locale.path, { waitUntil: 'networkidle' });
      if (!response || response.status() !== 200) recordFailure(record, `HTTP ${response?.status() ?? 'missing'}`);
      const state = await page.evaluate(() => ({
        reduced: document.documentElement.classList.contains('motion-reduced'),
        ready: document.documentElement.classList.contains('motion-ready'),
        stage: Boolean(document.querySelector('.hero-motion-stage')),
        controls: Boolean(document.querySelector('.motion-controls')),
        progress: Boolean(document.querySelector('.story-progress')),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      }));
      if (!state.reduced || state.ready || state.stage || state.controls || state.progress) recordFailure(record, `reduced-motion state ${JSON.stringify(state)}`);
      if (state.overflow > 2) recordFailure(record, `overflow ${state.overflow}px`);
    } catch (error) {
      recordFailure(record, error.message);
    }

    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 915 } });
    await keepLocalRequests(context);
    const page = await context.newPage();
    const record = { lang: 'zh-Hant', mode: 'print', failures: [] };
    results.push(record);

    try {
      await page.goto(root + locales[0].path, { waitUntil: 'networkidle' });
      await page.locator('html.motion-ready').waitFor({ state: 'attached', timeout: 8_000 });
      await page.locator('.motion-control--skip').click();
      await page.emulateMedia({ media: 'print' });
      const state = await page.evaluate(() => ({
        stage: getComputedStyle(document.querySelector('.hero-motion-stage')).display,
        progress: getComputedStyle(document.querySelector('.story-progress')).display,
        decoration: getComputedStyle(document.querySelector('.fluorescent')).textDecorationLine,
        hiddenSections: Array.from(document.querySelectorAll('.paper > section')).filter((section) => {
          const style = getComputedStyle(section);
          return style.visibility === 'hidden' || Number(style.opacity) < 0.99;
        }).length
      }));
      if (state.stage !== 'none' || state.progress !== 'none') recordFailure(record, 'motion chrome visible in print');
      if (!state.decoration.includes('underline')) recordFailure(record, `print highlight ${state.decoration}`);
      if (state.hiddenSections) recordFailure(record, `${state.hiddenSections} print sections hidden`);
    } catch (error) {
      recordFailure(record, error.message);
    }

    await context.close();
  }
} finally {
  await browser.close();
  fs.writeFileSync(`${outputDir}/report.json`, JSON.stringify(results, null, 2));
}

console.log(JSON.stringify(results, null, 2));
if (results.some((record) => record.failures.length)) process.exit(1);
