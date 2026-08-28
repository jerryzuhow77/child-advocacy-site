import { chromium } from 'playwright-core';
import fs from 'node:fs';

const outputDirectory = 'browser-validation/artifacts';
fs.mkdirSync(outputDirectory, { recursive: true });
const url = 'https://jerryzuhow77.github.io/child-advocacy-site/hearing-records/prison-watch/kaikai-final-chapter/zh-Hans/';
const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 }
};
const sample = '陈尚洁证词矛盾责任访视证据法院判断';

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const results = [];

for (const [name, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({ viewport, locale: 'zh-CN', colorScheme: 'light' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));

  const response = await page.goto(`${url}#witness-conflicts`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForFunction(() => {
    const target = document.getElementById('witness-conflicts');
    if (!target) return false;
    const rect = target.getBoundingClientRect();
    const style = getComputedStyle(target);
    return location.hash === '#witness-conflicts'
      && Number(style.opacity) >= 0.99
      && rect.top < innerHeight
      && rect.bottom > 0;
  }, { timeout: 10000 });
  await page.waitForTimeout(500);

  const checks = await page.evaluate(async (fontSample) => {
    const stylesheets = [...document.querySelectorAll('link[rel="stylesheet"]')].map((node) => node.href);
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const sansLoaded = await document.fonts.load('16px "Noto Sans SC"', fontSample);
    const serifLoaded = await document.fonts.load('32px "Noto Serif SC"', fontSample);
    const allText = document.body.innerText;
    const target = document.getElementById('witness-conflicts');
    const rect = target.getBoundingClientRect();
    return {
      stylesheets,
      sansVariable: rootStyle.getPropertyValue('--sans').trim(),
      serifVariable: rootStyle.getPropertyValue('--serif').trim(),
      bodyFontFamily: bodyStyle.fontFamily,
      sansCheck: document.fonts.check('16px "Noto Sans SC"', fontSample),
      serifCheck: document.fonts.check('32px "Noto Serif SC"', fontSample),
      sansLoadedCount: sansLoaded.length,
      serifLoadedCount: serifLoaded.length,
      replacementCharacters: (allText.match(/\uFFFD/g) || []).length,
      literalSquareCharacters: (allText.match(/□/g) || []).length,
      targetOpacity: Number(getComputedStyle(target).opacity),
      targetTop: Math.round(rect.top),
      targetVisible: rect.top < innerHeight && rect.bottom > 0
    };
  }, sample);

  await page.screenshot({
    path: `${outputDirectory}/zh-Hans_${name}_font-check.png`,
    fullPage: false
  });
  await page.locator('#witness-conflicts').screenshot({
    path: `${outputDirectory}/zh-Hans_${name}_witness-conflicts-full.png`
  });

  const fatal = [];
  if (response?.status() !== 200) fatal.push(`HTTP ${response?.status()}`);
  if (!checks.stylesheets.some((href) => href.includes('Noto+Sans+SC'))) fatal.push('Noto Sans SC stylesheet missing');
  if (!checks.stylesheets.some((href) => href.includes('Noto+Serif+SC'))) fatal.push('Noto Serif SC stylesheet missing');
  if (!checks.sansVariable.includes('Noto Sans SC')) fatal.push(`wrong --sans: ${checks.sansVariable}`);
  if (!checks.serifVariable.includes('Noto Serif SC')) fatal.push(`wrong --serif: ${checks.serifVariable}`);
  if (!checks.bodyFontFamily.includes('Noto Sans SC')) fatal.push(`wrong body font: ${checks.bodyFontFamily}`);
  if (!checks.sansCheck || checks.sansLoadedCount < 1) fatal.push('Noto Sans SC did not load for sample text');
  if (!checks.serifCheck || checks.serifLoadedCount < 1) fatal.push('Noto Serif SC did not load for sample text');
  if (checks.replacementCharacters > 0) fatal.push(`${checks.replacementCharacters} replacement character(s)`);
  if (checks.literalSquareCharacters > 0) fatal.push(`${checks.literalSquareCharacters} literal square character(s)`);
  if (!checks.targetVisible || checks.targetOpacity < 0.99) fatal.push('witness-conflicts not visible after font load');
  if (errors.length) fatal.push(`${errors.length} page error(s)`);

  results.push({ viewport: name, dimensions: viewport, status: response?.status() ?? null, checks, errors, fatal });
  await context.close();
}

await browser.close();
const report = { generatedAt: new Date().toISOString(), sample, results };
fs.writeFileSync(`${outputDirectory}/font-report.json`, JSON.stringify(report, null, 2));

const lines = ['# Kaikai Simplified Chinese font validation', ''];
for (const result of results) {
  lines.push(`## ${result.viewport} (${result.dimensions.width}×${result.dimensions.height})`);
  lines.push(`- HTTP: ${result.status}`);
  lines.push(`- Noto Sans SC: check=${result.checks.sansCheck}, loaded=${result.checks.sansLoadedCount}`);
  lines.push(`- Noto Serif SC: check=${result.checks.serifCheck}, loaded=${result.checks.serifLoadedCount}`);
  lines.push(`- --sans: ${result.checks.sansVariable}`);
  lines.push(`- --serif: ${result.checks.serifVariable}`);
  lines.push(`- target: visible=${result.checks.targetVisible}, opacity=${result.checks.targetOpacity}, top=${result.checks.targetTop}`);
  lines.push(`- replacement/square characters: ${result.checks.replacementCharacters}/${result.checks.literalSquareCharacters}`);
  lines.push(`- fatal: ${result.fatal.length ? result.fatal.join(' | ') : 'none'}`);
  lines.push('');
}
const fatalCount = results.reduce((total, result) => total + result.fatal.length, 0);
lines.push(`**Total fatal checks: ${fatalCount}**`);
fs.writeFileSync(`${outputDirectory}/font-summary.md`, lines.join('\n'));
console.log(lines.join('\n'));
if (fatalCount) process.exit(1);
