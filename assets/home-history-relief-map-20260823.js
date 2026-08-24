(function(){
  'use strict';
  var H=window.HomeIA2;if(!H)return;
  var one=H.one,all=H.all,make=H.make,reduce=H.reduce;
  var originalHistory=H.features.history;
  var VERSION='20260824-desktop-map-repair-1';
  var mobile=window.matchMedia('(max-width:760px)').matches;
  var language=(H.locale||document.documentElement.lang||'zh-Hant').toLowerCase();
  var locale=language.indexOf('zh-hans')===0||language.indexOf('zh-cn')===0?'zh-Hans':language.indexOf('en')===0?'en':language.indexOf('ja')===0?'ja':'zh-Hant';
  var words={
    'zh-Hant':{alt:'東亞案件記憶地圖，以精緻立體多層紙雕呈現大陸、台灣、香港、日本、韓國與周邊海域',guide:'點選地區圖章，展開案件年代與檔案',label:'東亞案件記憶地圖地區選擇'},
    'zh-Hans':{alt:'东亚案件记忆地图，以精致立体多层纸雕呈现大陆、台湾、香港、日本、韩国与周边海域',guide:'点击地区图章，展开案件年代与档案',label:'东亚案件记忆地图地区选择'},
    en:{alt:'East Asia case memory map rendered as an intricate multilevel paper-cut relief artwork',guide:'Select a regional seal to open its timeline and case archive',label:'Choose a region on the East Asia case memory map'},
    ja:{alt:'東アジア事件記憶地図を精緻な多層切り絵レリーフ作品で表現',guide:'地域の印章を選び、年代と事件資料を開きます',label:'東アジア事件記憶地図の地域選択'}
  };

  function injectStyles(){
    if(!document.getElementById('home-history-relief-map-styles')){
      var relief=document.createElement('link');
      relief.id='home-history-relief-map-styles';relief.rel='stylesheet';
      relief.href=H.base+'home-history-relief-map-20260823.css?v='+VERSION;
      document.head.appendChild(relief);
    }
    if(!document.getElementById('home-history-mobile-visibility-styles')){
      var mobileFix=document.createElement('link');
      mobileFix.id='home-history-mobile-visibility-styles';mobileFix.rel='stylesheet';
      mobileFix.href=H.base+'home-history-mobile-visibility-20260824.css?v='+VERSION;
      document.head.appendChild(mobileFix);
    }
  }

  function preloadArtwork(){
    if(document.querySelector('link[data-history-relief-preload]'))return;
    var preload=document.createElement('link');
    preload.rel='preload';preload.as='image';preload.type='image/webp';
    preload.href=H.base+'art/east-asia-case-memory-map-paper-clay-balanced-20260824.webp?v='+VERSION;
    preload.dataset.historyReliefPreload='true';
    document.head.appendChild(preload);
  }

  function selectedButton(buttons){
    return buttons.filter(function(btn){return btn.getAttribute('aria-pressed')==='true';})[0]||buttons[0];
  }

  function makeImmediatelyVisible(nodes){
    nodes.filter(Boolean).forEach(function(node){
      node.style.setProperty('opacity','1','important');
      node.style.setProperty('visibility','visible','important');
    });
  }

  function enhance(){
    var panel=one('.history-map-panel');
    var art=panel&&one('.history-map-art',panel);
    if(!panel||!art||art.dataset.reliefMapReady==='true')return;

    injectStyles();preloadArtwork();
    art.dataset.reliefMapReady='true';
    art.dataset.reliefArt='reference-style';
    panel.classList.add('history-relief-panel');
    art.classList.add('history-relief-map-art');

    var buttons=all('[data-open-region]',art);
    Array.prototype.slice.call(art.children).forEach(function(child){
      if(buttons.indexOf(child)===-1)child.remove();
    });

    var figure=make('figure','history-relief-figure');
    figure.innerHTML=''+
      '<img class="history-relief-image" src="'+H.base+'art/east-asia-case-memory-map-paper-clay-balanced-20260824.webp?v='+VERSION+'" width="1672" height="941" loading="eager" fetchpriority="high" decoding="async" alt="'+words[locale].alt+'">'+
      '<span class="history-relief-inner-frame" aria-hidden="true"></span>'+
      '<span class="history-relief-sheen" aria-hidden="true"></span>'+
      '<span class="history-relief-cover-cloud" aria-hidden="true"><i></i><i></i><i></i></span>'+
      '<span class="history-relief-aura" aria-hidden="true"></span>'+
      '<figcaption class="history-relief-caption">'+words[locale].guide+'</figcaption>';
    art.insertBefore(figure,art.firstChild);

    var image=one('.history-relief-image',figure);
    if(image){
      image.addEventListener('load',function(){
        figure.classList.add('is-relief-image-loaded');
        makeImmediatelyVisible([panel,art,figure,image]);
        if(window.ScrollTrigger&&window.ScrollTrigger.refresh)window.ScrollTrigger.refresh();
      },{once:true});
      image.addEventListener('error',function(){
        art.classList.add('is-relief-image-error');
        makeImmediatelyVisible([panel,art,figure]);
      },{once:true});
      if(image.complete)figure.classList.add('is-relief-image-loaded');
    }

    var dock=make('div','history-relief-region-dock');
    dock.setAttribute('role','group');dock.setAttribute('aria-label',words[locale].label);
    buttons.forEach(function(btn,index){
      btn.classList.add('history-relief-pin');
      btn.style.removeProperty('--map-order');
      btn.style.setProperty('--relief-order',String(index));
      dock.appendChild(btn);
    });
    art.appendChild(dock);
    var clouds=all('.history-relief-cover-cloud i',figure);
    var seals=buttons.map(function(btn){return one('.history-map-seal-mark',btn);}).filter(Boolean);

    function sync(region){
      if(!region)return;
      art.dataset.activeRegion=region;
      buttons.forEach(function(btn){btn.classList.toggle('is-relief-active',btn.dataset.openRegion===region);});
      if(window.gsap&&!reduce){
        var active=buttons.filter(function(btn){return btn.dataset.openRegion===region;})[0];
        var activeSeal=active&&one('.history-map-seal-mark',active);
        if(activeSeal)window.gsap.fromTo(activeSeal,{scale:.72,rotate:-12},{scale:1,rotate:0,duration:.62,ease:'elastic.out(1,.45)',overwrite:true});
        window.gsap.fromTo('.history-relief-aura',{scale:.45,opacity:.25},{scale:1,opacity:1,duration:.72,ease:'power2.out',overwrite:true});
      }
    }
    var initial=selectedButton(buttons);sync(initial&&initial.dataset.openRegion);
    buttons.forEach(function(btn){
      btn.addEventListener('click',function(){sync(btn.dataset.openRegion);});
      new MutationObserver(function(){if(btn.getAttribute('aria-pressed')==='true')sync(btn.dataset.openRegion);}).observe(btn,{attributes:true,attributeFilter:['aria-pressed']});
    });

    var canAnimate=!!(window.gsap&&!reduce);
    var canScrollReveal=!!(canAnimate&&window.ScrollTrigger&&!mobile);
    if(canAnimate){
      var reveal=window.gsap.timeline(canScrollReveal?{scrollTrigger:{trigger:figure,start:'top 88%',once:true}}:{});
      reveal.fromTo(figure,{clipPath:'inset(48% 48% 48% 48% round 28px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',duration:1.15,ease:'power4.inOut',immediateRender:false})
        .fromTo(image,{scale:1.12},{scale:1,duration:1.4,ease:'power3.out',immediateRender:false},0)
        .fromTo(clouds,{xPercent:function(i){return i%2?-38:38;},opacity:0},{xPercent:0,opacity:function(i){return .58-i*.12;},duration:1.25,stagger:.09,ease:'power2.out',immediateRender:false},.18)
        .fromTo(seals,{scale:0,rotate:-24,opacity:0},{scale:1,rotate:0,opacity:1,duration:.7,stagger:.085,ease:'back.out(2)',immediateRender:false},.48)
        .fromTo('.history-relief-caption',{y:18,opacity:0},{y:0,opacity:1,duration:.55,ease:'power2.out',immediateRender:false},.72);
      clouds.forEach(function(cloud,index){window.gsap.to(cloud,{xPercent:index%2?14:-16,yPercent:index===2?-8:6,duration:9+index*2,repeat:-1,yoyo:true,ease:'sine.inOut'});});
      if(image)window.gsap.to(image,{scale:1.018,duration:6.5,repeat:-1,yoyo:true,ease:'sine.inOut'});
      seals.forEach(function(seal,index){window.gsap.to(seal,{y:index%2?-2:2,duration:1.8+index*.18,repeat:-1,yoyo:true,ease:'sine.inOut'});});
    }
    if(canScrollReveal){
      if(image&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
        figure.addEventListener('pointermove',function(event){
          var r=figure.getBoundingClientRect();
          var x=(event.clientX-r.left)/r.width-.5;
          var y=(event.clientY-r.top)/r.height-.5;
          window.gsap.to(image,{xPercent:x*1.25,yPercent:y*.95,scale:1.018,duration:.55,ease:'power2.out',overwrite:true});
        });
        figure.addEventListener('pointerleave',function(){window.gsap.to(image,{xPercent:0,yPercent:0,scale:1,duration:.7,ease:'power2.out',overwrite:true});});
      }
    }else if(!canAnimate){
      if(window.gsap){
        window.gsap.killTweensOf([panel,art,figure,image].concat(buttons));
        window.gsap.set([panel,art,figure,image].concat(buttons).filter(Boolean),{autoAlpha:1,x:0,y:0,scale:1,rotate:0,clearProps:'opacity,visibility,transform'});
      }
      makeImmediatelyVisible([panel,art,figure,image,dock].concat(buttons));
    }

    if(mobile){
      panel.dataset.mobileReliefVisible='true';
      requestAnimationFrame(function(){makeImmediatelyVisible([panel,art,figure,image,dock].concat(buttons));});
      setTimeout(function(){makeImmediatelyVisible([panel,art,figure,image,dock].concat(buttons));},320);
    }
  }

  H.features.history=function(){if(originalHistory)originalHistory();enhance();};
})();
