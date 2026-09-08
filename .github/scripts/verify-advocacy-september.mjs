import {chromium} from 'playwright-core';
import fs from 'node:fs';
const root='http://127.0.0.1:8765/child-advocacy-site/';
const families=['news/early-warning-audit-20260908/','cases/kaikai/features/guardian-duty-rebuttal/'];
const out='browser-validation/september-advocacy';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const results=[];
try {
  for (const family of families) for (const locale of ['zh-Hant','zh-Hans','en','ja']) for (const width of [360,412,1440]) {
    const path=locale==='zh-Hant'?family:locale==='zh-Hans'?family+'zh-Hans/':locale+'/'+family;
    const context=await browser.newContext({viewport:{width,height:915}});
    // Public engagement writes and cross-site redirects are irrelevant to visual QA.
    await context.route('**/*',route=>new URL(route.request().url()).origin==='http://127.0.0.1:8765'?route.continue():route.abort());
    const page=await context.newPage();
    const record={path,width,failures:[]};results.push(record);
    try {
      const response=await page.goto(root+path,{waitUntil:'networkidle'});
      if(response.status()!==200)record.failures.push('HTTP '+response.status());
      const state=await page.evaluate(()=>({lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth-innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),alternates:[...document.querySelectorAll('link[hreflang]')].map(x=>x.hreflang),nested:!!document.querySelector('.verdict .cpa-article-engagement')}));
      if(state.lang!==locale)record.failures.push('locale');
      if(state.overflow>2)record.failures.push('overflow '+state.overflow);
      if(state.broken.length)record.failures.push('broken images '+state.broken.join(','));
      if(state.nested)record.failures.push('engagement entered comparison grid');
      if(!['zh-Hant','zh-Hans','en','ja'].every(x=>state.alternates.includes(x)))record.failures.push('missing alternate');
      if(family.startsWith('cases/')) {
        const colors=await page.locator('.analysis-row').first().locator('article').evaluateAll(cards=>cards.map(c=>getComputedStyle(c).borderTopColor));
        if(colors.length!==3||new Set(colors).size!==3)record.failures.push('comparison colors');
        const official=page.locator('.analysis-row').first().locator('article').nth(1);
        if(!await official.locator('a[href*="cy.gov.tw"]').count())record.failures.push('Control Yuan citation');
        const anchor=page.locator('a[href="#comparison-title"]').first();
        if(await anchor.count()) {
          await anchor.click();
          const margin=await page.locator('#comparison-title').evaluate(el=>getComputedStyle(el).scrollMarginTop);
          if(parseFloat(margin)<100)record.failures.push('anchor clearance');
        }
      }
      await page.screenshot({path:`${out}/${family.startsWith('news/')?'news':'comparison'}-${locale}-${width}.png`,fullPage:true});
    } catch(error) {record.failures.push(error.message)}
    await context.close();
  }
} finally {await browser.close();fs.writeFileSync(`${out}/report.json`,JSON.stringify(results,null,2))}
console.log(JSON.stringify(results,null,2));
if(results.some(x=>x.failures.length))process.exit(1);
