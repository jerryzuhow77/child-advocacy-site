(function(){
  'use strict';

  var current=document.currentScript&&document.currentScript.src?document.currentScript.src:'';
  var basePath=current?current.slice(0,current.lastIndexOf('/')+1):'./assets/';
  var VERSION='20260825-region-hotspot-filter-1';
  var REGIONS=['mainland','hongkong','taiwan','korea','japan'];
  var initialized=false;
  var retryTimer=0;
  var retryCount=0;
  var zoneObserver=null;

  var names={
    'zh-Hant':{mainland:'大陸',hongkong:'香港',taiwan:'台灣',korea:'韓國',japan:'日本',other:'其他地區',choose:'選擇',cases:'案件',all:'顯示全部地區案件',soon:'案件整理中'},
    'zh-Hans':{mainland:'大陆',hongkong:'香港',taiwan:'台湾',korea:'韩国',japan:'日本',other:'其他地区',choose:'选择',cases:'案件',all:'显示全部地区案件',soon:'案件整理中'},
    en:{mainland:'Mainland China',hongkong:'Hong Kong',taiwan:'Taiwan',korea:'Korea',japan:'Japan',other:'Other regions',choose:'Show',cases:'cases',all:'Show all regional cases',soon:'Cases coming soon'},
    ja:{mainland:'中国大陸',hongkong:'香港',taiwan:'台湾',korea:'韓国',japan:'日本',other:'その他の地域',choose:'表示',cases:'事件',all:'すべての地域を表示',soon:'事件資料を整理中'}
  };

  function locale(){
    var language=(document.documentElement.lang||'zh-Hant').toLowerCase();
    if(language.indexOf('zh-hans')===0||language.indexOf('zh-cn')===0)return 'zh-Hans';
    if(language.indexOf('en')===0)return 'en';
    if(language.indexOf('ja')===0)return 'ja';
    return 'zh-Hant';
  }

  function copy(){return names[locale()]||names['zh-Hant'];}

  function injectStyles(){
    if(document.getElementById('home-history-map-interaction-fix-styles'))return;
    var link=document.createElement('link');
    link.id='home-history-map-interaction-fix-styles';
    link.rel='stylesheet';
    link.href=basePath+'home-history-map-interaction-fix-20260825.css?v='+VERSION;
    document.head.appendChild(link);
  }

  function all(selector,root){return Array.prototype.slice.call((root||document).querySelectorAll(selector));}

  function setImportant(node,property,value){
    if(node)node.style.setProperty(property,value,'important');
  }

  function stopConflictingReveals(zone){
    if(!window.ScrollTrigger||!window.ScrollTrigger.getAll)return;
    var panel=zone.querySelector('.history-map-panel');
    var art=zone.querySelector('.history-map-art');
    var figure=zone.querySelector('.history-relief-figure');
    window.ScrollTrigger.getAll().forEach(function(trigger){
      var target=trigger&&trigger.trigger;
      if(target!==panel&&target!==art&&target!==figure)return;
      try{if(trigger.animation&&trigger.animation.kill)trigger.animation.kill();}catch(error){}
      try{trigger.kill(false);}catch(error){}
    });
  }

  function lockEnhancedMapVisibility(zone){
    var panel=zone.querySelector('.history-map-panel');
    var art=zone.querySelector('.history-map-art');
    var figure=zone.querySelector('.history-relief-figure');
    var image=zone.querySelector('.history-relief-image');
    if(!panel||!art||!figure)return false;

    zone.dataset.historyMapInteractionFixed='true';
    panel.classList.add('history-map-visibility-locked');
    stopConflictingReveals(zone);

    if(window.gsap){
      try{window.gsap.killTweensOf(panel);}catch(error){}
      try{window.gsap.set(panel,{x:0,y:0,rotation:0,opacity:1,visibility:'visible'});}catch(error){}
      try{window.gsap.set(figure,{opacity:1,visibility:'visible',clipPath:'none'});}catch(error){}
      if(image){try{window.gsap.set(image,{opacity:1,visibility:'visible'});}catch(error){}}
    }

    setImportant(panel,'opacity','1');
    setImportant(panel,'visibility','visible');
    setImportant(panel,'transform','none');
    setImportant(art,'opacity','1');
    setImportant(art,'visibility','visible');
    setImportant(figure,'display','block');
    setImportant(figure,'opacity','1');
    setImportant(figure,'visibility','visible');
    setImportant(figure,'clip-path','none');
    if(image){setImportant(image,'opacity','1');setImportant(image,'visibility','visible');}
    return true;
  }

  function regionLabel(zone,key){
    var source=zone.querySelector('[data-open-region="'+key+'"]');
    var strong=source&&source.querySelector('b');
    return strong&&strong.textContent.trim()?strong.textContent.trim():(copy()[key]||key);
  }

  function ensureAnnouncer(zone){
    var announcer=zone.querySelector('.history-map-filter-announcer');
    if(announcer)return announcer;
    announcer=document.createElement('div');
    announcer.className='history-map-filter-announcer';
    announcer.setAttribute('role','status');
    announcer.setAttribute('aria-live','polite');
    announcer.setAttribute('aria-atomic','true');
    zone.appendChild(announcer);
    return announcer;
  }

  function announce(zone,key,countText){
    var label=regionLabel(zone,key);
    ensureAnnouncer(zone).textContent=label+' · '+(countText||copy().soon);
  }

  function syncHotspots(zone,key){
    all('[data-history-hotspot-region]',zone).forEach(function(button){
      var active=button.dataset.historyHotspotRegion===key;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    zone.dataset.historyMapSelectedRegion=key||'';
  }

  function enforceEnhancedSelection(zone,key){
    var details=all('.history-region',zone);
    details.forEach(function(item){item.open=item.dataset.region===key;});
    all('[data-open-region]',zone).forEach(function(button){
      button.setAttribute('aria-pressed',String(button.dataset.openRegion===key));
    });
    var target=zone.querySelector('.history-region[data-region="'+key+'"]');
    var source=zone.querySelector('[data-open-region="'+key+'"]');
    syncHotspots(zone,key);
    announce(zone,key,source&&source.querySelector('small')?source.querySelector('small').textContent.trim():'');
    if(target&&window.innerWidth<900){
      window.setTimeout(function(){
        try{target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});}catch(error){}
      },30);
    }
  }

  function selectEnhancedRegion(zone,key){
    var source=zone.querySelector('.history-relief-region-dock [data-open-region="'+key+'"]')||zone.querySelector('[data-open-region="'+key+'"]');
    if(source)source.click();
    window.requestAnimationFrame(function(){enforceEnhancedSelection(zone,key);});
  }

  function cardRegion(card){
    var href=(card.getAttribute('href')||'').toLowerCase();
    if(href.indexOf('/regions/taiwan/')>-1||href.indexOf('/taiwan/')>-1)return 'taiwan';
    if(href.indexOf('/mainland-china/')>-1||href.indexOf('/mainland/')>-1)return 'mainland';
    if(href.indexOf('/hong-kong/')>-1||href.indexOf('/hongkong/')>-1)return 'hongkong';
    if(href.indexOf('/japan/')>-1)return 'japan';
    if(href.indexOf('/korea/')>-1)return 'korea';
    return 'other';
  }

  function selectStaticRegion(zone,key){
    var currentKey=zone.dataset.historyStaticSelectedRegion||'';
    var nextKey=currentKey===key?'':key;
    var cards=all('.home-historical-card',zone);
    var visible=0;
    cards.forEach(function(card){
      var show=!nextKey||cardRegion(card)===nextKey;
      card.hidden=!show;
      if(show)visible+=1;
    });
    zone.dataset.historyStaticSelectedRegion=nextKey;
    syncHotspots(zone,nextKey);
    if(nextKey)announce(zone,nextKey,visible?String(visible)+' '+copy().cases:copy().soon);
    else ensureAnnouncer(zone).textContent=copy().all;
  }

  function makeHotspotLayer(zone,host,mode){
    var existing=host.querySelector(':scope > .history-map-hotspot-layer');
    if(existing)return existing;
    var layer=document.createElement('div');
    layer.className='history-map-hotspot-layer is-'+mode;
    layer.setAttribute('aria-label',copy().choose+' '+copy().cases);
    REGIONS.forEach(function(key){
      var button=document.createElement('button');
      var label=regionLabel(zone,key);
      button.type='button';
      button.className='history-map-hotspot history-map-hotspot-'+key;
      button.dataset.historyHotspotRegion=key;
      button.setAttribute('aria-label',copy().choose+' '+label+' '+copy().cases);
      button.setAttribute('aria-pressed','false');
      button.innerHTML='<span class="history-map-hotspot-core" aria-hidden="true"></span><span class="history-map-hotspot-label" aria-hidden="true">'+label+'</span>';
      button.addEventListener('click',function(event){
        event.preventDefault();
        event.stopPropagation();
        if(mode==='enhanced')selectEnhancedRegion(zone,key);else selectStaticRegion(zone,key);
      });
      layer.appendChild(button);
    });
    host.appendChild(layer);
    return layer;
  }

  function bindEnhancedControls(zone){
    all('[data-open-region]',zone).forEach(function(button){
      if(button.dataset.historyMapFixBound==='true')return;
      button.dataset.historyMapFixBound='true';
      button.addEventListener('click',function(){
        window.requestAnimationFrame(function(){enforceEnhancedSelection(zone,button.dataset.openRegion);});
      });
    });
    all('.history-region',zone).forEach(function(details){
      if(details.dataset.historyMapFixBound==='true')return;
      details.dataset.historyMapFixBound='true';
      details.addEventListener('toggle',function(){
        if(details.open)window.requestAnimationFrame(function(){enforceEnhancedSelection(zone,details.dataset.region);});
      });
    });
  }

  function enhanceStaticFallback(zone){
    var figure=zone.querySelector('.home-history-static-map');
    if(!figure)return false;
    figure.dataset.historyStaticInteractive='true';
    makeHotspotLayer(zone,figure,'static');
    return true;
  }

  function enhanceInteractiveMap(zone){
    var figure=zone.querySelector('.history-relief-figure');
    if(!figure)return false;
    var carriedRegion=zone.dataset.historyStaticSelectedRegion||'';
    all('.home-historical-card',zone).forEach(function(card){card.hidden=false;});
    zone.dataset.historyStaticSelectedRegion='';
    if(!initialized){
      initialized=true;
      makeHotspotLayer(zone,figure,'enhanced');
      bindEnhancedControls(zone);
      var pressed=zone.querySelector('[data-open-region][aria-pressed="true"]');
      var initialRegion=carriedRegion||(pressed?pressed.dataset.openRegion:'taiwan');
      syncHotspots(zone,initialRegion);
      if(carriedRegion)window.requestAnimationFrame(function(){enforceEnhancedSelection(zone,carriedRegion);});
      [0,180,620,1500,4200].forEach(function(delay){
        window.setTimeout(function(){lockEnhancedMapVisibility(zone);},delay);
      });
      window.addEventListener('pageshow',function(){lockEnhancedMapVisibility(zone);});
      document.addEventListener('visibilitychange',function(){if(!document.hidden)lockEnhancedMapVisibility(zone);});
      var resizeTimer=0;
      window.addEventListener('resize',function(){
        window.clearTimeout(resizeTimer);
        resizeTimer=window.setTimeout(function(){lockEnhancedMapVisibility(zone);},120);
      });
    }
    lockEnhancedMapVisibility(zone);
    if(window.ScrollTrigger&&window.ScrollTrigger.refresh){
      window.setTimeout(function(){try{window.ScrollTrigger.refresh();}catch(error){}},80);
    }
    return true;
  }

  function run(){
    injectStyles();
    var zone=document.getElementById('home-historical-cases');
    if(!zone)return;
    enhanceStaticFallback(zone);
    if(enhanceInteractiveMap(zone)){
      if(zoneObserver){zoneObserver.disconnect();zoneObserver=null;}
      window.clearTimeout(retryTimer);
      return;
    }
    window.clearTimeout(retryTimer);
    retryCount+=1;
    if(retryCount<125)retryTimer=window.setTimeout(run,120);
    if(!zoneObserver&&window.MutationObserver){
      zoneObserver=new MutationObserver(function(){
        enhanceStaticFallback(zone);
        if(enhanceInteractiveMap(zone)){
          zoneObserver.disconnect();
          zoneObserver=null;
        }
      });
      zoneObserver.observe(zone,{childList:true,subtree:true});
      window.setTimeout(function(){if(zoneObserver){zoneObserver.disconnect();zoneObserver=null;}},15000);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
