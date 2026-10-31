(()=>{'use strict';
  const slug='social-work-discipline-child-protection-20261031';
  if(!location.pathname.includes(slug)) return;
  const target=document.querySelector('.history');
  if(!target || target.querySelector('[data-alliance-timeline]')) return;
  const lang=document.documentElement.lang||'zh-Hant';
  const copy={
    'zh-Hant':{title:'固定追蹤年表｜歷年倡議／非今日消息',intro:'本頁每次更新都保留這份歷年追蹤；以下日期不可視為今日事件。',items:[['2005','倡議起點','兒推盟 2026 年官方新聞稿回顧：民間團體曾推動設立中央兒少專責單位。原始月日仍待查核。'],['2018-04-03','兒推盟成立','13 個民間團體共同倡議成立專責單位、增加兒少預算與整合業務。'],['2025-12-15','再次提出制度訴求','26 個民間團體與跨黨派民代要求完整整合、充足預算人力及常態民間參與。'],['2026-08-25','可確認的立法進展','組織法三讀通過；實際掛牌、權限、預算及人力配置仍需以政府後續正式資料確認。']]},
    'zh-Hans':{title:'固定追踪年表｜历史倡议／非今日消息',intro:'本页每次更新都保留这份历史追踪；以下日期不可视为今日事件。',items:[['2005','倡议起点','儿推盟 2026 年官方新闻稿回顾：民间团体曾推动设立中央儿童专责单位。原始月日仍待核查。'],['2018-04-03','儿推盟成立','13 个民间团体共同倡议成立专责单位、增加儿童预算与整合业务。'],['2025-12-15','再次提出制度诉求','26 个民间团体与跨党派民代要求完整整合、充足预算人力及常态民间参与。'],['2026-08-25','可确认的立法进展','组织法三读通过；实际挂牌、权限、预算及人力配置仍需以政府后续正式资料确认。']]},
    en:{title:'Standing timeline | historical advocacy, not today’s news',intro:'This timeline remains with every update. None of these dates is a current event.',items:[['2005','Advocacy starting point','The alliance’s 2026 official release recalls an earlier civil-society call for a central child-and-youth agency. The original month and day remain to be verified.'],['3 Apr 2018','Alliance formed','Thirteen groups called for a dedicated agency, more funding and integrated child-and-youth work.'],['15 Dec 2025','Renewed institutional asks','Twenty-six groups and cross-party legislators called for integration, adequate funding and staffing, and regular civil-society participation.'],['25 Aug 2026','Verifiable legislative progress','The organization law passed. Actual launch, authority, budget and staffing still require later official confirmation.']]},
    ja:{title:'固定年表｜歴史的倡議／今日のニュースではない',intro:'この年表は毎回の更新で保持します。以下の日付は今日の出来事ではありません。',items:[['2005','倡議の出発点','連盟の2026年公式発表は、中央の子ども・青少年専管機関を求める市民社会の倡議を回顧しています。元の月日には未確認部分があります。'],['2018年4月3日','連盟の結成','13団体が専管機関、予算増額、業務統合を求めました。'],['2025年12月15日','制度要求を再提示','26団体と超党派の議員が、統合、十分な予算と人員、定期的な市民参加を求めました。'],['2026年8月25日','確認できる立法上の進展','組織法が可決されました。実際の発足、権限、予算、人員は今後の公式資料で確認が必要です。']]}
  }[lang]||null;
  if(!copy) return;
  const section=document.createElement('section');
  section.className='alliance-timeline'; section.dataset.allianceTimeline='';
  section.setAttribute('aria-label',copy.title);
  section.innerHTML='<h3>'+copy.title+'</h3><p class="alliance-lede">'+copy.intro+'</p><ol>'+copy.items.map(item=>'<li><time>'+item[0]+'</time><div><strong>'+item[1]+'</strong><span>'+item[2]+'</span></div></li>').join('')+'</ol><p class="alliance-note">Sources: <a href="https://children.org.tw/news/news_detail/1956">2018 official release</a> · <a href="https://children.org.tw/news/news_detail/3467">2025 official release</a> · <a href="https://children.org.tw/news/news_detail/3627">2026 official release</a></p>';
  const style=document.createElement('style');
  style.textContent='.alliance-timeline{margin:1.35rem 0 0;border-top:3px solid #a7654e;padding-top:1rem}.alliance-timeline h3{font-family:Georgia,"Noto Serif TC","Noto Serif JP",serif;font-size:clamp(1.25rem,3vw,1.65rem);line-height:1.35;margin:.1rem 0 .45rem;color:#6f4439}.alliance-lede,.alliance-note{font-size:.96rem;color:#52605a}.alliance-timeline ol{list-style:none;padding:0;margin:1rem 0}.alliance-timeline li{display:grid;grid-template-columns:7rem 1fr;gap:.8rem;border-top:1px solid #cabda7;padding:.85rem 0}.alliance-timeline time{font-weight:800;color:#9a7138}.alliance-timeline strong,.alliance-timeline span{display:block}.alliance-timeline span{font-size:.98rem}.alliance-timeline a{color:#235650;text-underline-offset:3px}@media(max-width:620px){.alliance-timeline li{grid-template-columns:1fr;gap:.15rem}.alliance-timeline time{font-size:.92rem}}@media(prefers-reduced-motion:reduce){.alliance-timeline{opacity:1!important;transform:none!important}}';
  document.head.append(style); target.append(section);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced && window.gsap){const reveal=()=>gsap.fromTo(section,{autoAlpha:0,y:12},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'});if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();reveal();}},{threshold:.08});observer.observe(section);}else reveal();}
})();
