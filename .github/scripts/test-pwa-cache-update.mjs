import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../../',import.meta.url);
const read=p=>fs.readFile(new URL(p,root),'utf8');
const worker=await read('sw.js');
const version=worker.match(/const VERSION = '([^']+)'/)[1];
assert((await read('assets/pwa-install.js')).includes(`sw.js?v=${version}`));
for(const page of ['index.html','en/index.html','ja/index.html']){
 assert((await read(page)).includes(`pwa-install.js?v=${version}`),`${page}: stale installer`);
}
for(const region of ['https://jerryzuhow77.github.io','https://cn.globalprotectionwall.com']){
 const scope=region+'/child-advocacy-site/';
 const handlers={},storage=new Map();let online=true;
 const absolute=p=>new URL(p,scope).href;
 const key=r=>typeof r==='string'?r:r.url;
 const caches={
  keys:async()=>[...storage.keys()],delete:async k=>storage.delete(k),
  open:async name=>{
   if(!storage.has(name))storage.set(name,new Map());
   const data=storage.get(name);
   return {put:async(r,response)=>data.set(key(r),response.clone()),
    keys:async()=>[...data.keys()].map(url=>new Request(url)),
    delete:async r=>data.delete(key(r)),
    match:async(r,options={})=>{
     const url=key(r),found=[...data.keys()].find(k=>options.ignoreSearch?k.split('?')[0]===url.split('?')[0]:k===url);
     return data.get(found)?.clone();
    }};
  }
 };
 const self={registration:{scope},location:{origin:region},
  addEventListener:(type,handler)=>handlers[type]=handler,
  skipWaiting:async()=>{},clients:{claim:async()=>{}}};
 const fetch=async request=>{
  if(!online)throw new Error('offline');
  const url=key(request);
  if(url.includes('home-gsap.css'))return new Response('optional missing',{status:404});
  return new Response(url.endsWith('offline.html')?'offline fallback':url.includes('thumbnail')?'fresh thumbnail':'fresh page');
 };
 vm.runInNewContext(worker,{self,caches,fetch,URL,Response,Request});
 const old=await caches.open('cpa-alliance-pwa-runtime-old');
 await old.put(absolute('thumbnail.webp'),new Response('stale thumbnail'));
 await caches.open('unrelated-app-cache');
 let pending;
 handlers.install({waitUntil:p=>pending=p});await pending;
 handlers.activate({waitUntil:p=>pending=p});await pending;
 assert(!storage.has('cpa-alliance-pwa-runtime-old'));
 assert(storage.has('unrelated-app-cache'));
 const request=async(url,mode='navigate',destination='')=>{
  let response;
  handlers.fetch({request:{url:absolute(url),method:'GET',mode,destination,headers:new Headers()},respondWith:p=>response=p});
  return await response;
 };
 assert.equal(await (await request('thumbnail.webp','cors','image')).text(),'fresh thumbnail');
 assert.equal(await (await request('')).text(),'fresh page');
 online=false;
 assert.equal(await (await request('')).text(),'fresh page');
 assert.equal(await (await request('not-visited/')).text(),'offline fallback');
 assert.equal(await (await request('thumbnail.webp','cors','image')).text(),'fresh thumbnail');
 assert.equal(await (await request('assets/pwa-install.js?v='+version,'cors','script')).text(),'fresh page');
 assert.equal(await request('video.mp4','cors','video'),undefined);
 assert.equal(await request('api/live','cors',''),undefined);
 console.log(region+': version parity, update cleanup, fresh thumbnail and offline navigation/assets passed');
}
