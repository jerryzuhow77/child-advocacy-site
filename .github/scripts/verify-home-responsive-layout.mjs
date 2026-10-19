import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const source=await fs.readFile(path.join(root,'index.html'),'utf8');
if(!/^<!DOCTYPE html>/i.test(source)||!source.includes('data-home-layout="20261012-static-v2"')||/Warning: truncated output/.test(source))throw new Error('Incomplete homepage source');
for(const m of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi))if(!/\bsrc\s*=|application\//i.test(m[1]))new vm.Script(m[2]);
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const widths=(process.env.QA_WIDTHS||'320,375,390,768,1024,1440').split(',').map(Number);
const output=path.resolve(process.env.QA_OUTPUT||'browser-validation/home-responsive-layout');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const reports=[],failures=[];
const live=process.env.QA_LIVE==='1';
const assert=(ok,msg)=>{if(!ok)failures.push(msg)};
try{
 for(const region of ['tw','hk'])for(const locale of ['zh-Hant','zh-Hans','en','ja'])for(const width of widths){
  const host=region==='hk'?'cn.globalprotectionwall.com':'jerryzuhow77.github.io';
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:live?'allow':'block',reducedMotion:'reduce'});
  let release;const gate=new Promise(resolve=>release=resolve);
  let blocked=true,loadObserved=false;
  const errors=[];
  await context.route('**/*',async route=>{
   const u=new URL(route.request().url());
   // Both regional origins render the exact checkout; third-party APIs are not a layout dependency.
   if(u.hostname!==host){await route.abort();return;}
   if(!u.pathname.startsWith('/child-advocacy-site/')){await route.abort();return;}
   if(live){
    if(blocked&&['image','script'].includes(route.request().resourceType()))await gate;
    await route.continue();return;
   }
   const rel=decodeURIComponent(u.pathname.slice('/child-advocacy-site/'.length));
   const filename=path.join(root,rel.endsWith('/')||!rel?rel+'index.html':rel);
   if(!filename.startsWith(root+path.sep)){await route.abort();return;}
   try{await fs.access(filename)}catch{errors.push('Missing resource: '+rel);await route.fulfill({status:404,body:'Missing'});return;}
   // Stall images and nonessential scripts: the headline, translation and navigation must remain usable.
   if(blocked&&(route.request().resourceType()==='image'||route.request().resourceType()==='script'))await gate;
   await route.fulfill({path:filename});
  });
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('load',()=>loadObserved=true);
  const homePath='/child-advocacy-site/'+(['en','ja'].includes(locale)?locale+'/':'?lang='+locale);
  await page.goto('https://'+host+homePath,{waitUntil:'commit'});
  await page.waitForFunction(()=>window.__cpaStaticHomeReady===true);
  const early=await page.evaluate(()=>({lang:document.documentElement.lang,lead:document.querySelector('#news-flash h3')?.textContent,nav:document.querySelector('.section-nav')?.getBoundingClientRect().height,languages:document.querySelectorAll('.cpa-language-select option').length}));
  assert(!loadObserved,`${region}/${locale}/${width}: failed to test delayed resources`);
  assert(early.lang===locale,`${region}/${locale}/${width}: locale waits for resource loading`);
  assert(early.lead?.trim().length>0&&early.nav>0&&early.languages===4,`${region}/${locale}/${width}: headline or navigation unavailable before load`);
  blocked=false;release();
  await page.waitForLoadState('load');
  // Decode every restored cover, including images initially below the viewport.
  await page.evaluate(async()=>{const images=[...document.querySelectorAll('main img')];images.forEach(i=>i.loading='eager');await Promise.all(images.map(i=>i.decode().catch(()=>{})));});
  await page.waitForFunction(()=>[...document.querySelectorAll('main img')].every(i=>i.complete));
  await page.waitForTimeout(350);
  if(live){
   const pwa=await page.evaluate(async()=>{
    const registration=await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Deployed PWA did not activate within 45 seconds')),45000))]);
    return {script:registration.active?.scriptURL,caches:await caches.keys()};
   });
   const version=(await fs.readFile(path.join(root,'sw.js'),'utf8')).match(/const VERSION = '([^']+)'/)[1];
   assert(pwa.script?.endsWith('sw.js?v='+version)&&pwa.caches.includes('cpa-alliance-pwa-shell-'+version),`${region}/${locale}/${width}: deployed PWA version/cache mismatch ${JSON.stringify(pwa)}`);
  }
  const inspect=()=>{
   const visible=e=>e&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden'&&Number(getComputedStyle(e).opacity)!==0&&e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0;
   const main=document.querySelector('main');
   return {lang:document.documentElement.lang,width:innerWidth,height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth+1,mainCount:document.querySelectorAll('main').length,h1:document.querySelectorAll('h1').length,pinned:document.querySelectorAll('#news-flash .home-card').length,news:document.querySelectorAll('#home-media-reports .news-card').length,dates:[...document.querySelectorAll('#home-media-reports [data-date]')].map(e=>e.dataset.date),counter:document.querySelectorAll('main [data-home-view-counter]').length,desktopNav:visible(document.querySelector('.primary-nav')),mobileMenu:visible(document.querySelector('.mobile-menu')),legacy:document.querySelectorAll('[data-ink-archived],.home-priority-strip,.home-document-disc-orbit,.home-news-reel').length,sections:[...main.querySelectorAll(':scope>section')].map(e=>({id:e.id,height:Math.round(e.getBoundingClientRect().height)})),anchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>a.hash.length>1&&!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash),externalTopics:[...document.querySelectorAll('a[data-external-topic]')].map(a=>({href:a.href,text:a.textContent})),routes:[...document.querySelectorAll('a[href]')].map(a=>a.href),images:[...main.querySelectorAll('img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),qualifier:document.querySelector('#news-hearing').textContent.includes(({en:'Official court schedule unverified',ja:'公式裁判日程は未確認','zh-Hant':'官方庭期待核','zh-Hans':'官方庭期待核'})[document.documentElement.lang])};
  };
  const report=await page.evaluate(inspect);
  const footerLanguages=await page.locator('.footer-regions a').evaluateAll(links=>links.map(a=>({path:new URL(a.href).pathname,host:new URL(a.href).hostname,label:a.textContent.trim()})));
  assert(footerLanguages.length===4&&footerLanguages[0].host==='jerryzuhow77.github.io'&&footerLanguages[0].path==='/child-advocacy-site/'&&footerLanguages[1].host==='cn.globalprotectionwall.com'&&footerLanguages[1].path==='/child-advocacy-site/'&&footerLanguages[2].path==='/child-advocacy-site/en/'&&footerLanguages[2].label==='English'&&footerLanguages[3].path==='/child-advocacy-site/ja/'&&footerLanguages[3].label==='日本語',`${region}/${locale}/${width}: explicit footer language target mismatch ${JSON.stringify(footerLanguages)}`);
  assert(!report.overflow,`${region}/${locale}/${width}: horizontal overflow`);
  const editorial=await page.evaluate(()=>{const cards=[...document.querySelectorAll('.home-card .card-link,.reading-card,#observation-directory a,.case-card,.case-text-card,.record-list a,.activity-card,.hearing-event,.portal-card,.chapter-card,.history-card,.comic-card,.memorial-card,.social-card,.art-pathways a,.ten-hearing-card')];return{entries:cards.length,missing:cards.filter(a=>!a.querySelector('img')||!a.querySelector('img').naturalWidth).map(a=>a.href),added:[...document.querySelectorAll('[data-home-thumbnail-added]')].filter(a=>!a.closest('#kaikai-ten-hearings')).length,days:[...document.querySelectorAll('[data-hearing-day]')].map(a=>({day:Number(a.dataset.hearingDay),date:a.dataset.date,href:a.href})),seriesHeight:document.querySelector('#kaikai-ten-hearings')?.getBoundingClientRect().height||0,seriesVisible:!!document.querySelector('#kaikai-ten-hearings')&&getComputedStyle(document.querySelector('#kaikai-ten-hearings')).display!=='none'};});
  assert(editorial.entries>=94&&!editorial.missing.length,`${region}/${locale}/${width}: article thumbnail coverage failed ${JSON.stringify(editorial.missing)}`);
  const hearingDates=['2025-04-22','2025-04-23','2025-04-25','2025-04-28','2025-04-29','2025-04-30','2025-05-02','2025-05-05','2025-05-06','2025-05-07'];
  assert(editorial.seriesVisible&&editorial.days.length===10&&editorial.days.every((d,i)=>d.day===i+1&&d.date===hearingDates[i]&&d.href.includes(`kaikai-day${i+1}-`)),`${region}/${locale}/${width}: ten-hearing records are missing, misdated, or out of order`);
  assert(editorial.seriesHeight<(width<=760?1900:1000),`${region}/${locale}/${width}: ten-hearing section is unnecessarily tall`);
  if(source.includes('data-home-ink-edition="20261013-scroll-v1"')){
   const ink=await page.evaluate(()=>({edition:document.body.dataset.homeInkEdition,hero:document.querySelector('.ink-hero-image')?.naturalWidth,portals:document.querySelectorAll('#home-sections .ink-vignette').length,chapters:document.querySelectorAll('.chapter-grid .ink-vignette').length,atlas:document.querySelector('#home-sections .ink-vignette img').currentSrc,film:!!document.querySelector('#home-film .cinema-loop'),heroHasLoop:!!document.querySelector('.ink-scroll-hero .cinema-loop')}));
   const portalArt=await page.locator('#home-sections .ink-vignette img').evaluateAll(imgs=>imgs.map(i=>({src:i.currentSrc,width:i.naturalWidth,height:i.naturalHeight})));
   assert(ink.edition==='20261013-scroll-v1'&&ink.hero>0&&ink.portals===8&&ink.chapters===4&&new Set(portalArt.map(i=>i.src)).size===8&&portalArt.every(i=>/home-ink-[a-z]+-20261013-v2\.webp/.test(i.src)&&i.width>0&&i.height>0)&&ink.film&&!ink.heroHasLoop,`${region}/${locale}/${width}: watercolor imagery or preserved film section missing ${JSON.stringify(ink)}`);
  }
  const media=await page.evaluate(()=>({loopSource:document.querySelector('.cinema-loop')?.getAttribute('src'),filmSource:document.querySelector('.cinema-dialog video')?.getAttribute('src'),poster:document.querySelector('.cinema-poster')?.naturalWidth}));
  assert(!media.loopSource&&!media.filmSource&&media.poster>0,`${region}/${locale}/${width}: reduced-motion poster or deferred full film failed`);
  const artwork=await page.evaluate(()=>{const sections=[...document.querySelector('main').children].filter(e=>e.tagName==='SECTION').map(e=>e.id);const actionFocus=sections.indexOf('october-action-focus');return{cells:[...new Set([...document.querySelectorAll('.ink-vignette:not(:has(.ink-standalone))')].map(e=>Number(e.dataset.inkCell)))].sort(),banners:[...document.querySelectorAll('.ink-section-vignette')].map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,image:e.querySelector('img').naturalWidth})),sections,actionFocus};});
  assert(artwork.cells.join(',')==='0,1,2,3,4,5,6,7'&&artwork.banners.length===4&&artwork.banners.every(e=>e.width>0&&e.height>0&&e.image>0)&&artwork.actionFocus>=0&&artwork.sections[artwork.actionFocus+1]==='home-xuanxuan-followup'&&artwork.sections[artwork.actionFocus+2]==='home-film',`${region}/${locale}/${width}: sixteen paintings or action-focus/film placement incomplete ${JSON.stringify(artwork)}`);
  assert(await page.locator('#home-film .cinema-poster').isVisible(),`${region}/${locale}/${width}: mobile film poster hidden`);
  if(width===390){
   await page.locator('[data-cinema-open]').first().click();
   const expected=locale==='zh-Hans'||(!['zh-Hant','zh-Hans'].includes(locale)&&region==='hk')?'zh-Hans':'zh-Hant';
   assert(await page.locator('.cinema-dialog').isVisible(),`${region}/${locale}: film dialog failed to open`);
   assert((await page.locator('.cinema-dialog video').getAttribute('src')).includes(`kaikai-cinema-${expected}-`),`${region}/${locale}: wrong subtitle edition`);
   await page.locator('[data-cinema-close]').click();
   await page.waitForFunction(()=>!document.querySelector('.cinema-dialog').open&&!document.querySelector('.cinema-dialog video').hasAttribute('src'));
   assert(!await page.locator('.cinema-dialog').isVisible()&&!await page.locator('.cinema-dialog video').getAttribute('src'),`${region}/${locale}: film dialog did not close and unload`);
   await page.locator('#home-film [data-cinema-open]').click();
   assert(await page.locator('.cinema-dialog').isVisible(),`${region}/${locale}: early film button failed`);
   await page.locator('[data-cinema-close]').click();
  }
  if(region==='hk'&&locale==='zh-Hans'&&width===1440&&process.env.QA_SKIP_CODEC_PLAYBACK!=='1'){
   await page.locator('[data-cinema-toggle]').click();
   await page.waitForFunction(()=>document.querySelector('.cinema-loop').currentTime>0);
   assert(await page.locator('[data-cinema-toggle]').textContent()==='暂停动画','Manual animation playback must show the Simplified Chinese pause label');
   await page.locator('[data-cinema-toggle]').click();
   await page.waitForFunction(()=>document.querySelector('.cinema-loop').paused);
  }
  if(region==='hk'&&locale==='zh-Hans'&&width===1440&&process.env.QA_SKIP_CODEC_PLAYBACK==='1')console.log('Local environment: codec playback omitted explicitly; CI runs this check in Google Chrome.');
  assert(report.mainCount===1&&report.h1===1&&report.legacy===0,`${region}/${locale}/${width}: legacy homepage remains in DOM`);
  assert(report.pinned>=3&&report.news>=6&&report.counter===1,`${region}/${locale}/${width}: content or shared counter missing`);
  const newsSource=source.match(/<section\b[^>]*\bid="home-media-reports"[^>]*>([\s\S]*?)<\/section>/)[1];
  const latestDate=[...newsSource.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"/g)].map(m=>m[1]).sort().at(-1);
  assert(report.dates[0]===latestDate,`${region}/${locale}/${width}: latest published story missing`);
  assert(report.dates.every((d,i)=>i===0||d<=report.dates[i-1]),`${region}/${locale}/${width}: news dates out of order`);
  assert(report.qualifier,`${region}/${locale}/${width}: court qualifier missing`);
  assert(report.desktopNav===(width>=1024)&&report.mobileMenu===(width<1024),`${region}/${locale}/${width}: primary navigation not accessible`);
  assert(!report.anchors.length&&!report.images.length&&!errors.length,`${region}/${locale}/${width}: broken anchors, images, or scripts: ${JSON.stringify({anchors:report.anchors,images:report.images,errors})}`);
  // The news feed and observation directory grow with publication. Give each
  // its own bounded row budget instead of raising every viewport's page ceiling.
  const density=await page.evaluate(()=>{
   const section=id=>document.getElementById(id);
   const metrics=(id,selector)=>{
    const e=section(id),cards=[...e.querySelectorAll(selector)];
    const tops=[...new Set(cards.map(c=>Math.round(c.getBoundingClientRect().top)))];
    return {height:e.getBoundingClientRect().height,rows:tops.length,
     headings:[...e.querySelectorAll('.section-heading,.topic-group>h3')].map(h=>h.getBoundingClientRect().height),
     cards:cards.map((c,i)=>({height:c.getBoundingClientRect().height,text:c.textContent.trim().length,kind:c.matches('.topic-group a')?'topic':i===0?'lead':'card',top:Math.round(c.getBoundingClientRect().top)}))};
   };
   return {news:metrics('home-media-reports','.news-card'),
    observations:metrics('home-special-features','.feature-card,.topic-group a'),
    gaps:[...document.querySelector('main').children].filter(e=>e.getBoundingClientRect().height>0)
     .map((e,i,a)=>i?e.getBoundingClientRect().top-a[i-1].getBoundingClientRect().bottom:0)};
  });
  const translationFactor=['en','ja'].includes(locale)?1.6:1;
  for(const [name,group] of Object.entries({news:density.news,observations:density.observations})){
   // The lead news card includes a full-width cover; directory rows are shorter.
   const cardLimit=c=>(c.kind==='topic'?180:c.kind==='lead'?(width<=760?620:1100):name==='news'?460:(width<=760?460:800))*translationFactor;
   assert(group.cards.every(c=>c.text>0&&c.height>0&&c.height<cardLimit(c)),`${region}/${locale}/${width}: ${name} card is empty, hidden, or excessively tall`);
   const rowHeights=new Map();
   for(const c of group.cards)rowHeights.set(c.top,Math.max(rowHeights.get(c.top)||0,c.height));
   // Translated section/group headings wrap independently of article cards.
   assert(group.headings.every(h=>h<260*translationFactor),`${region}/${locale}/${width}: ${name} heading is excessively tall`);
   const headingHeight=group.headings.reduce((a,b)=>a+b,0);
   const spacingBudget=48*(group.headings.length+2);
   assert(group.height<headingHeight+spacingBudget+[...rowHeights.values()].reduce((a,b)=>a+b,0),`${region}/${locale}/${width}: ${name} has excessive internal whitespace`);
  }
  assert(density.gaps.every(g=>g<160),`${region}/${locale}/${width}: excessive gap between homepage sections`);
  const baseline=reports.find(r=>r.region===region&&r.locale==='zh-Hant'&&r.width===width);
  const coreHeight=report.height-density.news.height-density.observations.height;
  // Remove the old feed/directory allocation from the fixed core budget.
  // All other content, including the hearing collection, retains its limits.
  const newEditorialAllowance=editorial.seriesHeight+editorial.added*(width<=760?65:40);
  const coreBudget=baseline?baseline.coreHeight*(width<=760?1.6:1.35):(width<=760?14000:11000)+newEditorialAllowance;
  assert(coreHeight<coreBudget,`${region}/${locale}/${width}: excessive core height ${Math.round(coreHeight)} (budget ${Math.round(coreBudget)})`);
  report.coreHeight=coreHeight;
  report.density=density;
  const collections=await page.evaluate(()=>({portals:document.querySelectorAll('#home-sections .portal-card').length,chapters:document.querySelectorAll('.chapter-grid .chapter-card').length,topics:document.querySelectorAll('#observation-directory a').length,history:document.querySelectorAll('#home-historical-cases .history-card').length,cases:document.querySelectorAll('#home-social-cases a').length,comics:document.querySelectorAll('#home-court-comics .comic-card').length,hidden:['home-sections','case-reading','home-special-features','home-social-cases','home-historical-cases','home-court-comics','home-memorial','social'].filter(id=>{const e=document.getElementById(id);return !e||e.closest('details:not([open])')||getComputedStyle(e).display==='none'||e.getBoundingClientRect().height===0;})}));
  assert(collections.portals===8&&collections.chapters===4&&collections.topics>=19&&collections.history>=8&&collections.cases>=9&&collections.comics===3&&!collections.hidden.length,`${region}/${locale}/${width}: restored collection missing or hidden ${JSON.stringify(collections)}`);
  for(const href of report.routes){const u=new URL(href);if(region==='hk')assert(u.hostname!=='jerryzuhow77.github.io'||['/child-advocacy-site/','/child-advocacy-site/en/','/child-advocacy-site/ja/'].includes(u.pathname)||report.externalTopics.some(a=>a.href===href&&a.text.trim().length>0),`${region}/${locale}/${width}: unintended Taiwan article route ${href}`);if(u.hostname===host&&u.pathname.startsWith('/child-advocacy-site/')){const p=u.pathname.slice('/child-advocacy-site/'.length);try{await fs.access(path.join(root,p.endsWith('/')||!p?p+'index.html':p))}catch{failures.push(`${region}/${locale}/${width}: missing article route ${href}`)}}}
  if(width<1024){await page.locator('.mobile-menu summary').click();assert(await page.locator('.mobile-menu nav').isVisible(),`${region}/${locale}/${width}: mobile menu fails to open`);await page.locator('.mobile-menu nav a[href="#home-media-reports"]').click();assert(!await page.locator('.mobile-menu nav').isVisible(),`${region}/${locale}/${width}: mobile menu fails to close`);}
  await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  const after=await page.evaluate(inspect);
  assert(after.height===report.height&&after.legacy===0,`${region}/${locale}/${width}: scrolling resurrects legacy content`);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:path.join(output,`${region}-${locale}-${width}.jpg`),type:'jpeg',quality:90,fullPage:true,animations:'disabled'});
  reports.push({region,locale,...report,routes:undefined,errors});
  console.log(`${region}/${locale}/${width}: height=${report.height}, no overflow, early locale and navigation ready`);
  await context.close();
 }
}finally{await browser.close();await fs.writeFile(path.join(output,'report.json'),JSON.stringify({reports,failures},null,2));}
if(failures.length)throw new Error(failures.join('\n'));
console.log('All regional homepage checks passed.');

