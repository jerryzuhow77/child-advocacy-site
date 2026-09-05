#!/usr/bin/env node

function localeNeutralPath(path) {
  const parts = String(path || '').split('/').filter(Boolean);
  if (/^(?:en|ja|zh-hant|zh-hans)$/i.test(parts[0] || '')) parts.shift();
  if (/^(?:en|ja|zh-hant|zh-hans)$/i.test(parts[parts.length - 1] || '')) parts.pop();
  return parts.filter((part) => !/^(?:zh-hant|zh-hans)$/i.test(part)).join('/') || 'home';
}

function articleKey(path) {
  return `official-${localeNeutralPath(path)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')}`;
}

const routeGroups = [
  ['news/example', 'news/example/zh-Hans', 'en/news/example', 'ja/news/example'],
  ['features/example', 'features/example/zh-Hans', 'en/features/example', 'ja/features/example'],
  ['historical-cases/regions/example', 'historical-cases/regions/example/zh-Hans', 'en/historical-cases/regions/example', 'ja/historical-cases/regions/example'],
];

for (const routes of routeGroups) {
  const keys = new Set(routes.map(articleKey));
  if (keys.size !== 1) {
    throw new Error(`Four-language routes produced split view keys: ${[...keys].join(', ')}`);
  }
}

console.log(`PASS: ${routeGroups.length} representative article groups share one four-language view key.`);
