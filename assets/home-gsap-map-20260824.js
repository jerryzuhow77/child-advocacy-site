(function(){
  'use strict';
  var current=document.currentScript&&document.currentScript.src?document.currentScript.src:'';
  var basePath=current?current.slice(0,current.lastIndexOf('/')+1):'./assets/';
  var version='20260826-two-reports-1';
  var balancedArtwork=basePath+'art/east-asia-case-memory-map-paper-clay-20260824.webp?v='+version;
  function injectMobileMapRepair(){
    if(!window.matchMedia('(max-width:760px)').matches||document.getElementById('home-mobile-map-repair-5'))return;
    var repair=document.createElement('link');
    repair.id='home-mobile-map-repair-5';
    repair.rel='stylesheet';
    repair.href=basePath+'home-history-mobile-visibility-20260824.css?v='+version;
    document.head.appendChild(repair);
  }
  function forceBalancedMobileArtwork(root){
    if(!window.matchMedia('(max-width:760px)').matches)return;
    var scope=root&&root.querySelectorAll?root:document;
    var images=scope.querySelectorAll('#home-historical-cases .history-relief-image,#home-historical-cases .home-history-static-map img');
    Array.prototype.forEach.call(images,function(image){
      if(image.getAttribute('src')!==balancedArtwork){
        image.setAttribute('src',balancedArtwork);
        image.setAttribute('srcset','');
        image.dataset.mobileBalancedMap='true';
      }
    });
  }
  function animateVisibleStaticMap(){
    var figure=document.querySelector('#home-historical-cases .home-history-static-map');
    if(!figure)return;
    figure.style.opacity='1';
    figure.style.visibility='visible';
    var image=figure.querySelector('img');
    if(image){image.style.opacity='1';image.style.visibility='visible';}
    if(!window.gsap||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(figure.dataset.gsapVisible==='true')return;
    figure.dataset.gsapVisible='true';
    window.gsap.fromTo(figure,{clipPath:'inset(0 7% 0 7% round 22px)',y:20},{clipPath:'inset(0 0% 0 0% round 22px)',y:0,duration:1.05,ease:'power2.out',clearProps:'transform'});
    if(image)window.gsap.fromTo(image,{scale:1.035},{scale:1,duration:1.35,ease:'power2.out',clearProps:'transform'});
  }
  function loadInteractionFix(){
    if(document.querySelector('script[data-history-map-interaction-fix]'))return;
    var fix=document.createElement('script');
    fix.src=basePath+'home-history-map-interaction-fix-20260825.js?v='+version;
    fix.defer=true;
    fix.dataset.historyMapInteractionFix='true';
    document.head.appendChild(fix);
  }
  injectMobileMapRepair();
  forceBalancedMobileArtwork(document);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){forceBalancedMobileArtwork(document);animateVisibleStaticMap();},{once:true});else animateVisibleStaticMap();
  var mapObserver=new MutationObserver(function(records){
    records.forEach(function(record){
      Array.prototype.forEach.call(record.addedNodes,function(node){if(node.nodeType===1)forceBalancedMobileArtwork(node.matches&&node.matches('#home-historical-cases')?node:document);});
    });
  });
  mapObserver.observe(document.documentElement,{childList:true,subtree:true});
  window.setTimeout(function(){forceBalancedMobileArtwork(document);mapObserver.disconnect();},12000);
  if(window.matchMedia('(max-width:760px)').matches)animateVisibleStaticMap();
  function loadEnhancement(){
    var existing=document.querySelector('script[data-home-ia-final]');
    if(existing){loadInteractionFix();return;}
    var enhancement=document.createElement('script');
    enhancement.src=basePath+'home-archive-layout-20260823.js?v='+version;
    enhancement.defer=true;
    enhancement.dataset.homeIaFinal='true';
    enhancement.onload=loadInteractionFix;
    enhancement.onerror=loadInteractionFix;
    document.head.appendChild(enhancement);
    window.setTimeout(loadInteractionFix,120);
  }
  var base=document.createElement('script');
  base.src=basePath+'home-gsap-base-20260823.js?v='+version;
  base.defer=true;
  base.onload=function(){animateVisibleStaticMap();loadEnhancement();};
  base.onerror=loadEnhancement;
  document.head.appendChild(base);
})();
