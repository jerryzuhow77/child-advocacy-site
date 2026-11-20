import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const taiwanPage = read('news/index.html');
const hongKongPage = read('news/zh-Hans/index.html');
const script = read('assets/news-desk-20260903.js');
const styles = read('assets/news-desk-20260903.css');

for (const marker of ['news-hub-v2', 'newsFeatured', 'newsSearch', 'newsLoadMore']) {
  assert.match(taiwanPage, new RegExp(marker), `Taiwan news hub is missing ${marker}`);
  assert.match(hongKongPage, new RegExp(marker), `Hong Kong news hub is missing ${marker}`);
}
assert.match(taiwanPage, /tel:113/);
assert.match(taiwanPage, /tel:110/);
assert.match(hongKongPage, /tel:23432255/);
assert.match(hongKongPage, /tel:999/);
assert.match(styles, /\.news-hub-v2 \.news-grid\{display:grid/);
assert.match(styles, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
assert.match(styles, /\.news-hub-v2 \.news-card\{[^}]*flex-direction:column/);
assert.match(script, /const batchSize = 12/);

const objectStart = script.indexOf('const reports = ');
const objectEnd = script.indexOf('\n  const localeCopy', objectStart);
assert.notEqual(objectStart, -1, 'Report data start was not found');
assert.notEqual(objectEnd, -1, 'Report data end was not found');
const objectLiteral = script
  .slice(objectStart + 'const reports = '.length, objectEnd)
  .trim()
  .replace(/;$/, '');
const reports = vm.runInNewContext(`(${objectLiteral})`, { ROOT: '/child-advocacy-site/' });
const items = Object.values(reports);
assert.ok(items.length >= 40, `Expected a substantial news archive, found ${items.length}`);

const categoryFor = (item, language) => {
  const text = `${item.publisher?.[language] || ''} ${item.title?.[language] || ''}`.toLowerCase();
  if (/活動|活动|行動|行动|倡議|倡议|聲明|声明|抗議|抗议|展覽|展览|募款|campaign|advocacy|rally|protest|statement|exhibition/.test(text)) return 'action';
  if (/法庭|法院|司法|裁判|裁定|判決|開庭|審理|上訴|訴訟|案件|hearing|court|trial|ruling|appeal|法廷|裁判|審理|事件/.test(text)) return 'case';
  if (/制度|政策|治理|監督|修法|法案|法規|權益|稽核|社工|安置|托育|policy|governance|law|rights|reform|制度|政策|監督|法改正/.test(text)) return 'policy';
  return 'safety';
};

const routeToFile = (route) => {
  const pathname = route.startsWith('http') ? new URL(route).pathname : route;
  const prefix = '/child-advocacy-site/';
  if (!pathname.startsWith(prefix)) return null;
  const relative = pathname.slice(prefix.length);
  return path.join(root, relative, pathname.endsWith('/') ? 'index.html' : '');
};

for (const language of ['zh-Hant', 'zh-Hans']) {
  const localized = items
    .filter((item) => !item.languages || item.languages.includes(language))
    .sort((a, b) => Date.parse(`${b.date}T12:00:00+08:00`) - Date.parse(`${a.date}T12:00:00+08:00`) || a.priority - b.priority);
  const counts = { case: 0, policy: 0, safety: 0, action: 0 };
  for (const item of localized) {
    for (const key of ['title', 'summary', 'publisher', 'alt']) {
      assert.ok(item[key]?.[language], `${language} report ${item.date} is missing ${key}`);
    }
    counts[categoryFor(item, language)] += 1;
  }
  for (const [category, count] of Object.entries(counts)) {
    assert.ok(count > 0, `${language} has no reports in ${category}`);
  }
  for (const item of localized.slice(0, 12)) {
    const route = typeof item.article === 'string' ? item.article : item.article[language];
    const target = routeToFile(route);
    assert.ok(target && fs.existsSync(target), `${language} article route is missing: ${route}`);
  }
  console.log(`${language}: ${localized.length} reports`, counts);
}

console.log('Regional news hub checks passed.');

