(function(){
  'use strict';
  var H=window.HomeIA2;if(!H)return;
  function run(){
    var body=document.body;if(!body||body.dataset.homeIaFinal==='true')return;
    body.dataset.homeIaFinal='true';
    body.classList.add('home-ia-v2');
    if(!document.getElementById('home-ia-v2-final-styles')){
      var link=document.createElement('link');
      link.id='home-ia-v2-final-styles';
      link.rel='stylesheet';
      link.href=H.base+'home-ia-v2-final.css?v=20260823-qa916-1';
      document.head.appendChild(link);
    }
    H.replaceMainland(document.body);
    if(H.features.layout)H.features.layout();
    if(H.features.history)H.features.history();
    if(H.features.hearingCampaign)H.features.hearingCampaign();
    if(window.gsap&&!H.reduce){
      var gsap=window.gsap;
      H.all('.ia-chapter-head').forEach(function(x){gsap.fromTo(x,{y:24,opacity:0},{y:0,opacity:1,duration:.68,ease:'power3.out',scrollTrigger:{trigger:x,start:'top 90%',once:true}});});
      H.all('.history-map-panel,.ia-wall-purpose,.ia-wall-actions').forEach(function(x){gsap.fromTo(x,{y:20,opacity:0},{y:0,opacity:1,duration:.62,ease:'power2.out',scrollTrigger:{trigger:x,start:'top 90%',once:true}});});
      H.all('.map-dot').forEach(function(x,i){gsap.fromTo(x,{scale:.84,opacity:0},{scale:1,opacity:1,duration:.42,delay:i*.035,ease:'back.out(1.5)',scrollTrigger:{trigger:x.parentElement,start:'top 88%',once:true}});});
    }
    setTimeout(function(){if(window.ScrollTrigger&&window.ScrollTrigger.refresh)window.ScrollTrigger.refresh();},180);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
