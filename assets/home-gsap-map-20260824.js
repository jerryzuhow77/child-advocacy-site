(function(){
  'use strict';
  var current=document.currentScript&&document.currentScript.src?document.currentScript.src:'';
  var basePath=current?current.slice(0,current.lastIndexOf('/')+1):'./assets/';
  var version='20260824-paper-clay-map-3';
  function loadEnhancement(){
    if(document.querySelector('script[data-home-ia-final]'))return;
    var enhancement=document.createElement('script');
    enhancement.src=basePath+'home-archive-layout-20260823.js?v='+version;
    enhancement.defer=true;
    enhancement.dataset.homeIaFinal='true';
    document.head.appendChild(enhancement);
  }
  var base=document.createElement('script');
  base.src=basePath+'home-gsap-base-20260823.js?v='+version;
  base.defer=true;
  base.onload=loadEnhancement;
  base.onerror=loadEnhancement;
  document.head.appendChild(base);
})();


/* Load the 2026-08-24 homepage information-architecture refinement. */
(function(){
  if(document.querySelector('script[data-home-ia-refinement]')) return;
  var script=document.createElement('script');
  script.src='./assets/home-ia-refinement-20260824.js?v=20260824-2';
  script.defer=true;
  script.dataset.homeIaRefinement='true';
  document.head.appendChild(script);
})();