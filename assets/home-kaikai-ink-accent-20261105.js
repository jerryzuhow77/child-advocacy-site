(()=>{
  const kaikaiAsset='/child-advocacy-site/assets/kaikai-guardian-ink-20261105.webp';
  const cardAssets=[
    '/child-advocacy-site/assets/ink-card-01-news-20261105.webp',
    '/child-advocacy-site/assets/ink-card-02-hearings-20261105.webp',
    '/child-advocacy-site/assets/ink-card-03-cases-20261105.webp',
    '/child-advocacy-site/assets/ink-card-04-system-20261105.webp',
    '/child-advocacy-site/assets/ink-card-05-history-20261105.webp',
    '/child-advocacy-site/assets/ink-card-06-action-20261105.webp'
  ];
  const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const installStyles=()=>{
    if(document.getElementById('gwg-kaikai-style'))return;
    const style=document.createElement('style');
    style.id='gwg-kaikai-style';
    style.textContent=`
      .gwg-kaikai{position:relative;margin:-14px -12px 22px;padding:7px;overflow:hidden;border:1px solid rgba(35,73,69,.2);background:rgba(255,252,244,.72);box-shadow:0 15px 35px rgba(37,58,52,.1)}
      .gwg-kaikai:after{content:"";position:absolute;inset:7px;pointer-events:none;background:linear-gradient(180deg,transparent 55%,rgba(17,48,46,.58))}
      .gwg-kaikai img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;object-position:55% center;filter:saturate(.88) contrast(.98)}
      .gwg-kaikai figcaption{position:absolute;z-index:2;left:18px;bottom:16px;padding:6px 9px;border-left:2px solid #d2aa61;background:rgba(17,51,49,.7);color:#fff9ed;font-size:9px;letter-spacing:.08em;backdrop-filter:blur(7px)}
      .gmc{position:relative;isolation:isolate;overflow:hidden;transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease}
      .gmc:before{content:"";position:absolute;z-index:-2;inset:0;background-image:linear-gradient(103deg,rgba(255,252,245,.97) 4%,rgba(255,252,245,.91) 43%,rgba(255,252,245,.48) 72%,rgba(255,252,245,.2)),var(--gmc-bg);background-position:center;background-size:cover;filter:saturate(.72) contrast(.94);transform:scale(1.01);transition:transform .65s cubic-bezier(.2,.7,.2,1),filter .45s ease}
      .gmc:after{content:"";position:absolute;z-index:-1;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.15),transparent 40%,rgba(244,237,220,.2));box-shadow:inset 0 0 0 1px rgba(255,255,255,.34)}
      .gmc:hover{border-color:#9eaa9d;box-shadow:0 16px 30px rgba(47,67,59,.13)}
      .gmc:hover:before{transform:scale(1.055);filter:saturate(.9) contrast(.98)}
      .gmc strong,.gmc span{max-width:72%;text-shadow:0 1px rgba(255,255,255,.78)}
      .gwg-wheel-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin:2px 0 9px;padding-top:13px;border-top:1px solid rgba(55,89,82,.18)}
      .gwg-wheel-label{display:grid;gap:2px;color:#744f3c;font:700 9px/1.25 system-ui,sans-serif;letter-spacing:.13em}
      .gwg-wheel-label b{color:#254e4d;font:700 12px/1.25 system-ui,sans-serif;letter-spacing:.03em}
      .gwg-wheel-controls{display:flex;align-items:center;gap:5px}
      .gwg-wheel-count{min-width:38px;text-align:center;color:#6d665c;font:700 10px/1 system-ui,sans-serif;letter-spacing:.07em}
      .gwg-wheel-controls button{display:grid;width:28px;height:28px;place-items:center;padding:0;border:1px solid rgba(36,77,75,.3);border-radius:50%;background:rgba(255,253,247,.76);color:#214b49;font:700 12px/1 system-ui,sans-serif;cursor:pointer;transition:background .2s ease,color .2s ease,transform .2s ease}
      .gwg-wheel-controls button:hover{background:#285b59;color:#fff;transform:translateY(-1px)}
      .gwg-wheel-controls button:focus-visible{outline:3px solid #c47b5b;outline-offset:2px}
      .gwg-wheel-controls button:disabled{opacity:.35;cursor:default;transform:none}
      .voices.gwg-wheel{position:relative;display:block;height:158px;margin-bottom:16px;overflow:hidden;perspective:700px}
      .voices.gwg-wheel>article,.voices.gwg-wheel>.voice-empty{position:absolute;inset:0;box-sizing:border-box;margin:0;overflow:auto;opacity:0;visibility:hidden;transform-origin:50% 100%;scrollbar-width:thin}
      .voices.gwg-wheel>article{display:flex;flex-direction:column;justify-content:center;padding:18px 17px 17px;border-left:3px solid #91aaa4;background:linear-gradient(118deg,rgba(255,255,255,.8),rgba(246,241,229,.55))}
      .voices.gwg-wheel>article:nth-of-type(even){border-color:#c78567}
      .voices.gwg-wheel>.voice-empty{display:flex;align-items:center;padding:17px;border-left:3px solid #91aaa4;background:rgba(255,255,255,.55);font-size:12px;line-height:1.75;color:#65615a}
      .voices.gwg-wheel>.is-active{opacity:1;visibility:visible}
      .voices.gwg-wheel small{font-size:11px;letter-spacing:.06em}
      .voices.gwg-wheel p{font-size:13px;line-height:1.75}
      @media(max-width:900px){.gwg-kaikai img{aspect-ratio:16/8;object-position:center 48%}.gmc strong,.gmc span{max-width:68%}}
      @media(max-width:560px){.gwg-kaikai{margin:-9px -7px 18px}.gwg-kaikai img{aspect-ratio:4/3}.gwg-kaikai figcaption{left:15px;bottom:13px}.gmc strong,.gmc span{max-width:76%}.voices.gwg-wheel{height:168px}}
      @media(prefers-reduced-motion:reduce){.gmc,.gmc:before,.gwg-wheel-controls button{transition:none!important}.gmc:hover:before{transform:none}}
    `;
    document.head.append(style);
  };

  const createFigure=(hans)=>{
    const figure=document.createElement('figure');
    figure.className='gwg-kaikai';
    const image=document.createElement('img');
    image.src=kaikaiAsset;
    image.alt=hans?'象征性的剀剀守护水墨纸艺：匿名孩子背影与宣纸守护双手，非真实肖像或事件现场':'象徵性的剴剴守護水墨紙藝：匿名孩子背影與宣紙守護雙手，非真實肖像或事件現場';
    image.loading='lazy';
    image.decoding='async';
    const caption=document.createElement('figcaption');
    caption.textContent=hans?'剀剀守护意象・非真实肖像':'剴剴守護意象・非真實肖像';
    figure.append(image,caption);
    return figure;
  };

  const setupWheel=(aside,hans)=>{
    const voices=aside.querySelector('.voices');
    if(!voices||voices.dataset.wheelReady)return;
    voices.dataset.wheelReady='true';
    voices.classList.add('gwg-wheel');

    const head=document.createElement('div');
    head.className='gwg-wheel-head';
    head.innerHTML=`<span class="gwg-wheel-label">PUBLIC MESSAGE RECORDS<b>${hans?'公开留言纪录':'公開留言紀錄'}</b></span><span class="gwg-wheel-controls"><button type="button" data-wheel-prev aria-label="${hans?'上一则公开留言':'上一則公開留言'}">←</button><span class="gwg-wheel-count" aria-live="polite">01 / 01</span><button type="button" data-wheel-pause aria-label="${hans?'暂停留言轮播':'暫停留言輪播'}" aria-pressed="false">Ⅱ</button><button type="button" data-wheel-next aria-label="${hans?'下一则公开留言':'下一則公開留言'}">→</button></span>`;
    voices.before(head);
    const prev=head.querySelector('[data-wheel-prev]');
    const next=head.querySelector('[data-wheel-next]');
    const pause=head.querySelector('[data-wheel-pause]');
    const count=head.querySelector('.gwg-wheel-count');
    let slides=[];
    let index=0;
    let timer=0;
    let paused=false;

    const stop=()=>{window.clearInterval(timer);timer=0};
    const updateControls=()=>{
      count.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length||1).padStart(2,'0')}`;
      [prev,next,pause].forEach(button=>button.disabled=slides.length<2);
      pause.textContent=paused?'▶':'Ⅱ';
      pause.setAttribute('aria-pressed',String(paused));
      pause.setAttribute('aria-label',paused?(hans?'继续留言轮播':'繼續留言輪播'):(hans?'暂停留言轮播':'暫停留言輪播'));
    };
    const startTimer=()=>{
      stop();
      if(!paused&&!reducedMotion()&&slides.length>1)timer=window.setInterval(()=>go(1),4800);
    };
    const go=(delta,manual=false)=>{
      if(slides.length<2)return;
      const old=index;
      index=(index+delta+slides.length)%slides.length;
      if(old===index)return;
      const outgoing=slides[old];
      const incoming=slides[index];
      slides.forEach((slide,i)=>slide.setAttribute('aria-hidden',String(i!==index)));
      if(window.gsap&&!reducedMotion()){
        window.gsap.killTweensOf([outgoing,incoming]);
        window.gsap.to(outgoing,{autoAlpha:0,y:-24,rotateX:4,duration:.36,ease:'power2.in',onComplete:()=>outgoing.classList.remove('is-active')});
        incoming.classList.add('is-active');
        window.gsap.fromTo(incoming,{autoAlpha:0,y:28,rotateX:-4},{autoAlpha:1,y:0,rotateX:0,duration:.58,ease:'power2.out'});
      }else{
        outgoing.classList.remove('is-active');
        incoming.classList.add('is-active');
      }
      updateControls();
      if(manual)startTimer();
    };
    const rebuild=()=>{
      stop();
      slides=[...voices.children].filter(element=>element.matches('article,.voice-empty'));
      index=0;
      slides.forEach((slide,i)=>{
        slide.classList.toggle('is-active',i===0);
        slide.setAttribute('aria-hidden',String(i!==0));
        if(window.gsap)window.gsap.set(slide,{autoAlpha:i===0?1:0,y:0,rotateX:0});
      });
      updateControls();
      startTimer();
    };

    prev.addEventListener('click',()=>go(-1,true));
    next.addEventListener('click',()=>go(1,true));
    pause.addEventListener('click',()=>{paused=!paused;updateControls();startTimer()});
    aside.addEventListener('pointerenter',stop);
    aside.addEventListener('pointerleave',startTimer);
    aside.addEventListener('focusin',stop);
    aside.addEventListener('focusout',event=>{if(!aside.contains(event.relatedTarget))startTimer()});
    new MutationObserver(()=>window.setTimeout(rebuild,0)).observe(voices,{childList:true});
    rebuild();
  };

  const mount=()=>{
    const section=document.getElementById('guardian-wall-gateway');
    const aside=section&&section.querySelector('aside');
    if(!aside)return false;
    const hans=document.documentElement.lang==='zh-Hans';
    installStyles();
    section.querySelectorAll('.gmc').forEach((card,index)=>{
      if(cardAssets[index])card.style.setProperty('--gmc-bg',`url("${cardAssets[index]}")`);
    });
    if(!aside.querySelector('.gwg-kaikai'))aside.prepend(createFigure(hans));
    setupWheel(aside,hans);
    return true;
  };
  const start=()=>{
    if(mount())return;
    const observer=new MutationObserver(()=>{if(mount())observer.disconnect()});
    observer.observe(document.body,{childList:true,subtree:true});
    window.setTimeout(()=>observer.disconnect(),12000);
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
})();

