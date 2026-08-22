
(() => {
  'use strict';
  const body=document.body;
  const params=new URLSearchParams(location.search);
  const simplified=params.get('lang')==='zh-Hans'||localStorage.getItem('siteLang')==='zh-Hans';
  if(simplified){
    document.querySelectorAll('[data-day5-poster]').forEach(img=>{if(img.dataset.simplified)img.src=img.dataset.simplified;});
    const transcript=document.querySelector('#full-record .day3-transcript');
    const originalTranscript=transcript?.innerHTML||'';
    const run=()=>{
      if(typeof window.setLang==='function')window.setLang('zh-Hans');
      if(transcript&&originalTranscript)transcript.innerHTML=originalTranscript;
    };
    run(); setTimeout(run,120);
  }
  const menu=document.querySelector('.day3-menu');
  const toc=document.getElementById('day5Toc');
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));toc?.classList.toggle('is-open',!open);});
  toc?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toc.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}));
  const chapters=[...document.querySelectorAll('.day5-record-chapter')];
  document.querySelectorAll('.day5-chapter-toggle').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.day5-record-chapter');const collapsed=card.classList.toggle('is-collapsed');btn.textContent=collapsed?'+':'−';btn.setAttribute('aria-expanded',String(!collapsed));}));
  document.querySelector('[data-record-action="open"]')?.addEventListener('click',()=>chapters.forEach(card=>{card.classList.remove('is-collapsed');const b=card.querySelector('.day5-chapter-toggle');if(b){b.textContent='−';b.setAttribute('aria-expanded','true');}}));
  document.querySelector('[data-record-action="close"]')?.addEventListener('click',()=>chapters.forEach(card=>{card.classList.add('is-collapsed');const b=card.querySelector('.day5-chapter-toggle');if(b){b.textContent='+';b.setAttribute('aria-expanded','false');}}));
  document.querySelector('[data-record-action="hide"]')?.addEventListener('click',()=>body.classList.add('hide-highlights'));
  document.querySelector('[data-record-action="show"]')?.addEventListener('click',()=>body.classList.remove('hide-highlights'));
  const progress=document.querySelector('.day3-record-progress');
  const full=document.getElementById('full-record');
  const update=()=>{
    if(!full||!progress)return;
    const rect=full.getBoundingClientRect();
    const total=Math.max(1,full.offsetHeight-innerHeight);
    const passed=Math.min(total,Math.max(0,-rect.top));
    const pct=Math.round(passed/total*100);
    progress.querySelector('i')?.style.setProperty('transform',`scaleX(${Math.max(.03,pct/100)})`);
    const label=progress.querySelector('b');if(label)label.textContent=`${pct}%`;
  };
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
  if(window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    gsap.utils.toArray('.day5-expert-grid article,.day5-note-grid article,.day5-evidence-grid article,.day5-comparison article').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 88%',once:true},y:24,opacity:0,duration:.65,ease:'power2.out'}));
  }
})();
