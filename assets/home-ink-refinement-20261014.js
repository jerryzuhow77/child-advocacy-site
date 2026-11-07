(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const targets=[...document.querySelectorAll('.ink-priority-rail,#news-flash,#case-reading .archive-directory,#home-court-comics,#home-film')];if(!targets.length||!('IntersectionObserver'in window))return;document.documentElement.classList.add('ink-motion');targets.forEach(e=>e.classList.add('ink-motion-target'));const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ink-motion-in');io.unobserve(e.target)}}),{threshold:.12});targets.forEach(e=>io.observe(e));})();
/* Keep the featured 11/6 advocacy thumbnail consistent with the article's dual-poster hero. */
(()=>{
  const key='why-we-keep-showing-up-20261105';
  const locale=()=>document.documentElement.lang==='ja'?'ja':document.documentElement.lang==='en'?'en':document.documentElement.lang==='zh-Hans'?'zh-Hans':'zh-Hant';
  const labels={
    'zh-Hant':['11 月 6 日二審準備程序水墨版海報','11 月 6 日二審準備程序霓虹版海報','11 月 6 日雙海報主視覺'],
    'zh-Hans':['11 月 6 日二审准备程序水墨版海报','11 月 6 日二审准备程序霓虹版海报','11 月 6 日双海报主视觉'],
    en:['Ink poster for the 6 November appeal hearing','Neon poster for the 6 November appeal hearing','Two posters for the 6 November appeal hearing'],
    ja:['11月6日控訴審準備手続の水墨版ポスター','11月6日控訴審準備手続のネオン版ポスター','11月6日の2枚組ポスター']
  };
  const injectStyle=()=>{
    if(document.getElementById('home-dual-poster-thumb-style'))return;
    const style=document.createElement('style');
    style.id='home-dual-poster-thumb-style';
    style.textContent=
      '#news-flash [data-home-brief="'+key+'"]>.home-dual-poster-thumb,.paired-daily-briefs [data-home-brief="'+key+'"]>.home-dual-poster-thumb{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));align-self:center;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:8/5!important;gap:5px;overflow:hidden;background:#151719}'+
      '.home-dual-poster-thumb img{display:block!important;width:100%!important;height:100%!important;min-height:0!important;aspect-ratio:4/5!important;object-fit:cover!important;object-position:center!important;background:#111}'+
      '@media(max-width:760px){#news-flash [data-home-brief="'+key+'"]>.home-dual-poster-thumb,.paired-daily-briefs [data-home-brief="'+key+'"]>.home-dual-poster-thumb{aspect-ratio:8/5!important;gap:4px}}';
    document.head.appendChild(style);
  };
  const mount=()=>{
    injectStyle();
    document.querySelectorAll('[data-home-brief="'+key+'"]').forEach(card=>{
      if(card.querySelector('.home-dual-poster-thumb'))return;
      const first=card.querySelector(':scope > img[data-home-thumb]');
      if(!first)return;
      const copy=labels[locale()];
      const frame=document.createElement('span');
      frame.className='home-dual-poster-thumb';
      frame.style.setProperty('display','grid','important');
      frame.style.setProperty('grid-template-columns','repeat(2,minmax(0,1fr))','important');
      frame.style.setProperty('width','100%','important');
      frame.style.setProperty('height','auto','important');
      frame.style.setProperty('aspect-ratio','8/5','important');
      frame.setAttribute('data-home-thumb','');
      frame.setAttribute('role','group');
      frame.setAttribute('aria-label',copy[2]);
      first.removeAttribute('data-home-thumb');
      first.alt=copy[0];
      first.loading='eager';
      const second=document.createElement('img');
      second.src='/child-advocacy-site/assets/art/chen-shangjie-20261106-poster-neon.jpg?v=20261105-home-dual-thumb-1';
      second.alt=copy[1];
      second.loading='eager';
      second.decoding='async';
      frame.append(first,second);
      card.insertBefore(frame,card.firstChild);
      if(window.gsap&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        window.gsap.from(frame.querySelectorAll('img'),{autoAlpha:0,scale:.94,y:12,duration:.58,stagger:.12,ease:'power2.out',clearProps:'opacity,visibility,transform'});
      }
    });
  };
  const boot=()=>{
    mount();
    const slider=document.querySelector('[data-gsap-slider]');
    if(slider)new MutationObserver(()=>requestAnimationFrame(mount)).observe(slider,{childList:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

(()=>{const s=document.createElement('script');s.src='/child-advocacy-site/assets/home-guardian-wall-gateway-20261105.js?v=20261107-stable-gateway-1';s.defer=true;document.head.appendChild(s)})();

(()=>{window.addEventListener('load',()=>{window.setTimeout(()=>{if(document.getElementById('guardian-wall-gateway'))return;const s=document.createElement('script');s.src='/child-advocacy-site/assets/home-guardian-wall-gateway-20261105.js?v=20261107-stable-gateway-1&retry=1';document.head.appendChild(s)},0)},{once:true})})();

(()=>{const s=document.createElement('script');s.src='/child-advocacy-site/assets/home-kaikai-ink-accent-20261105.js?v=20261107-stable-gateway-1';s.defer=true;document.head.appendChild(s)})();




