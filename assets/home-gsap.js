(function(){
  'use strict';
  var current=document.currentScript&&document.currentScript.src?document.currentScript.src:'';
  var basePath=current?current.slice(0,current.lastIndexOf('/')+1):'./assets/';
  var version='20260824-mobile-visible-1';
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
