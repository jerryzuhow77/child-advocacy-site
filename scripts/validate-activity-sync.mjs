import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const pages = [
  {
    label: 'zh-Hant / zh-Hans',
    activity: 'activity-records/index.html',
    home: 'index.html',
    about: 'about/index.html'
  },
  {
    label: 'English',
    activity: 'en/activity-records/index.html',
    home: 'en/index.html',
    about: 'en/about/index.html'
  },
  {
    label: 'Japanese',
    activity: 'ja/activity-records/index.html',
    home: 'ja/index.html',
    about: 'ja/about/index.html'
  }
];

function read(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8');
}

function activityIds(html) {
  const ids = new Set();
  for (const match of html.matchAll(/href="(?:\.\.\/|\.\/)?(?:activity-records\/)?(20\d{6}-[a-z0-9-]+)\//gi)) {
    ids.add(match[1]);
  }
  return [...ids];
}

const errors = [];

for (const page of pages) {
  const activityHtml = read(page.activity);
  const homeHtml = read(page.home);
  const aboutHtml = read(page.about);
  const ids = activityIds(activityHtml);

  if (!ids.length) errors.push(`${page.label}: no activity records were found in ${page.activity}`);

  for (const id of ids) {
    if (!homeHtml.includes(id)) errors.push(`${page.label}: ${id} is missing from ${page.home}`);
    if (!aboutHtml.includes(id)) errors.push(`${page.label}: ${id} is missing from ${page.about}`);
  }
}

const sourceHtml = read('activity-records/index.html');
const sequences = [...sourceHtml.matchAll(/data-public-action-sequence="(\d+)"/g)].map(match => Number(match[1]));
const latestPublicAction = sequences.length ? Math.max(...sequences) : null;

if (latestPublicAction === null) {
  errors.push('No data-public-action-sequence value was found in activity-records/index.html');
} else {
  for (const page of pages) {
    for (const target of [page.home, page.about]) {
      const html = read(target);
      const block = html.match(/data-impact-total="public-action"[\s\S]{0,500}?data-count="(\d+)"/);
      const displayedTotal = block ? Number(block[1]) : null;
      if (displayedTotal !== latestPublicAction) {
        errors.push(`${page.label}: ${target} shows ${displayedTotal ?? 'no'} public-action total; expected ${latestPublicAction}`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Activity-impact synchronization failed:\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Activity-impact synchronization passed for ${pages.length} language routes and ${latestPublicAction} public actions.`);
}
