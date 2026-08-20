(()=>{
  'use strict';
  const menu=document.querySelector('.day1-menu');
  const toc=document.querySelector('.day1-toc');
  menu?.addEventListener('click',()=>{const open=!toc.classList.contains('is-open');toc.classList.toggle('is-open',open);menu.setAttribute('aria-expanded',String(open));});
  toc?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toc.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}));

  const progress=document.querySelector('.day1-progress i');
  const links=[...(toc?.querySelectorAll('a')||[])];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const update=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    const ratio=max>0?Math.min(1,scrollY/max):0;
    if(progress) progress.style.transform=`scaleX(${ratio})`;
    let current=sections[0];sections.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*.42)current=s;});
    links.forEach(a=>a.classList.toggle('is-active',current&&a.getAttribute('href')==='#'+current.id));
  };
  addEventListener('scroll',update,{passive:true});update();

  if(!window.gsap||!window.ScrollTrigger||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.day1-hero-copy>*',{y:30,autoAlpha:0,duration:.9,stagger:.08,ease:'power3.out'});
  gsap.from('.day1-hero-poster',{x:55,rotate:5,autoAlpha:0,duration:1.2,ease:'power3.out'});
  gsap.to('.day1-hero-paper',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.day1-hero',start:'top top',end:'bottom top',scrub:1}});
  gsap.utils.toArray('.day1-reveal').forEach((el,i)=>gsap.fromTo(el,{y:42,autoAlpha:0},{y:0,autoAlpha:1,duration:.78,delay:(i%3)*.035,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}}));
  gsap.utils.toArray('.day1-issues article').forEach((card,i)=>gsap.from(card,{x:i%2?-36:36,autoAlpha:0,duration:.7,scrollTrigger:{trigger:card,start:'top 87%',once:true}}));
  gsap.to('.day1-closing-door i:first-child',{xPercent:-18,ease:'none',scrollTrigger:{trigger:'.day1-closing',start:'top 70%',end:'center 45%',scrub:1}});
  gsap.to('.day1-closing-door i:last-child',{xPercent:18,ease:'none',scrollTrigger:{trigger:'.day1-closing',start:'top 70%',end:'center 45%',scrub:1}});
})();
