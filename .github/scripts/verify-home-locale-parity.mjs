import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../../', import.meta.url);
const read = file => fs.readFileSync(new URL(file, root), 'utf8');
const ids = source => [...source.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
const dates = source => [...source.matchAll(/data-date="([^"]+)"/g)].map(m => m[1]);
const original = read('index.html');
for (const locale of ['en', 'ja']) {
  const source = read(`${locale}/index.html`);
  assert.match(source, new RegExp(`<html lang="${locale}"`));
  assert.deepEqual(ids(source), ids(original), `${locale}: a homepage section was omitted or reordered`);
  assert.deepEqual(dates(source), dates(original), `${locale}: news publication dates drifted`);
  assert.equal((source.match(/<main\b/g) || []).length, 1);
  assert.equal((source.match(/<h1\b/g) || []).length, 1);
  assert.match(source, new RegExp(`<option[^>]*selected[^>]*value="/child-advocacy-site/${locale}/"`));
  assert.match(source, /data-cpa-four-language-toolbar-script/);
  assert.ok(!source.includes('home-static-locale-20261012'), 'Chinese converter must not overwrite a translated homepage');
  assert.ok(source.indexOf('window.__cpaStaticHomeReady=true') < source.indexOf('src="/child-advocacy-site/assets/legal-notice.js'), 'Optional scripts must not block homepage readiness');
  for (const m of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\bsrc\s*=|application\//i.test(m[1])) new vm.Script(m[2]);
  }
  for (const m of source.matchAll(/\b(?:href|src)="(\/child-advocacy-site\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    let path = m[1].slice('/child-advocacy-site/'.length);
    if (!path || path.endsWith('/')) path += 'index.html';
    assert.ok(fs.existsSync(new URL(path, root)), `${locale}: missing local resource ${path}`);
  }
}
console.log('English and Japanese homepages preserve all current sections, dates, resources, and executable scripts.');
