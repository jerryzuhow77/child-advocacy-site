import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const toolbarUrl = new URL('../../assets/four-language-toolbar-20260901.js', import.meta.url);
const toolbarSource = fs.readFileSync(toolbarUrl, 'utf8');

const instrumentedToolbarSource = toolbarSource.replace(
  '  async function init(){',
  '  window.__testLanguageUrl=languageUrl;\n  async function init(){',
);

function simulateRedirect({ href, declaredLanguage, savedLanguage = '', browserLanguages = ['en'], source = toolbarSource }) {
  const current = new URL(href);
  const storage = new Map(savedLanguage ? [['siteLang', savedLanguage]] : []);
  let replacement = null;
  const location = {
    hostname: current.hostname,
    pathname: current.pathname,
    search: current.search,
    href: current.href,
    replace(value) { replacement = String(value); },
  };
  const localStorage = {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
  };
  const document = {
    documentElement: { lang: declaredLanguage, dataset: {} },
    querySelector() { return null; },
    readyState: 'loading',
    addEventListener() {},
  };
  const window = {};

  vm.runInNewContext(source, {
    AbortController,
    URL,
    URLSearchParams,
    clearTimeout,
    console,
    document,
    fetch,
    localStorage,
    location,
    navigator: { language: browserLanguages[0] || '', languages: browserLanguages },
    setTimeout,
    window,
  });

  return { replacement, savedLanguage: storage.get('siteLang') || '', languageUrl: window.__testLanguageUrl };
}

const english = simulateRedirect({
  href: 'https://jerryzuhow77.github.io/child-advocacy-site/en/features/example/',
  declaredLanguage: 'en',
  savedLanguage: 'zh-Hans',
  browserLanguages: ['zh-CN'],
});
assert.equal(english.replacement, null, 'A physical English page must override stale Simplified preference.');
assert.equal(english.savedLanguage, 'en', 'The Taiwan origin must remember the physical English locale.');

const japanese = simulateRedirect({
  href: 'https://jerryzuhow77.github.io/child-advocacy-site/ja/features/example/',
  declaredLanguage: 'ja',
  savedLanguage: 'zh-Hans',
  browserLanguages: ['zh-CN'],
});
assert.equal(japanese.replacement, null, 'A physical Japanese page must override stale Simplified preference.');
assert.equal(japanese.savedLanguage, 'ja', 'The Taiwan origin must remember the physical Japanese locale.');

const trailingEnglish = simulateRedirect({
  href: 'https://jerryzuhow77.github.io/child-advocacy-site/features/social-observation/guarantor-status/en/',
  declaredLanguage: 'en',
  savedLanguage: 'zh-Hans',
  browserLanguages: ['zh-CN'],
});
assert.equal(trailingEnglish.replacement, null, 'A trailing physical English edition must override stale Simplified preference.');
assert.equal(trailingEnglish.savedLanguage, 'en', 'A trailing English edition must refresh Taiwan-origin storage.');

const traditionalSelection = simulateRedirect({
  href: 'https://jerryzuhow77.github.io/child-advocacy-site/features/example/?lang=zh-Hant',
  declaredLanguage: 'zh-Hant',
  savedLanguage: 'zh-Hans',
  browserLanguages: ['zh-CN'],
});
assert.equal(traditionalSelection.replacement, null, 'An explicit Traditional selection must not bounce to Hong Kong.');
assert.equal(traditionalSelection.savedLanguage, 'zh-Hant', 'The explicit Traditional selection must replace stale Taiwan-origin storage.');

const storedSimplified = simulateRedirect({
  href: 'https://jerryzuhow77.github.io/child-advocacy-site/features/example/',
  declaredLanguage: 'zh-Hant',
  savedLanguage: 'zh-Hans',
});
assert.equal(
  storedSimplified.replacement,
  'https://cn.globalprotectionwall.com/child-advocacy-site/features/example/?lang=zh-Hans',
  'An ordinary Traditional route must keep the existing saved-preference mirror redirect.',
);

const hongKongRuntime = simulateRedirect({
  href: 'https://cn.globalprotectionwall.com/child-advocacy-site/zh-Hans/features/example/',
  declaredLanguage: 'zh-Hans',
  source: instrumentedToolbarSource,
});
assert.equal(typeof hongKongRuntime.languageUrl, 'function', 'The routing helper must be available to the regression harness.');
for (const [language, route] of [
  ['zh-Hant', '/child-advocacy-site/features/example/'],
  ['en', '/child-advocacy-site/en/features/example/'],
  ['ja', '/child-advocacy-site/ja/features/example/'],
]) {
  assert.equal(
    hongKongRuntime.languageUrl(language, route),
    `https://jerryzuhow77.github.io${route}`,
    `${language} root-relative manifest destinations must resolve against Taiwan.`,
  );
}
assert.equal(
  hongKongRuntime.languageUrl('en', null),
  'https://jerryzuhow77.github.io/child-advocacy-site/en/',
  'The English fallback must leave the Hong Kong host.',
);

assert.match(
  toolbarSource,
  /location\.hostname===HK_MIRROR_HOST&&target\.hostname===TW_SITE_HOST\)target\.searchParams\.set\('lang',language\)/,
  'Hong Kong-to-Taiwan toolbar navigation must carry an explicit locale hint.',
);
assert.match(
  toolbarSource,
  /"zh-Hant":TW_SITE_BASE,"zh-Hans":HK_SITE_BASE,en:TW_SITE_BASE\+"en\/",ja:TW_SITE_BASE\+"ja\/"/,
  'Fallback toolbar destinations must leave the Hong Kong host for non-Simplified editions.',
);

console.log('Four-language cross-origin routing regression checks passed.');
