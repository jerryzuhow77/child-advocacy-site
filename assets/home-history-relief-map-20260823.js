(function(){
  'use strict';
  var H=window.HomeIA2;if(!H)return;
  var one=H.one,all=H.all,make=H.make,reduce=H.reduce;
  var originalHistory=H.features.history;
  var VERSION='20260823-relief-map-reference-2';
  var language=(H.locale||document.documentElement.lang||'zh-Hant').toLowerCase();
  var locale=language.indexOf('zh-hans')===0||language.indexOf('zh-cn')===0?'zh-Hans':language.indexOf('en')===0?'en':language.indexOf('ja')===0?'ja':'zh-Hant';
  var words={
    'zh-Hant':{alt:'東亞案件記憶地圖，以精緻立體多層紙雕呈現大陸、台灣、香港、日本、韓國與周邊海域',guide:'點選地區圖章，展開案件年代與檔案',label:'東亞案件記憶地圖地區選擇'},
    'zh-Hans':{alt:'东亚案件记忆地图，以精致立体多层纸雕呈现大陆、台湾、香港、日本、韩国与周边海域',guide:'点击地区图章，展开案件年代与档案',label:'东亚案件记忆地图地区选择'},
    en:{alt:'East Asia case memory map rendered as an intricate multilevel paper-cut relief artwork',guide:'Select a regional seal to open its timeline and case archive',label:'Choose a region on the East Asia case memory map'},
    ja:{alt:'東アジア事件記憶地図を精緻な多層切り絵レリーフ作品で表現',guide:'地域の印章を選び、年代と事件資料を開きます',label:'東アジア事件記憶地図の地域選択'}
  };
  function injectStyles(){
    if(document.getElementById('home-history-relief-map-styles'))return;
    var link=document.createElement('link');
    link.id='home-history-relief-map-styles';link.rel='stylesheet';
    link.href=H.base+'home-history-relief-map-20260823.css?v='+VERSION;
    document.head.appendChild(link);
  }
  function selectedButton(buttons){
    return buttons.filter(function(btn){return btn.getAttribute('aria-pressed')==='true';})[0]||buttons[0];
  }
  function enhance(){
    var panel=one('.history-map-panel');
    var art=panel&&one('.history-map-art',panel);
    if(!panel||!art||art.dataset.reliefMapReady==='true')return;
    injectStyles();
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
      '<img class="history-relief-image" src="'+H.base+'art/east-asia-case-memory-map-relief-20260823.webp?v='+VERSION+'" width="1200" height="675" loading="lazy" decoding="async" alt="'+words[locale].alt+'">'+
      '<span class="history-relief-inner-frame" aria-hidden="true"></span>'+
      '<span class="history-relief-sheen" aria-hidden="true"></span>'+
      '<span class="history-relief-cover-cloud" aria-hidden="true"><i></i><i></i><i></i></span>'+
      '<span class="history-relief-aura" aria-hidden="true"></span>'+
      '<figcaption class="history-relief-caption">'+words[locale].guide+'</figcaption>';
    art.insertBefore(figure,art.firstChild);
    var dock=make('div','history-relief-region-dock');
    dock.setAttribute('role','group');dock.setAttribute('aria-label',words[locale].label);
    buttons.forEach(function(btn,index){
      btn.classList.add('history-relief-pin');
      btn.style.removeProperty('--map-order');
      btn.style.setProperty('--relief-order',String(index));
      dock.appendChild(btn);
    });
    art.appendChild(dock);
    function sync(region){
      if(!region)return;
      art.dataset.activeRegion=region;
      buttons.forEach(function(btn){btn.classList.toggle('is-relief-active',btn.dataset.openRegion===region);});
    }
    var initial=selectedButton(buttons);sync(initial&&initial.dataset.openRegion);
    buttons.forEach(function(btn){
      btn.addEventListener('click',function(){sync(btn.dataset.openRegion);});
      new MutationObserver(function(){if(btn.getAttribute('aria-pressed')==='true')sync(btn.dataset.openRegion);}).observe(btn,{attributes:true,attributeFilter:['aria-pressed']});
    });
    if(window.gsap&&!reduce){
      window.gsap.fromTo(figure,{y:26,scale:.962,autoAlpha:0},{y:0,scale:1,autoAlpha:1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:figure,start:'top 90%',once:true}});
      window.gsap.fromTo(buttons,{y:10,scale:.8,autoAlpha:0},{y:0,scale:1,autoAlpha:1,duration:.5,stagger:.055,ease:'back.out(1.65)',scrollTrigger:{trigger:figure,start:'top 86%',once:true}});
      var image=one('.history-relief-image',figure);
      if(image&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
        figure.addEventListener('pointermove',function(event){
          var r=figure.getBoundingClientRect();
          var x=(event.clientX-r.left)/r.width-.5;
          var y=(event.clientY-r.top)/r.height-.5;
          window.gsap.to(image,{xPercent:x*1.25,yPercent:y*.95,scale:1.018,duration:.55,ease:'power2.out',overwrite:true});
        });
        figure.addEventListener('pointerleave',function(){window.gsap.to(image,{xPercent:0,yPercent:0,scale:1,duration:.7,ease:'power2.out',overwrite:true});});
      }
    }
  }
  H.features.history=function(){if(originalHistory)originalHistory();enhance();};
})();
