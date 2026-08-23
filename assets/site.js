(function(){
  'use strict';
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
  var version='20260823-mobile-kv-views-5';
  function load(name,marker,done){
    var existing=document.querySelector('script[data-cpa-site-layer="'+marker+'"]');
    if(existing){if(done)done();return;}
    var script=document.createElement('script');
    script.src=base+name+'?v='+version;
    script.async=false;
    script.dataset.cpaSiteLayer=marker;
    script.onload=function(){if(done)done();};
    script.onerror=function(){if(done)done();};
    document.head.appendChild(script);
  }
  load('site-base-20260823.js','base',function(){
    load('site-four-language-qa-20260823.js','four-language-qa',function(){
      load('mobile-nav-view-counter-20260823.js','mobile-nav-views');
    });
  });
})();
