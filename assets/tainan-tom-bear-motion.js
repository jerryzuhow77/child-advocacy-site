(()=>{
  'use strict';
  const hero=document.querySelector('.hero');
  const sections=[...document.querySelectorAll('main>.section')];
  if(!hero||!sections.length)return;
  const lang=(document.documentElement.lang||'zh-Hant').toLowerCase();
  const words=lang.startsWith('ja')
    ?{seal:'記憶\nと保護',scroll:'スクロール',nav:['はじめに','確認事項','読み方','出典']}
    :lang.startsWith('en')
      ?{seal:'MEMORY\n& CARE',scroll:'Scroll to read',nav:['Opening','Confirmed','Reading','Sources']}
      :lang.includes('hans')
        ?{seal:'记忆\n与守护',scroll:'向下阅读',nav:['开场','确认节点','阅读原则','公开来源']}
        :{seal:'記憶\n與守護',scroll:'向下閱讀',nav:['開場','確認節點','閱讀原則','公開來源']};
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData=Boolean(navigator.connection&&navigator.connection.saveData);
  document.body.classList.add('ttb-motion-page');
  hero.id=hero.id||'feature-opening';

  const stage=document.createElement('div');
  stage.className='case-opening-stage';
  stage.setAttribute('aria-hidden','true');
  stage.innerHTML=`<div class="motion-halo"></div><div class="motion-ring r1"></div><div class="motion-ring r2"></div><div class="motion-ring r3"></div><svg class="memory-thread" viewBox="0 0 500 500"><path d="M45 310 C115 100 205 425 270 225 S410 105 462 260"/></svg><span class="motion-token t1"></span><span class="motion-token t2"></span><span class="motion-token t3"></span><span class="motion-token t4"></span><span class="motion-token t5"></span><div class="motion-seal">${words.seal.replace('\n','<br>')}</div>`;
  hero.prepend(stage);
  const cue=document.createElement('div');cue.className='case-scroll-cue';cue.textContent=words.scroll;hero.append(cue);

  const all=[hero,...sections];
  all.forEach((section,index)=>{section.id=section.id||`case-section-${index}`});
  const rail=document.createElement('nav');rail.className='case-motion-rail';rail.setAttribute('aria-label',words.nav[0]);
  all.forEach((section,index)=>{const a=document.createElement('a');a.href=`#${section.id}`;a.setAttribute('aria-label',words.nav[index]||String(index+1));if(index===0)a.classList.add('is-active');rail.append(a)});
  document.body.append(rail);

  const cards=[...document.querySelectorAll('.grid .card')];
  cards.forEach((card,index)=>card.dataset.step=String(index+1).padStart(2,'0'));
  const grid=document.querySelector('.grid');
  if(grid){const line=document.createElement('svg');line.className='case-timeline-line';line.setAttribute('viewBox','0 0 800 44');line.setAttribute('preserveAspectRatio','none');line.setAttribute('aria-hidden','true');line.innerHTML='<path d="M0 32 C135 4 262 42 400 18 S672 2 800 25"/>';grid.prepend(line)}

  const setProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;const progress=max>0?Math.min(100,Math.max(0,scrollY/max*100)):0;document.documentElement.style.setProperty('--progress',`${progress}%`)};
  addEventListener('scroll',setProgress,{passive:true});addEventListener('resize',setProgress,{passive:true});setProgress();
  const activeObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const index=all.indexOf(entry.target);[...rail.children].forEach((dot,i)=>dot.classList.toggle('is-active',i===index))}),{rootMargin:'-35% 0px -55%',threshold:0});
  all.forEach(section=>activeObserver.observe(section));

  const revealFallback=()=>{
    const targets=sections.flatMap(section=>[...section.querySelectorAll('.eyebrow,h2,.card,.sources li,.home,.wrap>p:not(.eyebrow)')]);
    targets.forEach(node=>node.classList.add('js-motion-reveal'));
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:680,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});io.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -7%'});
    targets.forEach(node=>io.observe(node));
    stage.querySelectorAll('.motion-ring').forEach((ring,i)=>ring.animate([{transform:'rotate(0deg)'},{transform:`rotate(${i%2?-360:360}deg)`}],{duration:18000+i*5000,iterations:Infinity}));
  };

  const initGsap=()=>{
    const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;
    if(!gsap||!ScrollTrigger){revealFallback();return}
    gsap.registerPlugin(ScrollTrigger);
    const opening=gsap.timeline({defaults:{ease:'power3.out'}});
    opening.from(stage,{autoAlpha:0,scale:.84,rotation:-4,duration:1.05})
      .from(stage.querySelectorAll('.motion-ring'),{autoAlpha:0,scale:.72,duration:.8,stagger:.12},.12)
      .from(stage.querySelectorAll('.motion-token'),{autoAlpha:0,scale:0,rotation:-35,duration:.55,stagger:.09,ease:'back.out(1.8)'},.25)
      .from(hero.querySelectorAll('.eyebrow,h1,.lead,.notice'),{autoAlpha:0,y:25,duration:.72,stagger:.11},.18)
      .from(cue,{autoAlpha:0,y:12,duration:.5},.82);
    const path=stage.querySelector('.memory-thread path');
    const length=path.getTotalLength();gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});gsap.to(path,{strokeDashoffset:0,duration:1.7,delay:.3,ease:'power2.inOut'});
    gsap.to(stage.querySelector('.r1'),{rotation:360,duration:34,repeat:-1,ease:'none'});
    gsap.to(stage.querySelector('.r2'),{rotation:-360,duration:24,repeat:-1,ease:'none'});
    gsap.to(stage.querySelector('.r3'),{rotation:360,duration:18,repeat:-1,ease:'none'});
    gsap.to(stage.querySelectorAll('.motion-token'),{y:(i)=>i%2?8:-9,rotation:(i)=>i%2?50:40,duration:(i)=>2.8+i*.38,repeat:-1,yoyo:true,ease:'sine.inOut',stagger:.08});
    gsap.to(stage,{yPercent:10,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7}});
    sections.forEach((section,index)=>{
      const head=section.querySelectorAll('.eyebrow,h2');
      const body=[...section.querySelectorAll('.wrap>p:not(.eyebrow),.sources li,.home')];
      if(head.length)gsap.from(head,{autoAlpha:0,y:20,duration:.62,stagger:.08,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 82%',once:true}});
      if(index===0&&cards.length){
        gsap.from(cards,{autoAlpha:0,y:34,rotation:(i)=>i%2?-.7:.7,duration:.72,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:grid,start:'top 82%',once:true}});
        const timelinePath=grid.querySelector('path');
        if(timelinePath){const l=timelinePath.getTotalLength();gsap.set(timelinePath,{strokeDasharray:l,strokeDashoffset:l});gsap.to(timelinePath,{strokeDashoffset:0,duration:1.45,ease:'power2.out',scrollTrigger:{trigger:grid,start:'top 82%',once:true}})}
      }
      if(body.length)gsap.from(body,{autoAlpha:0,y:18,duration:.55,stagger:.09,ease:'power2.out',scrollTrigger:{trigger:body[0],start:'top 88%',once:true}});
    });
    if(matchMedia('(pointer:fine)').matches){hero.addEventListener('pointermove',event=>{const x=(event.clientX/innerWidth-.5)*14;const y=(event.clientY/innerHeight-.5)*10;gsap.to(stage,{x,y,duration:.8,ease:'power2.out',overwrite:'auto'})});hero.addEventListener('pointerleave',()=>gsap.to(stage,{x:0,y:0,duration:1,ease:'power3.out'}))}
    addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
  };

  if(reduce||saveData){document.body.classList.add('motion-reduced');return}
  const load=(src)=>new Promise((resolve,reject)=>{const existing=[...document.scripts].find(script=>script.src===src);if(existing){if(src.includes('ScrollTrigger')?window.ScrollTrigger:window.gsap)resolve();else existing.addEventListener('load',resolve,{once:true});return}const script=document.createElement('script');script.src=src;script.crossOrigin='anonymous';script.onload=resolve;script.onerror=reject;document.head.append(script)});
  (async()=>{try{if(!window.gsap)await load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js');if(!window.ScrollTrigger)await load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js');initGsap()}catch(error){revealFallback()}})();
})();
