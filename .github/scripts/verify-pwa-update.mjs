import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const sw=await fs.readFile(path.join(root,'sw.js'),'utf8');
const version=sw.match(/const VERSION = '([^']+)'/)[1];
const installer=await fs.readFile(path.join(root,'assets/pwa-install.js'),'utf8');
assert(installer.includes(`sw.js?v=${version}'`));
for(const file of ['index.html','en/index.html','ja/index.html'])assert((await fs.readFile(path.join(root,file),'utf8')).includes(`pwa-install.js?v=${version}`),file);
let old=true,offline=false;
const mime={'.js':'application/javascript','.css':'text/css','.html':'text/html','.webmanifest':'application/manifest+json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json'};
const server=http.createServer(async(req,res)=>{
 if(offline){req.socket.destroy();return;}
 try{
  const u=new URL(req.url,'http://localhost');
  if(u.pathname==='/probe.html'){res.setHeader('Content-Type','text/html');res.end(`<html><body>PWA upgrade probe<script src="/assets/pwa-install.js?v=${version}"></script></body></html>`);return;}
  const file=path.resolve(root,'.'+decodeURIComponent(u.pathname));
  if(!file.startsWith(root+path.sep))throw new Error('outside root');
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  res.setHeader('Cache-Control','no-cache');
  let body=await fs.readFile(file);
  if(u.pathname==='/sw.js'&&old)body=Buffer.from(sw.replace(version,'pwa-upgrade-fixture-old'));
  res.end(body);
 }catch{res.statusCode=404;res.end('Missing');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const context=await browser.newContext();
 const page=await context.newPage();
 const origin=`http://127.0.0.1:${server.address().port}`;
 await page.goto(origin+'/probe.html');
 await page.waitForFunction(()=>navigator.serviceWorker.controller);
 await page.waitForFunction(async()=> (await caches.keys()).some(k=>k.endsWith('pwa-upgrade-fixture-old')));
 // The real installer requests the same registration URL; updateViaCache:none
 // must still detect new bytes and activate the new namespace.
 old=false;
 await page.reload();
 await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
 let keys=[];
 for(let attempt=0;attempt<120;attempt++){
  try{keys=await page.evaluate(()=>caches.keys());}catch{await page.waitForLoadState('load');continue;}
  if(keys.includes(`cpa-alliance-pwa-shell-${version}`)&&!keys.some(k=>k.endsWith('pwa-upgrade-fixture-old')))break;
  await page.waitForTimeout(250);
 }
 assert(keys.includes(`cpa-alliance-pwa-shell-${version}`),JSON.stringify({version,keys}));
 assert(!keys.some(k=>k.endsWith('pwa-upgrade-fixture-old')),JSON.stringify(keys));
 // Prime the new thumbnail through the worker, then prove it is available offline.
 const image='/assets/art/childcare-video-preservation-20261019-hero-20261019.jpg?v=20261019h';
 await page.evaluate(async p=>{const i=new Image();i.src=p;await i.decode();},image);
 await page.waitForFunction(async p=>!!(await caches.match(new URL(p,location.href).href)),image);
 offline=true;
 await context.setOffline(true);
 // A distinct URL bypasses the browser image cache; the worker deliberately
 // matches the primed thumbnail while ignoring its query string.
 await page.evaluate(async p=>{const i=new Image();i.src=p+'&offline-probe=1';await i.decode();},image);
 await page.goto(origin+'/not-cached-article/');
 assert((await page.content()).includes('offline')||(await page.content()).includes('離線'));
 console.log(`PWA upgrade passed: old namespace removed, ${version} activated, thumbnail cached, offline fallback preserved.`);
 await context.close();
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
