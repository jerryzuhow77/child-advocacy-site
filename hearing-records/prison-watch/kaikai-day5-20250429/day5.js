
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
  const setChapterState=(card,expanded)=>{const btn=card?.querySelector('.day5-chapter-toggle');if(!card||!btn)return;card.classList.toggle('is-collapsed',!expanded);btn.textContent=expanded?'−':'+';btn.setAttribute('aria-expanded',String(expanded));const title=card.querySelector('h3')?.textContent?.trim()||'本章';btn.setAttribute('aria-label',`${expanded?'收合':'展開'}：${title}`);};
  chapters.forEach((card,index)=>setChapterState(card,index===0));
  document.querySelectorAll('.day5-chapter-toggle').forEach(btn=>btn.addEventListener('click',event=>{event.stopPropagation();const card=btn.closest('.day5-record-chapter');setChapterState(card,card.classList.contains('is-collapsed'));}));
  chapters.forEach(card=>card.querySelector(':scope > header')?.addEventListener('click',()=>setChapterState(card,card.classList.contains('is-collapsed'))));
  document.querySelector('[data-record-action="open"]')?.addEventListener('click',()=>chapters.forEach(card=>setChapterState(card,true)));
  document.querySelector('[data-record-action="close"]')?.addEventListener('click',()=>chapters.forEach(card=>setChapterState(card,false)));
  document.querySelector('[data-record-action="hide"]')?.addEventListener('click',()=>body.classList.add('hide-highlights'));
  document.querySelector('[data-record-action="show"]')?.addEventListener('click',()=>body.classList.remove('hide-highlights'));
  const compareGrid=document.querySelector('.day5-compare-grid');
  const compareCards=[...document.querySelectorAll('.day5-compare-card')];
  const comparison=document.getElementById('comparison');
  if(compareGrid&&comparison){
    const filters=document.createElement('div');
    filters.className='day5-compare-filters';
    filters.setAttribute('role','group');
    filters.setAttribute('aria-label','篩選醫師證詞對照');
    const options=[['all','全部'],['is-agree','共同結論'],['is-complement','互補視角'],['is-difference','表述差異'],['is-limit','鑑定界線']];
    options.forEach(([key,label],index)=>{const button=document.createElement('button');button.type='button';button.className='day5-compare-filter';button.dataset.compareFilter=key;button.textContent=label;button.setAttribute('aria-pressed',String(index===0));filters.append(button);});
    compareGrid.before(filters);
    filters.addEventListener('click',event=>{const button=event.target.closest('[data-compare-filter]');if(!button)return;filters.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));const key=button.dataset.compareFilter;compareCards.forEach(card=>card.hidden=key!=='all'&&!card.classList.contains(key));});
    const mobileLabels={'+':'兩者互補','≈':'大致相符','≠':'表述不同','＝':'共同結論'};
    document.querySelectorAll('.day5-compare-sides>i').forEach(symbol=>symbol.dataset.mobileLabel=mobileLabels[symbol.textContent.trim()]||'對照');
  }
  const fullRecord=document.getElementById('full-record');
  if(fullRecord){
    const back=document.createElement('a');back.href='#comparison';back.className='day5-back-to-comparison';back.textContent='↑ 返回醫師證詞對照';fullRecord.prepend(back);
  }
  const openHashChapter=()=>{const target=document.querySelector(location.hash);const card=target?.closest('.day5-record-chapter');if(card){setChapterState(card,true);body.classList.add('day5-record-active');}};
  document.querySelectorAll('.day5-compare-links a').forEach(link=>link.addEventListener('click',()=>setTimeout(openHashChapter,0)));
  addEventListener('hashchange',openHashChapter);openHashChapter();
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
    gsap.utils.toArray('.day5-expert-grid article,.day5-note-grid article,.day5-evidence-grid article,.day5-comparison article,.day5-compare-card').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 88%',once:true},y:24,opacity:0,duration:.65,ease:'power2.out'}));
  }
})();
