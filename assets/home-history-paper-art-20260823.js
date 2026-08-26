(function(){
  'use strict';

  var H=window.HomeIA2;
  if(!H)return;

  var one=H.one;
  var all=H.all;
  var make=H.make;
  var reduce=H.reduce;
  var c=H.c||{};
  var originalHistory=H.features.history;
  var VERSION='20260826-historical-followup-1';

  var regionMarks={
    taiwan:'台',
    mainland:'陸',
    hongkong:'港',
    japan:'日',
    korea:'韓',
    other:'錄'
  };

  var regionCatalog={
    taiwan:'TW',
    mainland:'ML',
    hongkong:'HK',
    japan:'JP',
    korea:'KR',
    other:'AR'
  };

  function injectStyles(){
    if(document.getElementById('home-history-paper-art-styles'))return;
    var link=document.createElement('link');
    link.id='home-history-paper-art-styles';
    link.rel='stylesheet';
    link.href=H.base+'home-history-paper-art-20260823.css?v='+VERSION;
    document.head.appendChild(link);
  }

  function paperMapSvg(){
    return ''+
      '<svg class="history-paper-map-svg" viewBox="0 0 640 420" aria-hidden="true" focusable="false">'+
        '<defs>'+
          '<linearGradient id="paperSeaWash" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#edf1ea"/><stop offset=".5" stop-color="#dfe9e6"/><stop offset="1" stop-color="#eedfd5"/></linearGradient>'+
          '<linearGradient id="paperGoldEdge" x1="0" x2="1"><stop offset="0" stop-color="#b38a55" stop-opacity=".16"/><stop offset=".5" stop-color="#d8bd85" stop-opacity=".62"/><stop offset="1" stop-color="#8a6846" stop-opacity=".12"/></linearGradient>'+
          '<filter id="paperDrop" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#4f5149" flood-opacity=".18"/></filter>'+
          '<filter id="paperSoft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>'+
          '<filter id="paperGrain" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="2" seed="16" result="noise"/><feColorMatrix in="noise" type="saturate" values="0" result="mono"/><feComponentTransfer in="mono" result="fade"><feFuncA type="table" tableValues="0 .055"/></feComponentTransfer><feBlend in="SourceGraphic" in2="fade" mode="multiply"/></filter>'+
        '</defs>'+
        '<rect class="history-paper-sea" x="6" y="8" width="628" height="404" rx="82" fill="url(#paperSeaWash)"/>'+
        '<path class="history-map-wave wave-back" d="M28 321C110 292 174 352 258 324S419 298 494 329s104 18 132 2" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" opacity=".5"/>'+
        '<path class="history-map-wave wave-front" d="M15 342C104 308 183 371 274 338s161-12 230 14 94 7 123-9" fill="none" stroke="#b8d1cd" stroke-width="6" stroke-linecap="round" opacity=".66"/>'+
        '<g class="paper-map-layer paper-map-shadow" data-paper-depth="1" filter="url(#paperDrop)" opacity=".68">'+
          '<path d="M68 113c42-49 109-77 179-64 54 10 102 43 126 88 15 28 15 58 1 81-12 20-37 26-54 45-18 21-22 55-49 65-31 11-68-12-98-1-34 13-73 30-101 7-26-21-10-58-18-88-8-33-25-80 14-133z" fill="#aeb8aa"/>'+
          '<path d="M404 139c18 0 33 20 34 40 1 18-9 34-15 51-5 13-5 31-18 38-15 8-29-5-28-20 1-17 13-30 16-46 4-20-5-42 11-55z" fill="#9eaaa0"/>'+
          '<path d="M471 91c22 3 36 22 33 43-3 18-21 29-24 47-2 13 7 27 1 39-7 14-27 13-34 1-8-14 1-31 6-45 7-20 6-43 18-61z" fill="#aab5aa"/>'+
          '<path d="M522 155c16 7 25 24 22 42-2 17-18 28-20 45-2 13 7 26 2 38-6 14-25 17-34 5-9-13-2-31 4-45 8-19 10-43 26-57z" fill="#aab5aa"/>'+
          '<path d="M344 271c14 2 24 16 21 31-3 13-16 23-15 37 1 11 10 20 6 31-5 13-23 16-32 6-10-11-4-28 1-41 7-17 5-38 19-49z" fill="#95a59a"/>'+
        '</g>'+
        '<g class="paper-map-layer paper-map-base" data-paper-depth="2" filter="url(#paperDrop)" opacity=".96">'+
          '<path d="M64 98c47-44 110-64 173-49 56 13 108 49 129 97 13 29 8 56-10 75-17 18-42 21-59 40-17 20-19 51-44 61-29 12-63-8-91 3-34 13-71 24-96 1-23-22-2-58-9-89-8-35-34-93 7-139z" fill="#d4d7c8" stroke="#f7f1e5" stroke-width="7"/>'+
          '<path d="M401 128c18 1 31 20 32 39 1 18-10 33-16 49-5 13-5 29-17 36-14 8-27-4-27-18 0-16 11-29 14-44 4-20-4-42 14-62z" fill="#d1d8ce" stroke="#f7f1e5" stroke-width="7"/>'+
          '<path d="M467 80c21 3 35 20 32 41-3 18-19 29-22 46-2 13 7 25 1 37-6 13-25 13-32 2-8-13 0-29 6-43 7-19 5-40 15-58z" fill="#d7d7cc" stroke="#f7f1e5" stroke-width="7"/>'+
          '<path d="M520 145c15 6 24 22 21 39-2 16-17 27-19 43-2 12 7 24 2 35-6 13-23 15-31 4-8-12-2-28 4-41 8-18 9-40 23-55z" fill="#d7d7cc" stroke="#f7f1e5" stroke-width="7"/>'+
          '<path d="M341 261c13 2 22 15 20 29-2 13-15 21-14 34 1 10 9 19 5 29-5 12-21 14-29 5-9-10-4-26 1-38 6-16 5-35 17-45z" fill="#c7d3c8" stroke="#f7f1e5" stroke-width="7"/>'+
          '<circle cx="289" cy="270" r="10" fill="#d2c7b7" stroke="#f7f1e5" stroke-width="6"/>'+
        '</g>'+
        '<g class="paper-map-layer paper-map-cut" data-paper-depth="3" filter="url(#paperGrain)">'+
          '<path d="M77 106c41-35 94-50 148-37 48 11 93 42 112 82 11 24 7 47-8 62-15 15-37 18-52 34-15 17-17 43-39 51-25 10-54-7-79 2-30 11-62 20-84 1-20-19-2-50-8-77-7-30-29-79 10-118z" fill="#e5dfcf"/>'+
          '<path d="M406 139c12 2 20 15 20 28 0 13-8 24-12 36-3 10-3 22-11 27-10 6-19-3-19-13 0-12 8-21 10-32 3-14-3-30 12-46z" fill="#e3e4d9"/>'+
          '<path d="M476 93c14 3 23 15 21 29-2 13-13 21-15 33-1 9 5 18 1 26-4 9-17 9-22 1-5-9 1-20 5-30 5-13 3-28 10-39z" fill="#e8ded8"/>'+
          '<path d="M524 157c10 4 16 15 14 27-1 11-11 18-13 29-1 8 5 16 1 24-4 9-16 10-21 3-6-8-1-19 3-28 5-12 6-27 16-38z" fill="#e8ded8"/>'+
          '<path d="M344 273c9 2 15 11 13 21-2 9-10 15-10 24 1 7 6 13 3 20-3 8-14 10-20 3-6-7-2-18 1-26 5-11 4-25 13-32z" fill="#dce6dc"/>'+
        '</g>'+
        '<g class="history-map-route" fill="none" stroke="url(#paperGoldEdge)" stroke-width="3" stroke-dasharray="5 8" stroke-linecap="round">'+
          '<path d="M208 187C278 155 346 170 410 187s86 13 123 9"/>'+
          '<path d="M235 224c39 18 71 37 98 73"/>'+
        '</g>'+
        '<g class="paper-region-layer" data-paper-region="mainland" transform-origin="210px 185px"><ellipse class="paper-region-glow" cx="210" cy="184" rx="118" ry="82"/><circle class="paper-region-ring" cx="210" cy="184" r="34"/></g>'+
        '<g class="paper-region-layer" data-paper-region="taiwan" transform-origin="344px 308px"><ellipse class="paper-region-glow" cx="344" cy="308" rx="35" ry="61"/><circle class="paper-region-ring" cx="344" cy="308" r="22"/></g>'+
        '<g class="paper-region-layer" data-paper-region="hongkong" transform-origin="289px 270px"><ellipse class="paper-region-glow" cx="289" cy="270" rx="27" ry="23"/><circle class="paper-region-ring" cx="289" cy="270" r="14"/></g>'+
        '<g class="paper-region-layer" data-paper-region="korea" transform-origin="406px 185px"><ellipse class="paper-region-glow" cx="406" cy="185" rx="33" ry="55"/><circle class="paper-region-ring" cx="406" cy="185" r="20"/></g>'+
        '<g class="paper-region-layer" data-paper-region="japan" transform-origin="505px 194px"><ellipse class="paper-region-glow" cx="505" cy="194" rx="64" ry="108"/><circle class="paper-region-ring" cx="505" cy="194" r="24"/></g>'+
        '<g class="paper-region-layer" data-paper-region="other" transform-origin="548px 338px"><ellipse class="paper-region-glow" cx="548" cy="338" rx="58" ry="38"/><circle class="paper-region-ring" cx="548" cy="338" r="22"/></g>'+
        '<g class="history-paper-clouds" fill="#fff" opacity=".56">'+
          '<path class="history-cloud-cut cloud-one" d="M43 72c15-17 40-19 57-5 8-13 27-18 42-9 10 6 15 16 16 27H43c-9 0-12-8-7-13 2-1 4-1 7 0z"/>'+
          '<path class="history-cloud-cut cloud-two" d="M435 331c14-15 35-17 51-5 8-12 25-16 38-8 9 5 14 14 15 24H435c-8 0-11-7-6-11 2-1 4-1 6 0z"/>'+
        '</g>'+
      '</svg>';
  }

  function addPanelDecor(panel,art){
    panel.classList.add('history-paper-map-panel');
    panel.insertAdjacentHTML('afterbegin',
      '<span class="history-paper-corner corner-nw" aria-hidden="true"></span>'+
      '<span class="history-paper-corner corner-ne" aria-hidden="true"></span>'+
      '<span class="history-paper-corner corner-sw" aria-hidden="true"></span>'+
      '<span class="history-paper-corner corner-se" aria-hidden="true"></span>'+
      '<span class="history-panel-thread" aria-hidden="true"></span>'
    );

    var copy=one('.history-map-copy',panel);
    if(copy&&!one('.history-archive-seal',copy)){
      var seal=make('span','history-archive-seal');
      seal.setAttribute('aria-hidden','true');
      seal.innerHTML='<b>史案</b><small>ARCHIVE</small>';
      copy.appendChild(seal);
    }

    if(art&&!one('.history-paper-map-svg',art)){
      art.classList.add('history-paper-map-art');
      art.insertAdjacentHTML('afterbegin',paperMapSvg());
      art.insertAdjacentHTML('beforeend',
        '<span class="history-map-caption" aria-hidden="true"><b>'+((c.history&&c.history[2])||'東亞案件記憶地圖')+'</b><small>MEMORY · PLACE · TIME</small></span>'+
        '<span class="history-map-ink-wash wash-one" aria-hidden="true"></span>'+
        '<span class="history-map-ink-wash wash-two" aria-hidden="true"></span>'
      );
    }
  }

  function decorateMapButtons(art){
    all('[data-open-region]',art).forEach(function(btn,index){
      var key=btn.dataset.openRegion||'other';
      btn.classList.add('history-map-seal-button');
      btn.style.setProperty('--map-order',String(index));
      if(!one('.history-map-seal-mark',btn)){
        btn.insertAdjacentHTML('afterbegin','<span class="history-map-seal-mark" aria-hidden="true">'+(regionMarks[key]||'錄')+'</span>');
      }
    });
  }

  function decorateRegions(zone){
    all('.history-region',zone).forEach(function(details,index){
      var key=details.dataset.region||'other';
      details.classList.add('history-paper-region');
      details.style.setProperty('--region-order',String(index));
      var summary=one('summary',details);
      if(summary&&!one('.history-region-seal',summary)){
        summary.insertAdjacentHTML('afterbegin',
          '<span class="history-region-seal" aria-hidden="true">'+(regionMarks[key]||'錄')+'</span>'+
          '<span class="history-region-fold" aria-hidden="true"></span>'
        );
      }

      var timeline=one('.history-timeline',details);
      if(timeline&&!one('.history-silk-thread',timeline)){
        timeline.insertAdjacentHTML('afterbegin','<span class="history-silk-thread" aria-hidden="true"></span>');
      }

      all('.home-historical-card',details).forEach(function(card,cardIndex){
        card.classList.add('history-paper-file-card');
        card.style.setProperty('--file-order',String(cardIndex));
        if(!one('.history-file-catalog',card)){
          var year=card.dataset.archiveYear||'—';
          var catalog=regionCatalog[key]||'AR';
          card.insertAdjacentHTML('afterbegin',
            '<span class="history-file-catalog" aria-hidden="true"><small>MEMORY FILE</small><b>'+catalog+'-'+String(cardIndex+1).padStart(2,'0')+'</b></span>'+
            '<span class="history-file-corner corner-top" aria-hidden="true"></span>'+
            '<span class="history-file-corner corner-bottom" aria-hidden="true"></span>'+
            '<span class="history-file-year-stamp" aria-hidden="true">'+year+'</span>'
          );
        }
      });
    });
  }

  function updateActiveRegion(zone,key,animate){
    var art=one('.history-map-art',zone);
    if(art)art.dataset.activeRegion=key||'taiwan';
    all('.history-region',zone).forEach(function(details){
      details.classList.toggle('is-active-region',details.dataset.region===key);
    });
    all('[data-open-region]',zone).forEach(function(btn){
      var active=btn.dataset.openRegion===key;
      btn.classList.toggle('is-active-region',active);
      if(active&&animate&&window.gsap&&!reduce){
        window.gsap.fromTo(btn,{scale:.92,rotate:-2},{scale:1,rotate:0,duration:.52,ease:'back.out(2)',clearProps:'transform'});
        var mark=one('.history-map-seal-mark',btn);
        if(mark)window.gsap.fromTo(mark,{scale:1.34,rotate:-12},{scale:1,rotate:0,duration:.52,ease:'back.out(2.2)',clearProps:'transform'});
      }
    });
  }

  function animateOpenRegion(details){
    if(!window.gsap||reduce)return;
    var gsap=window.gsap;
    var thread=one('.history-silk-thread',details);
    var cards=all('.history-paper-file-card',details);
    var seal=one('.history-region-seal',details);
    if(thread)gsap.fromTo(thread,{scaleY:0,transformOrigin:'50% 0%'},{scaleY:1,duration:.85,ease:'power2.out'});
    if(seal)gsap.fromTo(seal,{scale:1.22,rotate:-9},{scale:1,rotate:0,duration:.46,ease:'back.out(2)',clearProps:'transform'});
    if(cards.length)gsap.fromTo(cards,{y:24,autoAlpha:0,rotateX:-2},{y:0,autoAlpha:1,rotateX:0,duration:.66,stagger:.09,ease:'power3.out',clearProps:'transform,opacity,visibility'});
  }

  function bindInteractions(zone){
    var art=one('.history-map-art',zone);
    all('[data-open-region]',zone).forEach(function(btn){
      btn.addEventListener('click',function(){
        updateActiveRegion(zone,btn.dataset.openRegion,true);
      });
    });

    all('.history-region',zone).forEach(function(details){
      details.addEventListener('toggle',function(){
        if(!details.open)return;
        updateActiveRegion(zone,details.dataset.region,true);
        animateOpenRegion(details);
      });
    });

    var initial=one('.history-region[open]',zone)||one('.history-region',zone);
    if(initial)updateActiveRegion(zone,initial.dataset.region,false);

    if(art&&window.matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
      var layers=all('[data-paper-depth]',art);
      art.addEventListener('pointermove',function(event){
        var rect=art.getBoundingClientRect();
        var nx=(event.clientX-rect.left)/rect.width-.5;
        var ny=(event.clientY-rect.top)/rect.height-.5;
        if(window.gsap){
          layers.forEach(function(layer,index){
            var power=(index+1)*2.6;
            window.gsap.to(layer,{x:nx*power,y:ny*power,duration:.7,ease:'power2.out',overwrite:'auto'});
          });
        }
      });
      art.addEventListener('pointerleave',function(){
        if(window.gsap)window.gsap.to(layers,{x:0,y:0,duration:.8,ease:'power3.out',overwrite:'auto'});
      });
    }
  }

  function initMotion(zone){
    if(!window.gsap||reduce)return;
    var gsap=window.gsap;
    var ScrollTrigger=window.ScrollTrigger;
    var panel=one('.history-paper-map-panel',zone);
    var layers=all('[data-paper-depth]',zone);
    var clouds=all('.history-cloud-cut',zone);
    var routes=all('.history-map-route path',zone);

    if(panel){
      gsap.fromTo(panel,{y:28,autoAlpha:0,rotate:-.5},{y:0,autoAlpha:1,rotate:0,duration:.9,ease:'power3.out',clearProps:'transform,opacity,visibility',scrollTrigger:ScrollTrigger?{trigger:panel,start:'top 88%',once:true}:undefined});
    }

    layers.forEach(function(layer,index){
      gsap.to(layer,{yPercent:index%2?3:-3,xPercent:index===1?1.5:-1.5,ease:'none',scrollTrigger:ScrollTrigger?{trigger:zone,start:'top bottom',end:'bottom top',scrub:.8}:undefined});
    });

    clouds.forEach(function(cloud,index){
      gsap.to(cloud,{x:index?12:-14,duration:index?7.5:9,repeat:-1,yoyo:true,ease:'sine.inOut'});
    });

    routes.forEach(function(path,index){
      var length=path.getTotalLength?path.getTotalLength():300;
      gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});
      gsap.to(path,{strokeDashoffset:0,duration:1.5,delay:index*.16,ease:'power2.out',scrollTrigger:ScrollTrigger?{trigger:zone,start:'top 76%',once:true}:undefined});
    });

    var seal=one('.history-archive-seal',zone);
    if(seal)gsap.fromTo(seal,{scale:1.42,rotate:-13,autoAlpha:0},{scale:1,rotate:0,autoAlpha:1,duration:.7,ease:'back.out(2)',scrollTrigger:ScrollTrigger?{trigger:seal,start:'top 91%',once:true}:undefined});
  }

  function decorate(){
    injectStyles();
    var zone=one('#home-historical-cases');
    if(!zone||zone.dataset.paperArchiveDeluxe==='true')return;
    var shell=one('.history-archive-v3',zone);
    var panel=one('.history-map-panel',zone);
    var art=one('.history-map-art',zone);
    if(!shell||!panel||!art)return;

    zone.dataset.paperArchiveDeluxe='true';
    zone.classList.add('paper-archive-deluxe');
    shell.classList.add('history-paper-archive');
    addPanelDecor(panel,art);
    decorateMapButtons(art);
    decorateRegions(zone);
    bindInteractions(zone);
    initMotion(zone);

    setTimeout(function(){
      if(window.ScrollTrigger&&window.ScrollTrigger.refresh)window.ScrollTrigger.refresh();
    },180);
  }

  H.features.history=function(){
    if(typeof originalHistory==='function')originalHistory();
    decorate();
  };
})();
