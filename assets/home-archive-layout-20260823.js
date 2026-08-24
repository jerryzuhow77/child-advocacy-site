(function(){
  'use strict';
  if(document.querySelector('script[data-home-ia-module="core"]'))return;
  var current=document.currentScript&&document.currentScript.src?document.currentScript.src:'';
  var base=current?current.slice(0,current.lastIndexOf('/')+1):'./assets/';
  var version='20260824-paper-clay-map-3';
  var files=[
    'home-ia-core-20260823.js',
    'home-ia-layout-20260823.js',
    'home-ia-history-20260823.js',
    'home-history-paper-art-20260823.js',
    'home-history-relief-map-20260823.js',
    'home-ia-hearing-campaign-20260823.js',
    'home-ia-bootstrap-20260823.js'
  ];
  var index=0;
  function next(){
    if(index>=files.length)return;
    var s=document.createElement('script');
    s.src=base+files[index]+'?v='+version;
    s.defer=true;
    s.dataset.homeIaModule=index===0?'core':String(index);
    index+=1;
    s.onload=next;
    s.onerror=next;
    document.head.appendChild(s);
  }
  next();
})();
