(function(){
'use strict';
if(window.__cpaMobileNavViews)return;
window.__cpaMobileNavViews=true;

var DEFAULT_ENDPOINT='https://sweet-art-bed8child-advocacy-page-views.jerryzuhow77.workers.dev/views';
var SCRIPT_SOURCE=document.currentScript&&document.currentScript.src?document.currentScript.src:'';
var css=`
#cpa-mobile-bar{display:none}
#cpa-page-views{font:600 13px/1.4 system-ui,-apple-system,sans-serif;color:#52646b;background:rgba(247,250,248,.94);border:1px solid rgba(82,100,107,.16);border-radius:999px;padding:7px 12px;width:max-content;max-width:calc(100% - 32px);margin:14px auto 20px;box-shadow:0 3px 12px rgba(35,55,60,.06)}
#cpa-page-views[data-state="loading"]{opacity:.72}
#cpa-page-views[data-state="error"]{opacity:.82}
@media(max-width:820px){
  body{padding-top:calc(58px + env(safe-area-inset-top,0px))!important}
  html.cpa-four-language-toolbar-active body{padding-top:calc(106px + env(safe-area-inset-top,0px))!important}
  html.cpa-four-language-toolbar-active #cpa-mobile-bar{top:48px}
  html.cpa-four-language-toolbar-active #cpa-mobile-menu{top:calc(106px + env(safe-area-inset-top,0px));max-height:calc(100dvh - 106px - env(safe-area-inset-top,0px))}
  html.cpa-menu-open,html.cpa-menu-open body{overflow:hidden!important}
  #cpa-mobile-bar{display:flex!important;position:fixed;z-index:2147483000;left:0;right:0;top:0;min-height:58px;height:calc(58px + env(safe-area-inset-top,0px));align-items:flex-end;gap:10px;padding:env(safe-area-inset-top,0px) 12px 8px;background:rgba(249,247,241,.97);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(65,83,80,.16);box-shadow:0 3px 18px rgba(28,45,43,.1)}
  #cpa-mobile-bar .brand{font:800 17px/1.1 system-ui,-apple-system,sans-serif;color:#253c3a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;text-decoration:none;padding-bottom:12px}
  #cpa-mobile-bar button{width:42px;height:42px;flex:0 0 42px;border:0;border-radius:12px;background:rgba(85,112,105,.1);color:#294642;font-size:25px;line-height:1;display:grid;place-items:center;margin-bottom:0}
  #cpa-mobile-menu{position:fixed;z-index:2147482999;top:calc(58px + env(safe-area-inset-top,0px));left:0;right:0;max-height:calc(100dvh - 58px - env(safe-area-inset-top,0px));overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;background:rgba(249,247,241,.99);padding:12px 16px calc(28px + env(safe-area-inset-bottom,0px));border-bottom:1px solid rgba(65,83,80,.16);box-shadow:0 14px 28px rgba(28,45,43,.15);display:none}
  #cpa-mobile-menu.open{display:block}
  #cpa-mobile-menu a{display:block;padding:13px 10px;border-bottom:1px solid rgba(65,83,80,.11);font:700 16px/1.35 system-ui,-apple-system,sans-serif;color:#294642;text-decoration:none}
  #cpa-mobile-menu .langs{display:flex;gap:8px;flex-wrap:wrap;padding:14px 6px}
  #cpa-mobile-menu .langs button{border:1px solid rgba(65,83,80,.2);border-radius:999px;background:#fff;padding:8px 11px;color:#294642;font-weight:700}
  .site-header nav,.site-nav,.main-nav header nav{max-width:100%}
}
`;
var st=document.createElement('style');
st.textContent=css;
document.head.appendChild(st);

function langCode(){
  var lang=(document.documentElement.lang||'zh-Hant').toLowerCase();
  if(lang.indexOf('zh-hans')===0||lang==='zh-cn')return'zh-Hans';
  if(lang.indexOf('en')===0)return'en';
  if(lang.indexOf('ja')===0)return'ja';
  return'zh-Hant';
}

function copy(){
  var all={
    'zh-Hant':{brand:'護童行動聯盟',open:'開啟選單',language:'語言',loading:'◉ 累計瀏覽讀取中…',total:'◉ 累計瀏覽',local:'◉ 本裝置瀏覽',unit:'次',links:[['首頁',''],['關於我們','about/'],['法庭漫畫','court-comics/'],['社會案件','cases/'],['旁聽紀錄','hearing-records/'],['歷史案件','#home-historical-cases'],['活動紀錄','activity-records/'],['活動相簿','activity-records/albums/'],['官方社群','social/'],['特別專題','#home-special-features'],['全球守護留言牆','https://cn.globalprotectionwall.com/']]},
    'zh-Hans':{brand:'护童行动联盟',open:'打开菜单',language:'语言',loading:'◉ 累计浏览读取中…',total:'◉ 累计浏览',local:'◉ 本设备浏览',unit:'次',links:[['首页',''],['关于我们','about/'],['法庭漫画','court-comics/'],['社会案件','cases/'],['旁听记录','hearing-records/'],['历史案件','#home-historical-cases'],['活动记录','activity-records/'],['活动相册','activity-records/albums/'],['官方社群','social/'],['特别专题','#home-special-features'],['全球守护留言墙','https://cn.globalprotectionwall.com/']]},
    en:{brand:'Child Protection Action Alliance',open:'Open menu',language:'Language',loading:'◉ Loading views…',total:'◉ Total views',local:'◉ Views on this device',unit:'',links:[['Home',''],['About','about/'],['Court comics','court-comics/'],['Social cases','cases/'],['Hearing records','hearing-records/'],['Historical cases','#home-historical-cases'],['Activities','activity-records/'],['Albums','activity-records/albums/'],['Social','social/'],['Features','#home-special-features'],['Global Protection Wall','https://cn.globalprotectionwall.com/']]},
    ja:{brand:'子ども保護行動連盟',open:'メニューを開く',language:'言語',loading:'◉ 閲覧数を取得中…',total:'◉ 累計閲覧',local:'◉ この端末での閲覧',unit:'回',links:[['ホーム',''],['私たちについて','about/'],['法廷漫画','court-comics/'],['社会事件','cases/'],['傍聴記録','hearing-records/'],['過去の事件','#home-historical-cases'],['活動記録','activity-records/'],['活動アルバム','activity-records/albums/'],['公式SNS','social/'],['特集','#home-special-features'],['グローバル保護メッセージウォール','https://cn.globalprotectionwall.com/']]}
  };
  return all[langCode()]||all['zh-Hant'];
}

function siteBase(){
  if(SCRIPT_SOURCE){
    try{
      var path=new URL('../',SCRIPT_SOURCE).pathname;
      return /\/$/.test(path)?path:path+'/';
    }catch(_){}
  }
  var parts=location.pathname.split('/').filter(Boolean);
  return parts[0]==='child-advocacy-site'?'/child-advocacy-site/':'/';
}

function rootPath(){
  var base=siteBase();
  var relative=location.pathname.indexOf(base)===0?location.pathname.slice(base.length):location.pathname.replace(/^\//,'');
  var first=(relative.split('/').filter(Boolean)[0]||'').toLowerCase();
  return first==='en'||first==='ja'?base+first+'/':base;
}

function addNav(){
  if(document.getElementById('cpa-mobile-bar'))return;
  var root=rootPath();
  var text=copy();
  var bar=document.createElement('div');
  bar.id='cpa-mobile-bar';
  bar.innerHTML='<button type="button" class="menu" aria-label="'+text.open+'" aria-controls="cpa-mobile-menu" aria-expanded="false">☰</button><a class="brand" href="'+root+'">'+text.brand+'</a><button type="button" class="lang" aria-label="'+text.language+'">文</button>';
  var menu=document.createElement('nav');
  menu.id='cpa-mobile-menu';
  menu.setAttribute('aria-label',text.open);
  menu.innerHTML=text.links.map(function(item){
    var href=item[1].indexOf('http')===0?item[1]:root+item[1];
    return '<a href="'+href+'">'+item[0]+'</a>';
  }).join('')+'<div class="langs"><button type="button" data-cpa-lang="zh-Hant">繁</button><button type="button" data-cpa-lang="zh-Hans">简</button><button type="button" data-cpa-lang="en">EN</button><button type="button" data-cpa-lang="ja">日</button></div>';
  document.body.appendChild(bar);
  document.body.appendChild(menu);

  var requestedLang=new URLSearchParams(location.search).get('lang');
  if(requestedLang==='zh-Hans'||requestedLang==='zh-Hant'){
    try{
      localStorage.setItem('site-lang',requestedLang);
      localStorage.setItem('siteLang',requestedLang);
    }catch(_){}
    document.documentElement.lang=requestedLang;
    document.dispatchEvent(new CustomEvent('cpa-language-change',{detail:{lang:requestedLang}}));
  }

  var toggle=bar.querySelector('.menu');
  function setOpen(open){
    menu.classList.toggle('open',open);
    document.documentElement.classList.toggle('cpa-menu-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.textContent=open?'×':'☰';
  }
  toggle.addEventListener('click',function(){setOpen(!menu.classList.contains('open'));});
  bar.querySelector('.lang').addEventListener('click',function(){setOpen(true);requestAnimationFrame(function(){menu.scrollTop=menu.scrollHeight;});});
  menu.addEventListener('click',function(event){
    var button=event.target.closest('[data-cpa-lang]');
    if(button){
      var selectedLang=button.dataset.cpaLang;
      var homeRoot=siteBase();
      if(selectedLang==='en'||selectedLang==='ja'){
        location.href=homeRoot+selectedLang+'/';
        return;
      }
      try{
        localStorage.setItem('site-lang',selectedLang);
        localStorage.setItem('siteLang',selectedLang);
      }catch(_){}
      var localizedHome=new URL(homeRoot,location.origin);
      if(selectedLang==='zh-Hans')localizedHome.searchParams.set('lang','zh-Hans');
      else localizedHome.searchParams.delete('lang');
      history.replaceState(null,'',localizedHome.href);
      document.documentElement.lang=selectedLang;
      document.dispatchEvent(new CustomEvent('cpa-language-change',{detail:{lang:selectedLang}}));
      setOpen(false);
      return;
    }
    if(event.target.closest('a'))setOpen(false);
  });
  document.addEventListener('keydown',function(event){if(event.key==='Escape')setOpen(false);});
}

function canonicalPath(){
  var path=location.pathname.replace(/\/index\.html$/,'/').replace(/\/{2,}/g,'/');
  if(!/\/$/.test(path)&&!path.split('/').pop().includes('.'))path+='/';
  return path;
}

function contentPath(){
  var path=canonicalPath();
  var base=siteBase();
  if(base!=='/'&&path.indexOf(base)===0)path='/'+path.slice(base.length);
  if(!path.startsWith('/'))path='/'+path;
  path=path.replace(/^\/(?:en|ja|zh-hant|zh-hans)(?=\/|$)/i,'');
  if(!path||path==='/')return'/';
  if(!path.startsWith('/'))path='/'+path;
  return path.replace(/\/{2,}/g,'/');
}

function encodedSegment(value){
  return encodeURIComponent(value).replace(/%/g,'').toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'');
}

function counterName(){
  var explicit=document.querySelector('meta[name="cpa-view-counter-key"]');
  if(explicit&&explicit.content)return explicit.content.trim().toLowerCase().replace(/[^a-z0-9:_./-]+/g,'-').slice(0,120);
  var segments=contentPath().split('/').filter(Boolean).map(encodedSegment).filter(Boolean);
  return ('page-'+(segments.join('-')||'home')).slice(0,120);
}

function localFallback(element){
  var key='cpa_views_'+counterName();
  var seen=key+'_seen';
  var count=0;
  try{
    count=parseInt(localStorage.getItem(key)||'0',10)||0;
    if(!sessionStorage.getItem(seen)){
      count+=1;
      localStorage.setItem(key,String(count));
      sessionStorage.setItem(seen,'1');
    }
  }catch(_){count=1;}
  var text=copy();
  element.dataset.state='error';
  element.textContent=text.local+' '+count.toLocaleString()+(text.unit?' '+text.unit:'');
}

function sharedConfig(){
  var config=window.CPA_VIEW_COUNTER||{};
  if(!config.endpoint&&typeof window.CPA_VIEW_COUNTER_API==='string')config.endpoint=window.CPA_VIEW_COUNTER_API;
  var meta=document.querySelector('meta[name="cpa-view-counter-endpoint"]');
  if(!config.endpoint&&meta)config.endpoint=meta.content;
  if(!config.endpoint)config.endpoint=DEFAULT_ENDPOINT;
  return config;
}

async function sharedCount(element){
  var config=sharedConfig();
  var name=counterName();
  var seen='cpa_shared_seen_'+name;
  var increment=true;
  try{if(sessionStorage.getItem(seen))increment=false;}catch(_){}
  var endpoint=config.endpoint.replace(/\/$/,'');
  var url=endpoint+(endpoint.indexOf('?')>=0?'&':'?')+'page='+encodeURIComponent(name)+'&path='+encodeURIComponent(contentPath())+'&increment='+(increment?'1':'0');
  var controller=typeof AbortController==='function'?new AbortController():null;
  var timeout=window.setTimeout(function(){if(controller)controller.abort();},7000);
  try{
    var response=await fetch(url,{method:'GET',mode:'cors',cache:'no-store',credentials:'omit',headers:{Accept:'application/json'},signal:controller?controller.signal:undefined});
    if(!response.ok)throw new Error('counter '+response.status);
    var data=await response.json();
    var count=Number(data.count!=null?data.count:(data.data&&data.data.count));
    if(!Number.isFinite(count))throw new Error('invalid count');
    if(increment)try{sessionStorage.setItem(seen,'1');}catch(_){}
    var text=copy();
    element.dataset.state='ready';
    element.textContent=text.total+' '+count.toLocaleString()+(text.unit?' '+text.unit:'');
  }catch(_){
    localFallback(element);
  }finally{
    window.clearTimeout(timeout);
  }
}

function addViews(){
  if(window.__cpaFourLanguageToolbar)return;
  if(document.getElementById('cpa-page-views'))return;
  if(document.querySelector('[data-home-view-counter]'))return;
  var text=copy();
  var element=document.createElement('div');
  element.id='cpa-page-views';
  element.setAttribute('role','status');
  element.setAttribute('aria-live','polite');
  element.dataset.state='loading';
  element.textContent=text.loading;
  var target=document.querySelector('main h1, article h1, .hero h1, h1');
  if(target){
    var host=target.closest('header,.hero,.article-header')||target.parentElement;
    host.insertAdjacentElement('afterend',element);
  }else{
    var main=document.querySelector('main')||document.body;
    main.insertBefore(element,main.firstChild);
  }
  sharedCount(element);
}

function init(){addNav();addViews();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
