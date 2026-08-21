(() => {
  'use strict';
  const config = window.__WITNESS_TENSION_CONFIG__;
  if (!config || document.getElementById('testimony-tensions')) return;
  const {prefix,title,intro,cards,markers} = config;
  if (!document.body?.classList.contains(`${prefix}-page`)) return;
  const sectionBefore = document.querySelector('#limits, #full-record');
  if (!sectionBefore) return;

  const style = document.createElement('style');
  style.id = 'witness-testimony-tension-styles';
  style.textContent = `.testimony-tension-section{position:relative;isolation:isolate;overflow:hidden;margin-top:clamp(2.8rem,7vw,6rem)!important;margin-bottom:clamp(2.8rem,7vw,6rem)!important;padding:clamp(1.35rem,3.4vw,3rem)!important;border:1px solid rgba(126,73,73,.18);border-radius:clamp(1.35rem,3vw,2.4rem);background:linear-gradient(145deg,rgba(255,250,247,.98),rgba(253,240,237,.95) 52%,rgba(247,245,255,.96));box-shadow:0 28px 70px rgba(81,49,55,.12)}.testimony-tension-section::before{content:"";position:absolute;z-index:-1;width:19rem;height:19rem;right:-6rem;top:-8rem;border-radius:50%;background:radial-gradient(circle,rgba(229,151,145,.24),rgba(229,151,145,0) 68%)}.testimony-tension-head{max-width:63rem;margin-bottom:1.45rem}.testimony-tension-head>small{display:inline-flex;align-items:center;gap:.45rem;margin-bottom:.65rem;font-size:.77rem;font-weight:900;letter-spacing:.14em;color:#9a4548}.testimony-tension-head>small::before{content:"";width:1.65rem;height:2px;background:currentColor}.testimony-tension-head h2{margin:.1rem 0 .85rem;font-size:clamp(1.75rem,4.3vw,3rem);line-height:1.12;color:#3f3034}.testimony-tension-head>p{max-width:56rem;margin:0;color:#64565a;line-height:1.85}.testimony-tension-caution{display:grid;grid-template-columns:auto 1fr;gap:.8rem;align-items:start;margin:1.15rem 0 0;padding:1rem 1.1rem;border:1px solid rgba(154,69,72,.22);border-radius:1rem;background:rgba(255,255,255,.72);color:#5c464b;line-height:1.72}.testimony-tension-caution b{display:inline-flex;align-items:center;justify-content:center;min-width:2.25rem;height:2.25rem;border-radius:999px;background:#8d4549;color:#fff;font-size:.76rem;letter-spacing:.08em}.testimony-tension-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(.9rem,2vw,1.35rem)}.testimony-tension-card{position:relative;display:flex;flex-direction:column;min-width:0;padding:clamp(1rem,2.3vw,1.45rem);border:1px solid rgba(112,72,77,.16);border-radius:1.25rem;background:rgba(255,255,255,.9);box-shadow:0 14px 35px rgba(68,42,48,.08);transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}.testimony-tension-card:hover{transform:translateY(-3px);border-color:rgba(154,69,72,.34);box-shadow:0 20px 42px rgba(68,42,48,.13)}.testimony-tension-tag{align-self:flex-start;padding:.34rem .65rem;border-radius:999px;background:#8f474c;color:#fff;font-size:.73rem;font-weight:900;letter-spacing:.08em}.testimony-tension-card[data-kind="scope"] .testimony-tension-tag,.testimony-tension-card[data-kind="meaning"] .testimony-tension-tag{background:#75609a}.testimony-tension-card[data-kind="record"] .testimony-tension-tag,.testimony-tension-card[data-kind="inference"] .testimony-tension-tag{background:#567482}.testimony-tension-card[data-kind="cross"] .testimony-tension-tag{background:#8b6b37}.testimony-tension-card h3{margin:.8rem 0 1rem;font-size:clamp(1.12rem,2.2vw,1.42rem);line-height:1.42;color:#403338}.testimony-tension-compare{display:grid;gap:.65rem}.testimony-tension-compare>div{padding:.82rem .9rem;border-radius:.9rem;background:#fbf7f5;border-left:4px solid #d59a93}.testimony-tension-compare>div:nth-child(2){background:#f6f4fa;border-left-color:#a495c0}.testimony-tension-compare b{display:block;margin-bottom:.28rem;color:#87484c;font-size:.78rem;letter-spacing:.06em}.testimony-tension-compare p{margin:0;color:#594d51;line-height:1.72}.testimony-tension-reading{margin:1rem 0;color:#66575b;line-height:1.75}.testimony-tension-reading strong{color:#49393e}.testimony-tension-link{display:inline-flex;align-items:center;gap:.4rem;align-self:flex-start;margin-top:auto;padding-top:.25rem;color:#8d4549;font-weight:900;text-decoration-thickness:1px;text-underline-offset:.24em}.testimony-tension-link:hover{text-decoration:underline}.testimony-tension-source{position:relative!important;scroll-margin-top:7rem;outline:2px solid rgba(166,76,81,.56);outline-offset:4px;border-radius:1rem;box-shadow:0 0 0 7px rgba(222,159,154,.12)}.testimony-tension-source::after{content:attr(data-tension-label);position:absolute;z-index:5;top:-.72rem;right:.75rem;max-width:70%;padding:.28rem .58rem;border-radius:999px;background:#8d4549;color:#fff;font-size:.68rem;font-weight:900;line-height:1.2;letter-spacing:.04em;box-shadow:0 5px 14px rgba(82,40,44,.2)}@media(max-width:760px){.testimony-tension-section{border-radius:1.3rem;padding:1rem!important}.testimony-tension-grid{grid-template-columns:1fr}.testimony-tension-caution{grid-template-columns:1fr}.testimony-tension-caution b{justify-self:start}.testimony-tension-card{padding:1rem}.testimony-tension-source::after{right:.35rem;max-width:82%;font-size:.64rem}}@media(prefers-reduced-motion:reduce){.testimony-tension-card{transition:none}.testimony-tension-card:hover{transform:none}}`;
  document.head.append(style);

  const section = document.createElement('section');
  section.id = 'testimony-tensions';
  section.className = `${prefix}-section testimony-tension-section`;
  section.setAttribute('aria-labelledby','testimony-tensions-title');
  section.innerHTML = `<div class="${prefix}-section-head testimony-tension-head"><small>TESTIMONY CROSS-CHECK</small><h2 id="testimony-tensions-title">${title}</h2><p>${intro}</p><aside class="testimony-tension-caution" role="note"><b>注意</b><span>本區所稱「矛盾／張力」，包括直接不一致、範圍修正、記憶與紀錄落差，以及跨時期觀察差異；<strong>不等於本頁認定偽證，也不代表法院已採信其中一說。</strong></span></aside></div><div class="testimony-tension-grid">${cards.map(card=>`<article class="testimony-tension-card" data-kind="${card.kind}"><span class="testimony-tension-tag">${card.tag}</span><h3>${card.title}</h3><div class="testimony-tension-compare"><div><b>${card.aLabel}</b><p>${card.a}</p></div><div><b>${card.bLabel}</b><p>${card.b}</p></div></div><p class="testimony-tension-reading"><strong>如何閱讀｜</strong>${card.reading}</p><a class="testimony-tension-link" href="${card.href}">查看完整問答 <span aria-hidden="true">↘</span></a></article>`).join('')}</div>`;
  sectionBefore.before(section);

  const normalize = value => value.replace(/\s+/g,'');
  const pairs = [...document.querySelectorAll(`.${prefix}-dialogue-pair`)];
  markers.forEach(([needle,label])=>{
    const match = pairs.find(pair=>normalize(pair.textContent||'').includes(normalize(needle)));
    if (!match) return;
    match.classList.add('testimony-tension-source');
    match.dataset.tensionLabel = label;
  });

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    try { window.gsap.registerPlugin(window.ScrollTrigger); } catch (_) {}
    window.gsap.from(section.querySelectorAll('.testimony-tension-head > *, .testimony-tension-card'),{y:28,autoAlpha:0,duration:.68,stagger:.055,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 82%',once:true}});
    window.ScrollTrigger.refresh();
  }
  delete window.__WITNESS_TENSION_CONFIG__;
})();
