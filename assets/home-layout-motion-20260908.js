(function(){
  'use strict';
  const gsap=window.gsap;
  const ScrollTrigger=window.ScrollTrigger;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!gsap||reduced)return;

  document.documentElement.classList.add('home-motion-ready');
  if(ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ignoreMobileResize:true,limitCallbacks:true});
  }

  const compact=window.matchMedia('(max-width: 760px)').matches;
  const saveData=Boolean(navigator.connection&&navigator.connection.saveData);
  const heroCopy=document.querySelector('.premium-hero-copy');
  const heroArt=document.querySelector('.premium-hero-art');
  const sectionIndex=document.querySelector('.home-section-index');

  const intro=gsap.timeline({defaults:{ease:'power3.out'}});
  if(heroCopy&&!compact)intro.from(heroCopy.children,{autoAlpha:0,y:28,duration:.72,stagger:.07,clearProps:'opacity,visibility,transform'});
  if(heroArt)intro.from(heroArt,{autoAlpha:0,x:compact?0:34,y:compact?18:0,scale:.965,duration:.9,clearProps:'opacity,visibility,transform'},compact?'-=.38':'-=.62');
  if(sectionIndex)intro.from(sectionIndex,{autoAlpha:0,y:-16,duration:.45,clearProps:'opacity,visibility,transform'},'-=.28');

  if(ScrollTrigger){
    const groups=[
      '.home-priority-links > a',
      '.home-pinned-report-card:not([data-pinned-clone])',
      '.home-activity-feature,.home-activity-record-divider',
      '.home-court-schedule article,.home-hearing-zone article',
      '.home-special-zone article,.home-special-zone a',
      '.home-social-cases-section article,.home-social-cases-section a',
      '.home-historical-card',
      '.impact-metric-card,.mission-card',
      '.social-ai-preview'
    ];
    groups.forEach(selector=>{
      const nodes=gsap.utils.toArray(selector).filter(node=>node.offsetParent!==null);
      if(!nodes.length)return;
      ScrollTrigger.batch(nodes,{
        start:'top 88%',
        once:true,
        onEnter:batch=>gsap.fromTo(batch,{autoAlpha:0,y:compact?16:26,scale:.985},{autoAlpha:1,y:0,scale:1,duration:compact?.5:.68,stagger:compact?.035:.065,ease:'power2.out',clearProps:'opacity,visibility,transform'})
      });
    });

    const progress=document.createElement('span');
    progress.className='home-reading-progress';
    progress.setAttribute('aria-hidden','true');
    document.body.appendChild(progress);
    gsap.to(progress,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.25}});

    document.querySelectorAll('.home-section-index a').forEach(link=>{
      const target=document.querySelector(link.getAttribute('href'));
      if(!target)return;
      ScrollTrigger.create({trigger:target,start:'top 32%',end:'bottom 32%',toggleClass:{targets:link,className:'is-active'}});
    });
  }

  if(!compact&&!saveData){
    const art=document.querySelector('.premium-art-card');
    if(heroArt&&art){
      heroArt.addEventListener('pointermove',event=>{
        const rect=heroArt.getBoundingClientRect();
        const x=(event.clientX-rect.left)/rect.width-.5;
        const y=(event.clientY-rect.top)/rect.height-.5;
        gsap.to(art,{rotationY:x*5,rotationX:y*-4,x:x*7,y:y*5,duration:.7,ease:'power2.out',transformPerspective:900,overwrite:'auto'});
      });
      heroArt.addEventListener('pointerleave',()=>gsap.to(art,{rotationY:0,rotationX:0,x:0,y:0,duration:.8,ease:'power3.out',overwrite:'auto'}));
    }
    gsap.to('.premium-art-glow',{scale:1.06,autoAlpha:.68,duration:3.8,repeat:-1,yoyo:true,ease:'sine.inOut'});
    gsap.to('.premium-art-orbit.orbit-one',{rotation:360,duration:42,repeat:-1,ease:'none'});
    gsap.to('.premium-art-orbit.orbit-two',{rotation:-360,duration:58,repeat:-1,ease:'none'});
  }

  window.addEventListener('load',()=>{if(ScrollTrigger)window.setTimeout(()=>ScrollTrigger.refresh(),180);},{once:true});
})();
