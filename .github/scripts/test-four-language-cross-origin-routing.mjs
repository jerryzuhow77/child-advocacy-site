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
  '',
  'A missing English edition must be disabled, never silently redirect to the homepage.',
);

assert.match(
  toolbarSource,
  /location\.hostname===HK_MIRROR_HOST&&target\.hostname===TW_SITE_HOST\)target\.searchParams\.set\('lang',language\)/,
  'Hong Kong-to-Taiwan toolbar navigation must carry an explicit locale hint.',
);
for (const language of ['zh-Hant', 'zh-Hans', 'en', 'ja']) {
  assert.equal(hongKongRuntime.languageUrl(language, undefined), '', 'All missing editions remain unavailable.');
}
assert.match(toolbarSource, /routes=manifest\?\.routes\?\.\[route\]\|\|pageAlternateRoutes\(\)/,
  'The manifest must override stale or guessed alternate links for known groups.');

// Validate the generated destinations, including trailing activity editions.
const manifest = JSON.parse(fs.readFileSync(new URL('../../data/four-language-routes.json', import.meta.url), 'utf8'));
for (const [group, editions] of Object.entries(manifest.routes)) {
  for (const [language, href] of Object.entries(editions)) {
    const actual = new URL(hongKongRuntime.languageUrl(language, href));
    assert.equal(actual.hostname, language === 'zh-Hans' ? 'cn.globalprotectionwall.com' : 'jerryzuhow77.github.io',
      `${group}/${language}: wrong regional destination`);
    if (language === 'zh-Hans') {
      assert.equal(new URL(href).hostname, 'cn.globalprotectionwall.com', `${group}: manifest must itself target Hong Kong`);
    }
    const relative = actual.pathname.replace(/^\/child-advocacy-site\//, '').replace(/^\//, '');
    const filename = relative.endsWith('/') || !relative ? relative + 'index.html' : relative;
    assert.ok(fs.existsSync(new URL('../../' + filename, import.meta.url)), `${group}/${language}: missing physical destination`);
  }
}

console.log('Four-language cross-origin routing regression checks passed.');

// October activity metadata must agree with the regional routing manifest.
for (const group of ['news/anti-child-abuse-rally-20261017/',
                     'activity-records/20261022-liu-zongxin-hearing/',
                     'activity-records/20261022-tamsui-fishermans-wharf-advocacy/']) {
  const editions = manifest.routes[group];
  for (const [locale, href] of Object.entries(editions)) {
    const expected = new URL(href, 'https://jerryzuhow77.github.io').href;
    const relative = new URL(expected).pathname.replace('/child-advocacy-site/', '');
    const html = fs.readFileSync(new URL('../../' + relative + 'index.html', import.meta.url), 'utf8');
    const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) =>
      Object.fromEntries([...tag.matchAll(/([\w-]+)=["']([^"']*)["']/g)].map(([, k, v]) => [k, v])));
    const canonicals = links.filter(link => link.rel === 'canonical');
    assert.equal(canonicals.length, 1, `${group}/${locale}: exactly one canonical required`);
    assert.equal(canonicals[0].href, expected, `${group}/${locale}: incorrect canonical`);
    for (const [language, destination] of Object.entries(editions)) {
      assert.equal(links.find(link => link.hreflang === language)?.href,
        new URL(destination, 'https://jerryzuhow77.github.io').href,
        `${group}/${locale}: incorrect ${language} alternate`);
    }
  }
}
console.log('October activity canonical and hreflang checks passed.');
