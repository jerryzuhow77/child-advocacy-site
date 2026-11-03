(()=>{
  const path='/child-advocacy-site/news/taipei-child-reporting-debate-20261103/';
  const hans=document.documentElement.lang==='zh-Hans'||new URLSearchParams(location.search).get('lang')==='zh-Hans';
  const lang=hans?'zh-Hans':document.documentElement.lang==='en'?'en':document.documentElement.lang==='ja'?'ja':'zh-Hant';
  const copy={
    'zh-Hant':{tag:'置頂制度觀察 · 兒虐通報',title:'兒虐通報辯論：已提措施，仍待驗收',accent:'蔣萬安列出三方共訪、年六訪與稽查；兩人都仍須回答時限、升級與追責。',cta:'閱讀完整對照',url:path},
    'zh-Hans':{tag:'置顶制度观察 · 儿虐通报',title:'儿虐通报辩论：已提措施，仍待验收',accent:'蒋万安列出三方共访、年六访与稽查；两人都仍须回答时限、升级与追责。',cta:'阅读完整对照',url:path+'zh-Hans/'},
    en:{tag:'PINNED SYSTEM WATCH · REPORTING',title:'Child-abuse reporting: measures, then accountability',accent:'Chiang cited joint visits, six yearly visits and inspections; both candidates still need to specify timelines and escalation.',cta:'Read the comparison',url:path+'en/'},
    ja:{tag:'注目の制度検証 · 虐待通告',title:'児童虐待通告：対策を、検証へ',accent:'蔣氏は共同訪問・年6回訪問・検査を列挙。両候補に期限と対応引上げの説明が必要です。',cta:'比較を読む',url:path+'ja/'}
  }[lang];
  if(!copy||document.querySelector('[data-taipei-debate-feature]'))return;
  const card=document.createElement('section');
  card.dataset.taipeiDebateFeature='';
  card.innerHTML='<div class="cpa-debate-art"><img src="/child-advocacy-site/assets/art/taipei-child-reporting-debate-20261103.webp" alt="" loading="eager"></div><div class="cpa-debate-copy"><p class="cpa-debate-tag">'+copy.tag+'</p><h2>'+copy.title+'</h2><p class="cpa-debate-accent">'+copy.accent+'</p><a href="'+copy.url+'">'+copy.cta+' <span>↗</span></a></div>';
  const css=document.createElement('style');
  css.textContent='[data-taipei-debate-feature]{max-width:1120px;margin:20px auto 28px;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(260px,.95fr);background:#f7f0e3;border-top:4px solid #c65b3c;overflow:hidden;box-shadow:none}.cpa-debate-art{min-height:250px;overflow:hidden}.cpa-debate-art img{width:100%;height:100%;object-fit:cover;display:block}.cpa-debate-copy{padding:clamp(22px,4vw,52px);align-self:center}.cpa-debate-tag{color:#b54a34;font-weight:900;letter-spacing:.12em;font-size:.75rem;margin:0 0 .8rem}.cpa-debate-copy h2{font-family:Georgia,"Noto Serif TC","Noto Serif JP",serif;color:#183d44;font-size:clamp(2rem,3.4vw,3.75rem);line-height:1.02;margin:0}.cpa-debate-accent{color:#536a62;font-size:clamp(1.03rem,1.7vw,1.26rem);margin:1rem 0 1.5rem}.cpa-debate-copy a{display:inline-block;color:#183d44;font-weight:900;text-decoration:none;border-bottom:2px solid #c65b3c;padding-bottom:4px}.cpa-debate-copy a span{color:#c65b3c}@media(max-width:680px){[data-taipei-debate-feature]{margin:14px 15px 22px;grid-template-columns:1fr}.cpa-debate-art{min-height:auto;aspect-ratio:16/9}.cpa-debate-copy{padding:24px}.cpa-debate-copy h2{font-size:2.2rem}}';
  document.head.append(css);
  const target=document.querySelector('#daily-brief-pair-20261023')||document.querySelector('main');
  if(target)target.parentNode.insertBefore(card,target);
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&window.gsap){gsap.from(card.querySelectorAll('.cpa-debate-art,.cpa-debate-copy>*'),{scrollTrigger:window.ScrollTrigger?{trigger:card,start:'top 86%',once:true}:undefined,opacity:0,y:20,stagger:.1,duration:.65,ease:'power3.out'})}
})();
