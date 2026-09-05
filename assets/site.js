(function(){
  'use strict';

  // GitHub Pages cannot redirect by request country at the edge. Resolve only
  // the visitor's country code, then preserve the locale/deep link when a
  // mainland visitor should use the Hong Kong mirror.
  (function redirectMainlandVisitor(){
    var mainHost='jerryzuhow77.github.io';
    var mainPrefix='/child-advocacy-site';
    var hongKongOrigin='https://cn.globalprotectionwall.com';
    if(window.location.hostname!==mainHost)return;
    if(window.location.pathname!==mainPrefix&&window.location.pathname.indexOf(mainPrefix+'/')!==0)return;

    var controller=typeof AbortController==='function'?new AbortController():null;
    var timeout=window.setTimeout(function(){if(controller)controller.abort();},3500);
    fetch('https://api.country.is/',{
      method:'GET',
      mode:'cors',
      credentials:'omit',
      cache:'no-store',
      signal:controller?controller.signal:undefined
    }).then(function(response){
      if(!response.ok)throw new Error('country lookup failed');
      return response.json();
    }).then(function(result){
      if(String(result&&result.country||'').toUpperCase()!=='CN')return;
      var mirrorPath=window.location.pathname.slice(mainPrefix.length)||'/';
      if(mirrorPath.charAt(0)!=='/')mirrorPath='/'+mirrorPath;
      window.location.replace(hongKongOrigin+mirrorPath+window.location.search+window.location.hash);
    }).catch(function(){
      // Keep the primary site usable when country lookup is unavailable.
    }).then(function(){
      window.clearTimeout(timeout);
    });
  })();

  if(window.__cpaSiteQaLoader)return;
  window.__cpaSiteQaLoader=true;

  var counterEndpoint='https://sweet-art-bed8child-advocacy-page-views.jerryzuhow77.workers.dev/views';
  window.CPA_VIEW_COUNTER=window.CPA_VIEW_COUNTER||{};
  if(!window.CPA_VIEW_COUNTER.endpoint){
    window.CPA_VIEW_COUNTER.endpoint=counterEndpoint;
  }
  window.CPA_VIEW_COUNTER_API=window.CPA_VIEW_COUNTER.endpoint;

  var current=document.currentScript&&document.currentScript.src?document.currentScript.src:'';
  var base=current?current.slice(0,current.lastIndexOf('/')+1):'./assets/';
  var version='20260905-language-ready-1';
  var commentVersion='20260905-comment-key-3';
  function load(name,marker,done,assetVersion){
    var existing=document.querySelector('script[data-cpa-site-layer="'+marker+'"]');
    if(existing){if(done)done();return;}
    var script=document.createElement('script');
    script.src=base+name+'?v='+(assetVersion||version);
    script.async=false;
    script.dataset.cpaSiteLayer=marker;
    script.onload=function(){if(done)done();};
    script.onerror=function(){if(done)done();};
    document.head.appendChild(script);
  }
  load('site-base-20260823.js','base',function(){
    load('site-four-language-qa-20260823.js','four-language-qa',function(){
      load('mobile-nav-view-counter-20260823.js','mobile-nav-views');
      load('article-comments-20260828.js','article-comments',null,commentVersion);
      load('legal-notice.js','legal-notice');
    });
  });
})();
