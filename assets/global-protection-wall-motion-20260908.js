(function(){
  'use strict';
  const gsap=window.gsap;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let running=false;

  window.guardianWallTransition=function(options){
    if(running)return;
    running=true;
    const navigate=options&&options.navigate;
    if(!gsap||reduced){if(typeof navigate==='function')navigate();return;}
    const header=document.querySelector('.portal-header');
    const purpose=document.querySelector('.portal-purpose');
    const frame=document.querySelector('.portal-frame-shell');
    const loader=document.querySelector('.portal-loader');
    const regionButtons=[...document.querySelectorAll('[data-wall-region]')];
    const active=regionButtons.find(button=>button.dataset.wallRegion===options.region);
    if(active)active.setAttribute('aria-pressed','true');
    document.body.classList.add('portal-is-navigating');
    gsap.timeline({defaults:{ease:'power2.inOut'},onComplete:()=>{if(typeof navigate==='function')navigate();}})
      .to([header,purpose],{y:-8,autoAlpha:.7,duration:.24},0)
      .to(frame,{scale:.985,autoAlpha:.55,duration:.28},0)
      .fromTo(loader,{autoAlpha:0,scale:.96},{autoAlpha:1,scale:1,duration:.3},.08)
      .fromTo(loader.querySelector('span'),{rotation:-8,scale:.82},{rotation:0,scale:1,duration:.34,ease:'back.out(1.8)'},.12);
  };
})();
