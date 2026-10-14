import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||rootNodeModules()]}));
function rootNodeModules(){return path.resolve('node_modules');}
const root=path.resolve(new URL('../',import.meta.url).pathname);
const manifest=JSON.parse(await fs.readFile(path.join(root,'data/four-language-routes.json'),'utf8')).routes;
const groups=(process.argv.length>2?process.argv.slice(2):JSON.parse(await fs.readFile(path.join(root,'scripts/full-locales-routes-20261013.json'),'utf8'))).map(r=>r.replace(/\/?$/,'/'));
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const reports=[],failures=[];
try {
 for(const group of groups)for(const host of ['jerryzuhow77.github.io','cn.globalprotectionwall.com'])for(const [locale,url] of Object.entries(manifest[group]))for(const width of [320,375,390,768,1024,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
  const errors=[];
  await context.route('**/*',async route=>{
   const u=new URL(route.request().url());
   if(!['jerryzuhow77.github.io','cn.globalprotectionwall.com'].includes(u.hostname)||!u.pathname.startsWith('/child-advocacy-site/')){await route.abort();return;}
   const rel=u.pathname.slice('/child-advocacy-site/'.length);
   const file=path.join(root,rel.endsWith('/')?rel+'index.html':rel);
   try{await fs.access(file);await route.fulfill({path:file});}catch{errors.push('missing local resource '+rel);await route.fulfill({status:404,body:'Missing'});}
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const target=new URL(url,'https://'+host);target.host=host;target.searchParams.set('lang',locale);
  await page.goto(target.href,{waitUntil:'load'});
  await page.waitForFunction(()=>document.querySelector('.cpa-language-select'));
  const result=await page.evaluate(async()=>{
   for(const image of document.images)image.loading='eager';
   await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
   return {lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth>innerWidth+1,offenders:[...document.querySelectorAll('main *,header *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).slice(0,12).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.slice(0,100),right:e.getBoundingClientRect().right})),images:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),options:[...document.querySelectorAll('.cpa-language-select option')].map(o=>({value:o.value,disabled:o.disabled})),counter:!!document.querySelector('.cpa-four-language-views')};
  });
  if(result.lang!==locale||result.overflow||result.images.length||result.options.length!==4||result.options.some(o=>o.disabled)||!result.counter||errors.length)failures.push({group,host,locale,width,result,errors});
  reports.push({group,host,locale,width,...result});
  if(width===390&&host==='jerryzuhow77.github.io'&&['en','ja'].includes(locale)){
   await fs.mkdir(path.join(root,'browser-validation/full-locales-20261013'),{recursive:true});
   await page.screenshot({path:path.join(root,'browser-validation/full-locales-20261013',group.replaceAll('/','-')+locale+'.png'),fullPage:true});
  }
  await context.close();
 }
}finally{await browser.close();}
await fs.mkdir(path.join(root,'browser-validation/full-locales-20261013'),{recursive:true});
await fs.writeFile(path.join(root,'browser-validation/full-locales-20261013/report.json'),JSON.stringify({checks:reports.length,failures,reports},null,2));
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exit(1);}
console.log(`PASS: ${reports.length} regional/locale/width browser checks; images, four available toolbar options, declared locale and overflow.`);
