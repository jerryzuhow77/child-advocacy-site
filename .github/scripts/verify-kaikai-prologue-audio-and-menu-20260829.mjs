import { chromium } from 'playwright-core';
import fs from 'node:fs';

const output = 'browser-validation/prologue-audio-and-menu';
fs.mkdirSync(output, { recursive: true });

const sites = {
  'zh-Hant': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/',
    majorSummary: '家外安置大篇章',
    prompt: '播放序幕與配樂',
    blockedNote: '請點擊啟動配樂'
  },
  'zh-Hans': {
    url: 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/',
    majorSummary: '家外安置大篇章',
    prompt: '播放序幕与配乐',
    blockedNote: '请点击启动配乐'
  }
};

const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 }
};

function attachDiagnostics(page, pageErrors, sameOriginErrors, requestFailures) {
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
}

async function waitForOverlay(page) {
  await page.waitForSelector('[data-entry-prologue]', { state: 'visible', timeout: 15000 });
  await page.waitForSelector('#chapterBgm', { state: 'attached', timeout: 15000 });
  await page.waitForFunction(() => {
    const video = document.querySelector('[data-prologue-video]');
    return video instanceof HTMLVideoElement && video.readyState >= 2;
  }, null, { timeout: 30000 });
}

async function closeOverlayWithSkip(page) {
  const skip = page.locator('[data-prologue-skip]');
  await skip.click();
  await page.waitForFunction(() => {
    const overlay = document.querySelector('[data-entry-prologue]');
    return !overlay || overlay.hidden || getComputedStyle(overlay).display === 'none';
  }, null, { timeout: 10000 });
  await page.waitForTimeout(250);
}

async function inspectMenu(page, expected, viewportName) {
  const menuButton = page.locator('#menuButton');
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await page.waitForFunction(() => {
      const nav = document.getElementById('siteNav');
      return nav && getComputedStyle(nav).display !== 'none';
    }, null, { timeout: 5000 });
  }
  const summary = page.locator('#siteNav .nav-group-major summary');
  await summary.waitFor({ state: 'visible', timeout: 10000 });
  const group = page.locator('#siteNav .nav-group-major');
  if (!(await group.evaluate((element) => element.hasAttribute('open')))) await summary.click();
  await page.waitForFunction(() => document.querySelector('#siteNav .nav-group-major')?.hasAttribute('open'), null, { timeout: 5000 });
  const state = await summary.evaluate((node, expectedSummary) => {
    const before = getComputedStyle(node, '::before');
    const nav = document.getElementById('siteNav');
    return {
      text: (node.textContent || '').trim(),
      containsNew: /\bNEW\b/i.test(node.textContent || ''),
      pseudoContent: before.content,
      pseudoDisplay: before.display,
      groupCount: document.querySelectorAll('#siteNav .nav-group-major').length,
      linkCount: node.closest('.nav-group-major')?.querySelectorAll('.nav-submenu a').length || 0,
      expectedSummary: (node.textContent || '').trim() === expectedSummary,
      navOverflow: Math.max(0, (nav?.scrollWidth || 0) - (nav?.clientWidth || 0)),
      pageOverflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
    };
  }, expected.majorSummary);
  await group.screenshot({
    path: `${output}/${expected.language || 'page'}-${viewportName}-menu-without-new.png`,
    animations: 'disabled',
    caret: 'hide'
  });
  return state;
}

const results = [];
let failed = false;

// First verify the requested immediate behavior in a browser profile that permits
// audible autoplay. This proves the page attempts and succeeds in starting the
// webpage music while the muted prologue is already visible.
const autoBrowser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required']
});

