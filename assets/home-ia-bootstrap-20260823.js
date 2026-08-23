(function(){
  'use strict';
  var H=window.HomeIA2;if(!H)return;
  var mobile=window.matchMedia('(max-width:760px)').matches;

  function loadMobileVisibilityStyles(){
    if(document.getElementById('home-history-mobile-visibility-styles'))return;
    var link=document.createElement('link');
    link.id='home-history-mobile-visibility-styles';
    link.rel='stylesheet';
    link.href=H.base+'home-history-mobile-visibility-20260824.css?v=20260824-mobile-visible-1';
    document.head.appendChild(link);
  }

  function forceMobileHistoryVisible(){
    if(!mobile)return;
    var zone=document.getElementById('home-historical-cases');
    if(!zone)return;
    zone.dataset.mobileMapVisible='true';
    document.body.classList.add('mobile-history-map-visible');

    if(window.ScrollTrigger&&window.ScrollTrigger.getAll){
      window.ScrollTrigger.getAll().forEach(function(trigger){
        var target=trigger&&trigger.trigger;
        if(target&&zone.contains(target))trigger.kill(true);
      });
    }

    var selectors=[
      '.history-archive-v3','.history-map-panel','.history-map-copy','.history-map-art',
      '.history-relief-figure','.history-relief-image','.history-relief-region-dock',
      '.history-relief-pin','.history-region-list','.history-region','.history-timeline',
      '.history-paper-file-card','.home-historical-card'
    ].join(',');
    var nodes=H.all(selectors,zone);
    if(window.gsap){
      window.gsap.killTweensOf(nodes);
      window.gsap.set(nodes,{autoAlpha:1,x:0,y:0,scale:1,rotate:0,clearProps:'opacity,visibility,transform'});
    }
    nodes.forEach(function(node){
      node.style.setProperty('opacity','1','important');
      node.style.setProperty('visibility','visible','important');
    });
    H.all('.history-map-panel,.history-relief-figure,.history-relief-image',zone).forEach(function(node){
      node.style.setProperty('transform','none','important');
    });

    var image=zone.querySelector('.history-relief-image');
    if(image){
      image.loading='eager';
      try{image.fetchPriority='high';}catch(error){}
      if(!image.complete){image.addEventListener('load',forceMobileHistoryVisible,{once:true});}
    }
  }

  function run(){
    var body=document.body;if(!body||body.dataset.homeIaFinal==='true')return;
    body.dataset.homeIaFinal='true';
    body.classList.add('home-ia-v2');
    loadMobileVisibilityStyles();
    if(!document.getElementById('home-ia-v2-final-styles')){
      var link=document.createElement('link');
      link.id='home-ia-v2-final-styles';
      link.rel='stylesheet';
      link.href=H.base+'home-ia-v2-final.css?v=20260824-mobile-visible-1';
      document.head.appendChild(link);
    }
    H.replaceMainland(document.body);
    if(H.features.layout)H.features.layout();
    if(H.features.history)H.features.history();
    if(H.features.hearingCampaign)H.features.hearingCampaign();

    forceMobileHistoryVisible();
    requestAnimationFrame(forceMobileHistoryVisible);
    setTimeout(forceMobileHistoryVisible,220);
    setTimeout(forceMobileHistoryVisible,850);

    if(window.gsap&&!H.reduce){
      var gsap=window.gsap;
      H.all('.ia-chapter-head').forEach(function(x){gsap.fromTo(x,{y:24,opacity:0},{y:0,opacity:1,duration:.68,ease:'power3.out',scrollTrigger:{trigger:x,start:'top 90%',once:true}});});
      if(!mobile){
        H.all('.history-map-panel,.ia-wall-purpose,.ia-wall-actions').forEach(function(x){gsap.fromTo(x,{y:20,opacity:0},{y:0,opacity:1,duration:.62,ease:'power2.out',scrollTrigger:{trigger:x,start:'top 90%',once:true}});});
        H.all('.map-dot').forEach(function(x,i){gsap.fromTo(x,{scale:.84,opacity:0},{scale:1,opacity:1,duration:.42,delay:i*.035,ease:'back.out(1.5)',scrollTrigger:{trigger:x.parentElement,start:'top 88%',once:true}});});
      }else{
        H.all('.ia-wall-purpose,.ia-wall-actions').forEach(function(x){gsap.fromTo(x,{y:14,opacity:0},{y:0,opacity:1,duration:.5,ease:'power2.out',scrollTrigger:{trigger:x,start:'top 92%',once:true}});});
      }
    }
    setTimeout(function(){
      forceMobileHistoryVisible();
      if(window.ScrollTrigger&&window.ScrollTrigger.refresh)window.ScrollTrigger.refresh();
    },180);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
