#!/usr/bin/env node
/* Generates the physical V14 editions. Text is localized by the checked-in V14 copy module. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const route='historical-cases/regions/taiwan/tainan-tom-bear-case/v14/';
const source=fs.readFileSync(path.join(root,route,'index.html'),'utf8');
const urls={
  'zh-Hant':'https://jerryzuhow77.github.io/child-advocacy-site/'+route,
  'zh-Hans':'https://cn.globalprotectionwall.com/child-advocacy-site/'+route+'zh-Hans/',
  en:'https://jerryzuhow77.github.io/child-advocacy-site/en/'+route,
  ja:'https://jerryzuhow77.github.io/child-advocacy-site/ja/'+route,
};
const editions=[
  ['zh-Hans',path.join(root,route,'zh-Hans','index.html')],
  ['en',path.join(root,'en',route,'index.html')],
  ['ja',path.join(root,'ja',route,'index.html')],
];
for(const [locale,file] of editions){
  let html=source.replace('<html lang="zh-Hant">',`<html lang="${locale}">`);
  html=html.replace(/<link rel="canonical" href="[^"]+">/,`<link rel="canonical" href="${urls[locale]}">`);
  html=html.replace(/<title>[^<]+<\/title>/, locale==='en'?'<title>Tainan Tom’s World Case | V14 Rebuilt Paper-Puppet Stage</title>':locale==='ja'?'<title>台南トムズワールド事件｜V14 ペーパーパペット舞台・再構築版</title>':'<title>台南汤姆熊案件｜V14 纸雕戏偶舞台重建版</title>');
  html=html.replace(/<meta name="description" content="[^"]+">/,locale==='en'?'<meta name="description" content="An interactive historical-case feature rebuilt as a paper theatre with eight scenes, verified milestones and justice questions.">':locale==='ja'?'<meta name="description" content="紙の舞台、8つの場面、検証可能な事件経過と司法制度の問いを用いたインタラクティブ特集。">':'<meta name="description" content="以纸雕戏台、八段分镜与司法时间线回顾案件与制度争议的互动专题。">');
  fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,html);
}
const manifestPath=path.join(root,'data','four-language-routes.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
manifest.routes[route]={
  'zh-Hant':'/child-advocacy-site/'+route,
  'zh-Hans':urls['zh-Hans'],
  en:'/child-advocacy-site/en/'+route,
  ja:'/child-advocacy-site/ja/'+route,
};
fs.writeFileSync(manifestPath,JSON.stringify(manifest));
