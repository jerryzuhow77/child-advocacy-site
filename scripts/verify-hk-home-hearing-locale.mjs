import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const hansGuard = "location.hostname==='cn.globalprotectionwall.com'||new URLSearchParams(location.search).get('lang')==='zh-Hans'||document.documentElement.lang.toLowerCase().includes('hans')";
const cards = [
  ['court-schedule-cleanup-script', 'court-poster-chen-shangjie-20261106'],
  ['liu-zongxin-home-hearing-card-script', 'court-poster-liu-zongxin-20261022'],
  ['liangping-jiajia-home-hearing-card-script', 'court-poster-jiajia-20261007'],
];

for (const [id, poster] of cards) {
  const match = index.match(new RegExp(`<script id="${id}">([\\s\\S]*?)<\\/script>`));
  assert.ok(match, `missing ${id}`);
  const script = match[1];
  assert.ok(script.includes(`const hans=${hansGuard};`), `${id} must treat the Hong Kong hostname as zh-Hans`);
  assert.ok(script.includes(`${poster}-zh-Hant.svg`), `${id} must retain its zh-Hant poster`);
  assert.ok(script.includes(`${poster}-zh-Hans.svg`), `${id} must select its zh-Hans poster`);
  assert.match(script, /\/zh-Hans\//, `${id} must include its zh-Hans route`);
}

console.log(`Verified Hong Kong zh-Hans rendering guard for ${cards.length} homepage hearing cards.`);