for (const [language, site] of Object.entries(sites)) {
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const context = await autoBrowser.newContext({
      viewport,
      locale: language === 'zh-Hant' ? 'zh-TW' : 'zh-CN',
      colorScheme: 'light',
      reducedMotion: 'no-preference'
    });
    const page = await context.newPage();
    const pageErrors = [];
    const sameOriginErrors = [];
    const requestFailures = [];
    attachDiagnostics(page, pageErrors, sameOriginErrors, requestFailures);
    const result = {
      mode: 'autoplay-permitted',
      language,
      viewport: viewportName,
      dimensions: viewport,
      checks: {},
      prologue: null,
      afterClose: null,
      menu: null,
      pageErrors,
      sameOriginErrors,
      requestFailures,
      passed: false
    };
    results.push(result);

    try {
      const response = await page.goto(`${site.url}?qa=audio-auto-${Date.now()}-${language}-${viewportName}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await waitForOverlay(page);
      await page.waitForFunction(() => {
        const audio = document.getElementById('chapterBgm');
        const video = document.querySelector('[data-prologue-video]');
        return audio instanceof HTMLAudioElement
          && video instanceof HTMLVideoElement
          && !audio.paused
          && audio.currentTime > 0.12
          && !video.paused
          && video.muted;
      }, null, { timeout: 15000 });
      await page.waitForTimeout(350);

      result.prologue = await page.evaluate(() => {
        const overlay = document.querySelector('[data-entry-prologue]');
        const video = document.querySelector('[data-prologue-video]');
        const audio = document.getElementById('chapterBgm');
        const prompt = document.querySelector('[data-prologue-play]');
        return {
          overlayVisible: Boolean(overlay && !overlay.hidden && getComputedStyle(overlay).display !== 'none'),
          videoPlaying: Boolean(video && !video.paused),
          videoMuted: Boolean(video?.muted),
          videoTime: Number(video?.currentTime || 0),
          audioPlaying: Boolean(audio && !audio.paused),
          audioTime: Number(audio?.currentTime || 0),
          audioMuted: Boolean(audio?.muted),
          autoplayState: audio?.dataset.prologueAutoplay || '',
          preload: audio?.preload || '',
          promptHidden: Boolean(prompt?.hidden),
          overlayBlocked: Boolean(overlay?.classList.contains('is-audio-blocked')),
          cssHref: document.querySelector('link[href*="final-chapter.css"]')?.href || '',
          jsSrc: document.querySelector('script[src*="final-chapter.js"]')?.src || '',
          overflow: Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)
        };
      });
      await page.locator('[data-entry-prologue]').screenshot({
        path: `${output}/${language}-${viewportName}-prologue-with-auto-music.png`,
        animations: 'disabled',
        caret: 'hide'
      });

      if (language === 'zh-Hant' && viewportName === 'desktop') {
        await page.waitForFunction(() => {
          const overlay = document.querySelector('[data-entry-prologue]');
          return !overlay || overlay.hidden || getComputedStyle(overlay).display === 'none';
        }, null, { timeout: 12000 });
      } else {
        await closeOverlayWithSkip(page);
      }
      result.afterClose = await page.evaluate(() => {
        const overlay = document.querySelector('[data-entry-prologue]');
        const audio = document.getElementById('chapterBgm');
        return {
          overlayClosed: Boolean(!overlay || overlay.hidden || getComputedStyle(overlay).display === 'none'),
          audioContinues: Boolean(audio && !audio.paused && audio.currentTime > 0.2),
          audioTime: Number(audio?.currentTime || 0)
        };
      });

      result.menu = await inspectMenu(page, { ...site, language }, viewportName);
      result.checks = {
        http200: response?.status() === 200,
        musicStartsWithPrologue: result.prologue.overlayVisible
          && result.prologue.videoPlaying
          && result.prologue.videoMuted
          && result.prologue.audioPlaying
          && !result.prologue.audioMuted
          && result.prologue.audioTime > 0.12
          && result.prologue.autoplayState === 'playing',
        audioPreloaded: result.prologue.preload === 'auto',
        noUnneededPrompt: result.prologue.promptHidden && !result.prologue.overlayBlocked,
        musicContinuesIntoPage: result.afterClose.overlayClosed && result.afterClose.audioContinues,
        newTextRemoved: result.menu.expectedSummary
          && !result.menu.containsNew
          && ['none', 'normal', '""'].includes(result.menu.pseudoContent)
          && result.menu.pseudoDisplay === 'none',
        majorMenuPreserved: result.menu.groupCount === 1 && result.menu.linkCount === 7,
        currentAssets: /final-chapter\.css\?v=20260829-\d+/.test(result.prologue.cssHref)
          && /final-chapter\.js\?v=20260829-\d+/.test(result.prologue.jsSrc),
        noHorizontalOverflow: result.prologue.overflow <= 2 && result.menu.pageOverflow <= 2 && result.menu.navOverflow <= 2,
        noPageErrors: pageErrors.length === 0,
        noSameOriginErrors: sameOriginErrors.length === 0,
        noRelevantRequestFailures: requestFailures.length === 0
      };
      result.passed = Object.values(result.checks).every(Boolean);
      if (!result.passed) failed = true;
    } catch (error) {
      result.exception = String(error?.stack || error);
      failed = true;
      await page.screenshot({ path: `${output}/${language}-${viewportName}-auto-exception.png`, fullPage: false }).catch(() => {});
    }
    await context.close();
  }
}
await autoBrowser.close();

// Then force the first AUDIO play() call to reject until a real pointer gesture.
// This checks the standards-compliant fallback required by Chrome autoplay policy.
const fallbackBrowser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

for (const [language, site] of Object.entries(sites)) {
  const context = await fallbackBrowser.newContext({
    viewport: viewports.mobile,
    locale: language === 'zh-Hant' ? 'zh-TW' : 'zh-CN',
    colorScheme: 'light',
    reducedMotion: 'no-preference'
  });
  await context.addInitScript(() => {
    const nativePlay = HTMLMediaElement.prototype.play;
    let audioUnlocked = false;
    document.addEventListener('pointerdown', () => { audioUnlocked = true; }, { capture: true, once: true });
    document.addEventListener('keydown', () => { audioUnlocked = true; }, { capture: true, once: true });
    HTMLMediaElement.prototype.play = function patchedPlay(...args) {
      if (this instanceof HTMLAudioElement && !audioUnlocked) {
        return Promise.reject(new DOMException('Forced autoplay-policy test', 'NotAllowedError'));
      }
      return nativePlay.apply(this, args);
    };
  });
  const page = await context.newPage();
  const pageErrors = [];
  const sameOriginErrors = [];
  const requestFailures = [];
  attachDiagnostics(page, pageErrors, sameOriginErrors, requestFailures);
  const result = {
    mode: 'autoplay-blocked-fallback',
    language,
    viewport: 'mobile',
    dimensions: viewports.mobile,
    checks: {},
    beforeGesture: null,
    afterGesture: null,
    afterClose: null,
    pageErrors,
    sameOriginErrors,
    requestFailures,
    passed: false
  };
  results.push(result);

  try {
    const response = await page.goto(`${site.url}?qa=audio-blocked-${Date.now()}-${language}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await waitForOverlay(page);
    await page.waitForFunction(() => {
      const overlay = document.querySelector('[data-entry-prologue]');
      const button = document.querySelector('[data-prologue-play]');
      const audio = document.getElementById('chapterBgm');
      return overlay?.classList.contains('is-audio-blocked')
        && button instanceof HTMLButtonElement
        && !button.hidden
        && audio?.dataset.prologueAutoplay === 'blocked';
    }, null, { timeout: 12000 });

    result.beforeGesture = await page.evaluate((expected) => {
      const overlay = document.querySelector('[data-entry-prologue]');
      const video = document.querySelector('[data-prologue-video]');
      const audio = document.getElementById('chapterBgm');
      const prompt = document.querySelector('[data-prologue-play]');
      const after = getComputedStyle(document.querySelector('.entry-prologue__copy span'), '::after');
      return {
        promptVisible: Boolean(prompt && !prompt.hidden && getComputedStyle(prompt).display !== 'none'),
        promptText: (prompt?.textContent || '').replace('▶', '').trim(),
        promptAria: prompt?.getAttribute('aria-label') || '',
        blockedClass: Boolean(overlay?.classList.contains('is-audio-blocked')),
        blockedNote: after.content || '',
        audioPaused: Boolean(audio?.paused),
        audioState: audio?.dataset.prologueAutoplay || '',
        videoPlaying: Boolean(video && !video.paused),
        videoMuted: Boolean(video?.muted),
        expectedPrompt: expected.prompt,
        expectedNote: expected.blockedNote
      };
    }, site);
    await page.locator('[data-entry-prologue]').screenshot({
      path: `${output}/${language}-mobile-autoplay-blocked-prompt.png`,
      animations: 'disabled',
      caret: 'hide'
    });

    await page.locator('[data-prologue-play]').click();
    await page.waitForFunction(() => {
      const audio = document.getElementById('chapterBgm');
      const video = document.querySelector('[data-prologue-video]');
      const button = document.querySelector('[data-prologue-play]');
      return audio && !audio.paused && audio.currentTime > 0.1
        && video && !video.paused && video.currentTime < 2
        && button?.hidden;
    }, null, { timeout: 12000 });
    result.afterGesture = await page.evaluate(() => {
      const overlay = document.querySelector('[data-entry-prologue]');
      const video = document.querySelector('[data-prologue-video]');
      const audio = document.getElementById('chapterBgm');
      const prompt = document.querySelector('[data-prologue-play]');
      return {
        audioPlaying: Boolean(audio && !audio.paused),
        audioTime: Number(audio?.currentTime || 0),
        audioState: audio?.dataset.prologueAutoplay || '',
        videoPlaying: Boolean(video && !video.paused),
        videoTime: Number(video?.currentTime || 0),
        promptHidden: Boolean(prompt?.hidden),
        blockedClassRemoved: Boolean(!overlay?.classList.contains('is-audio-blocked'))
      };
    });

    await closeOverlayWithSkip(page);
    result.afterClose = await page.evaluate(() => {
      const audio = document.getElementById('chapterBgm');
      return { audioContinues: Boolean(audio && !audio.paused && audio.currentTime > 0.15) };
    });

    result.checks = {
      http200: response?.status() === 200,
      policyFallbackVisible: result.beforeGesture.promptVisible
        && result.beforeGesture.promptText === site.prompt
        && result.beforeGesture.promptAria === site.prompt
        && result.beforeGesture.blockedClass
        && result.beforeGesture.blockedNote.includes(site.blockedNote)
        && result.beforeGesture.audioPaused
        && result.beforeGesture.audioState === 'blocked'
        && result.beforeGesture.videoPlaying
        && result.beforeGesture.videoMuted,
      gestureStartsBoth: result.afterGesture.audioPlaying
        && result.afterGesture.audioTime > 0.1
        && result.afterGesture.audioState === 'playing'
        && result.afterGesture.videoPlaying
        && result.afterGesture.videoTime < 2
        && result.afterGesture.promptHidden
        && result.afterGesture.blockedClassRemoved,
      musicContinuesAfterEntry: result.afterClose.audioContinues,
      noPageErrors: pageErrors.length === 0,
      noSameOriginErrors: sameOriginErrors.length === 0,
      noRelevantRequestFailures: requestFailures.length === 0
    };
    result.passed = Object.values(result.checks).every(Boolean);
    if (!result.passed) failed = true;
  } catch (error) {
    result.exception = String(error?.stack || error);
    failed = true;
    await page.screenshot({ path: `${output}/${language}-fallback-exception.png`, fullPage: false }).catch(() => {});
  }
  await context.close();
}
await fallbackBrowser.close();

fs.writeFileSync(`${output}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
const lines = ['# Kaikai prologue audio and main-menu label browser verification', ''];
for (const result of results) {
  lines.push(`## ${result.mode} · ${result.language} · ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  if (result.mode === 'autoplay-permitted') {
    lines.push(`- Prologue: video=${result.prologue?.videoPlaying ?? 'n/a'} muted=${result.prologue?.videoMuted ?? 'n/a'}; audio=${result.prologue?.audioPlaying ?? 'n/a'} time=${result.prologue?.audioTime?.toFixed?.(2) ?? 'n/a'}s`);
    lines.push(`- Menu: text=${result.menu?.text ?? 'n/a'}; pseudo=${result.menu?.pseudoContent ?? 'n/a'} / ${result.menu?.pseudoDisplay ?? 'n/a'}; links=${result.menu?.linkCount ?? 'n/a'}`);
  } else {
    lines.push(`- Before gesture: prompt=${result.beforeGesture?.promptText ?? 'n/a'}; audio=${result.beforeGesture?.audioState ?? 'n/a'}; video=${result.beforeGesture?.videoPlaying ?? 'n/a'}`);
    lines.push(`- After gesture: audio=${result.afterGesture?.audioPlaying ?? 'n/a'}; video=${result.afterGesture?.videoPlaying ?? 'n/a'}; continued=${result.afterClose?.audioContinues ?? 'n/a'}`);
  }
  lines.push(`- Errors: page=${result.pageErrors.length}; HTTP=${result.sameOriginErrors.length}; requests=${result.requestFailures.length}`);
  const failedChecks = Object.entries(result.checks || {}).filter(([, value]) => !value).map(([key]) => key);
  lines.push(`- Failed checks: ${failedChecks.length ? failedChecks.join(', ') : 'none'}`);
  if (result.exception) lines.push(`- Exception: ${result.exception.split('\n')[0]}`);
  lines.push('');
}
fs.writeFileSync(`${output}/summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (failed) process.exit(1);
