(()=>{
  function addLiuAppealPin(){
    const grid=document.querySelector('#news-flash .pinned-grid');
    if(grid&&!document.querySelector('[data-liu-appeal-pin]')){
      const hans=location.hostname.includes('globalprotectionwall')||new URLSearchParams(location.search).get('lang')==='zh-Hans';
      const card=document.createElement('article');
      card.className='home-card pinned-lead';
      card.dataset.liuAppealPin='';
      card.innerHTML='<a class="card-link home-media-report-action" href="'+(hans?'/child-advocacy-site/hearing-records/liu-zongxin-appeal-20261022/zh-Hans/':'/child-advocacy-site/hearing-records/liu-zongxin-appeal-20261022/')+'"><img alt="精緻現代水墨：法院、天秤與守護燈光意象，非事件現場" height="480" loading="eager" src="/child-advocacy-site/assets/art/liu-zongxin-modern-ink-20261118.jpg" width="720"><div class="card-copy"><p class="card-meta">2026.10.22・旁聽筆記</p><h3>毒駕殺警案二審｜開庭重點</h3><p class="card-summary">影像勘驗、車窗爭議與故意／過失的法律判斷。</p><p class="card-source">現場整理，非正式法庭筆錄；事實與責任以法院最終認定為準。</p><span class="card-action">閱讀旁聽筆記 →</span></div></a>';
      grid.prepend(card);
    }
  }

  function localDay(date){
    return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
  }

  function initSlider(root){
    if(root.dataset.gsapCarouselReady==='true')return;
    root.dataset.gsapCarouselReady='true';
    root.dataset.twoWeekCarousel='true';
    root.style.cursor='grab';
    root.style.userSelect='none';
    root.setAttribute('aria-label','近兩週護童貼文；可左右滑動');

    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cards=[];
    let active=0;
    let syncing=false;
    let timer=0;
    let scrollFrame=0;

    const lang=document.documentElement.lang;
    const copy=lang==='en'?['Previous','Next','Recent posts']:
      lang==='ja'?['前へ','次へ','直近の投稿']:
      lang==='zh-Hans'?['上一則','下一則','近两周贴文']:
      ['上一則','下一則','近兩週貼文'];

    const controls=document.createElement('div');
    controls.className='pinned-brief-slider-controls';
    controls.setAttribute('aria-label',copy[2]);
    controls.innerHTML='<span class="pinned-brief-range">'+copy[2]+' · <b>1</b>/<span>1</span></span><button type="button" data-slider-prev aria-label="'+copy[0]+'">‹</button><button type="button" data-slider-next aria-label="'+copy[1]+'">›</button>';
    root.after(controls);
    const currentCount=controls.querySelector('b');
    const totalCount=controls.querySelector('.pinned-brief-range>span');

    function updateCounter(){
      if(currentCount)currentCount.textContent=String(cards.length?active+1:0);
      if(totalCount)totalCount.textContent=String(cards.length);
      controls.hidden=cards.length<2;
    }

    function revealNew(){
      const fresh=cards.filter(card=>!card.dataset.gsapCarouselRevealed);
      fresh.forEach(card=>card.dataset.gsapCarouselRevealed='true');
      if(fresh.length&&window.gsap&&!reduce){
        window.gsap.fromTo(fresh,{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.62,stagger:.08,ease:'power3.out',clearProps:'transform,opacity,visibility'});
      }
    }

    function reconcile(){
      if(syncing)return;
      const all=[...root.querySelectorAll(':scope>a')];
      const dated=all.filter(card=>card.dataset.homeDate);
      if(!dated.length){
        cards=all;
        updateCounter();
        revealNew();
        return;
      }
      const today=new Date();
      today.setHours(23,59,59,999);
      const cutoff=new Date(today);
      cutoff.setDate(cutoff.getDate()-13);
      const firstDay=localDay(cutoff);
      const lastDay=localDay(today);
      const kept=all.filter(card=>{
        const day=(card.dataset.homeDate||'').slice(0,10);
        return day>=firstDay&&day<=lastDay;
      }).sort((a,b)=>(b.dataset.homeDate||'').localeCompare(a.dataset.homeDate||''));

      const currentOrder=all.filter(card=>kept.includes(card));
      const orderChanged=currentOrder.length!==kept.length||currentOrder.some((card,index)=>card!==kept[index]);
      const obsolete=all.filter(card=>!kept.includes(card));
      if(obsolete.length||orderChanged){
        syncing=true;
        obsolete.forEach(card=>card.remove());
        if(orderChanged)kept.forEach(card=>root.append(card));
        syncing=false;
      }
      cards=kept;
      cards.forEach(card=>card.querySelectorAll('img').forEach(img=>{img.draggable=false;}));
      active=Math.min(active,Math.max(0,cards.length-1));
      updateCounter();
      revealNew();
      if(cards[0]?.dataset.homePriority)root.scrollLeft=0;
      restart();
    }

    function positionFor(index){
      const card=cards[index];
      return card?card.offsetLeft-root.offsetLeft:0;
    }

    function go(index,manual){
      if(!cards.length)return;
      active=(index+cards.length)%cards.length;
      const left=positionFor(active);
      if(window.gsap&&!reduce){
        window.gsap.to(root,{scrollLeft:left,duration:.58,ease:'power2.inOut',overwrite:'auto'});
      }else{
        root.scrollTo({left,behavior:reduce?'auto':'smooth'});
      }
      updateCounter();
      if(manual)restart();
    }

    function nearestIndex(){
      if(!cards.length)return 0;
      const left=root.scrollLeft;
      let nearest=0;
      let distance=Infinity;
      cards.forEach((card,index)=>{
        const value=Math.abs(positionFor(index)-left);
        if(value<distance){distance=value;nearest=index;}
      });
      return nearest;
    }

    function syncFromScroll(){
      cancelAnimationFrame(scrollFrame);
      scrollFrame=requestAnimationFrame(()=>{
        active=nearestIndex();
        updateCounter();
      });
    }

    function restart(){
      clearInterval(timer);
      if(!reduce&&cards.length>1&&!cards[0]?.dataset.homePriority){
        timer=setInterval(()=>go(active+1,false),7600);
      }
    }

    controls.querySelector('[data-slider-prev]').addEventListener('click',()=>go(active-1,true));
    controls.querySelector('[data-slider-next]').addEventListener('click',()=>go(active+1,true));
    root.addEventListener('scroll',syncFromScroll,{passive:true});
    root.addEventListener('scrollend',()=>go(nearestIndex(),true),{passive:true});
    root.addEventListener('home:briefs-updated',()=>requestAnimationFrame(reconcile));

    let pointerId=null;
    let startX=0;
    let startScroll=0;
    let dragged=false;
    root.addEventListener('pointerdown',event=>{
      if(event.pointerType==='touch')return;
      event.preventDefault();
      pointerId=event.pointerId;
      startX=event.clientX;
      startScroll=root.scrollLeft;
      dragged=false;
      clearInterval(timer);
      root.setPointerCapture?.(pointerId);
      root.classList.add('is-dragging');
      root.style.cursor='grabbing';
    });
    root.addEventListener('pointermove',event=>{
      if(pointerId!==event.pointerId)return;
      const delta=event.clientX-startX;
      if(Math.abs(delta)>5)dragged=true;
      root.scrollLeft=startScroll-delta;
      if(dragged)event.preventDefault();
    });
    function endDrag(event){
      if(pointerId!==event.pointerId)return;
      root.releasePointerCapture?.(pointerId);
      pointerId=null;
      root.classList.remove('is-dragging');
      root.style.cursor='grab';
      go(nearestIndex(),true);
    }
    root.addEventListener('pointerup',endDrag);
    root.addEventListener('pointercancel',endDrag);
    root.addEventListener('click',event=>{
      if(dragged){event.preventDefault();event.stopPropagation();dragged=false;}
    },true);

    const observer=new MutationObserver(()=>requestAnimationFrame(reconcile));
    observer.observe(root,{childList:true});
    new ResizeObserver(()=>{if(cards.length)go(active,false);}).observe(root);
    reconcile();
  }

  function boot(){
    addLiuAppealPin();
    document.querySelectorAll('[data-gsap-slider]').forEach(initSlider);
    const pageObserver=new MutationObserver(()=>document.querySelectorAll('[data-gsap-slider]').forEach(initSlider));
    pageObserver.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>pageObserver.disconnect(),12000);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
/* Always-on Christmas foreground injected by a homepage-loaded script. */
(()=>{const mount=()=>{if(document.getElementById('cpa-direct-luxe-sleigh'))return;const css=document.createElement('style');css.textContent='#cpa-direct-luxe-sleigh{position:fixed;z-index:2147483647;pointer-events:none;width:min(72vw,1100px);left:-76vw;top:5vh;filter:drop-shadow(0 18px 22px rgba(55,8,20,.5));will-change:transform}#cpa-direct-luxe-sleigh img{display:block;width:100%;height:auto;filter:saturate(1.15) contrast(1.06)}#cpa-direct-luxe-sleigh .trail{position:absolute;z-index:-1;width:74%;height:42%;right:8%;top:39%;border-top:7px dashed #ffd86b;border-radius:50%;transform:rotate(-13deg);opacity:.95;filter:drop-shadow(0 0 7px #ff3ea5)}@media(max-width:700px){#cpa-direct-luxe-sleigh{width:108vw;left:-112vw;top:8vh}#cpa-direct-luxe-sleigh .trail{border-top-width:4px}}';document.head.append(css);const el=document.createElement('div');el.id='cpa-direct-luxe-sleigh';el.setAttribute('aria-hidden','true');el.innerHTML='<i class="trail"></i><img src="/child-advocacy-site/assets/images/luxe-free-flying-reindeer-sleigh.png" alt="">';document.body.append(el);const flight=[{transform:'translate3d(0,0,0) rotate(4deg)'},{transform:'translate3d(92vw,19vh,0) rotate(-4deg)'},{transform:'translate3d(174vw,43vh,0) rotate(3deg)'},{transform:'translate3d(-18vw,67vh,0) rotate(-5deg)'},{transform:'translate3d(85vw,10vh,0) rotate(4deg)'},{transform:'translate3d(176vw,37vh,0) rotate(-3deg)'}];if(el.animate)el.animate(flight,{duration:26000,iterations:Infinity,easing:'cubic-bezier(.42,0,.28,1)'});};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,80),{once:true});else setTimeout(mount,80);})();
