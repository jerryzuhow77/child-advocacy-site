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
  const activityCopy={
    'zh-Hant':{tag:'已完成活動紀錄 · 10/31',title:'淡水漁人碼頭護童行動',text:'行動已完成。四張現場照片與兩支已驗證完整影片，均保留在活動紀錄頁。',cta:'閱讀活動紀錄',url:'/child-advocacy-site/activity-records/tamsui-fishermans-wharf-advocacy-20261031/'},
    'zh-Hans':{tag:'已完成活动纪录 · 10/31',title:'淡水渔人码头护童行动',text:'行动已完成。四张现场照片与两支已验证完整影片，均保留在活动纪录页。',cta:'阅读活动纪录',url:'/child-advocacy-site/activity-records/tamsui-fishermans-wharf-advocacy-20261031/zh-Hans/'},
    en:{tag:'COMPLETED ACTIVITY RECORD · OCT 31',title:'Tamsui Fisherman’s Wharf advocacy',text:'The action is complete. The record retains four field photos and two verified full-length videos.',cta:'Read the activity record',url:'/child-advocacy-site/activity-records/tamsui-fishermans-wharf-advocacy-20261031/en/'},
    ja:{tag:'完了した活動記録 · 10月31日',title:'淡水漁人碼頭・子ども保護アクション',text:'行動は完了しました。現場写真4枚と、完全再生を確認した動画2本を記録ページに残しています。',cta:'活動記録を読む',url:'/child-advocacy-site/activity-records/tamsui-fishermans-wharf-advocacy-20261031/ja/'}
  }[lang];
  const card=document.createElement('section');
  card.dataset.taipeiDebateFeature='';
  card.innerHTML='<div class="cpa-debate-art"><img src="/child-advocacy-site/assets/art/taipei-child-reporting-debate-20261103.webp" alt="" loading="eager"></div><div class="cpa-debate-copy"><p class="cpa-debate-tag">'+copy.tag+'</p><h2>'+copy.title+'</h2><p class="cpa-debate-accent">'+copy.accent+'</p><a href="'+copy.url+'">'+copy.cta+' <span>↗</span></a></div>';
  const css=document.createElement('style');
  css.textContent='[data-taipei-debate-feature]{max-width:1120px;margin:20px auto 28px;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(260px,.95fr);background:#f7f0e3;border-top:4px solid #c65b3c;overflow:hidden;box-shadow:none}.cpa-debate-art{min-height:250px;overflow:hidden}.cpa-debate-art img{width:100%;height:100%;object-fit:cover;display:block}.cpa-debate-copy{padding:clamp(22px,4vw,52px);align-self:center}.cpa-debate-tag{color:#b54a34;font-weight:900;letter-spacing:.12em;font-size:.75rem;margin:0 0 .8rem}.cpa-debate-copy h2{font-family:Georgia,"Noto Serif TC","Noto Serif JP",serif;color:#183d44;font-size:clamp(2rem,3.4vw,3.75rem);line-height:1.02;margin:0}.cpa-debate-accent{color:#536a62;font-size:clamp(1.03rem,1.7vw,1.26rem);margin:1rem 0 1.5rem}.cpa-debate-copy a{display:inline-block;color:#183d44;font-weight:900;text-decoration:none;border-bottom:2px solid #c65b3c;padding-bottom:4px}.cpa-debate-copy a span{color:#c65b3c}@media(max-width:680px){[data-taipei-debate-feature]{margin:14px 15px 22px;grid-template-columns:1fr}.cpa-debate-art{min-height:auto;aspect-ratio:16/9}.cpa-debate-copy{padding:24px}.cpa-debate-copy h2{font-size:2.2rem}}';
  document.head.append(css);
  const target=document.querySelector('#daily-brief-pair-20261023')||document.querySelector('main');
  if(target)target.parentNode.insertBefore(card,target);
  const focusGrid=document.querySelector('#october-action-focus .october-focus-grid');
  if(focusGrid&&activityCopy&&!focusGrid.querySelector('[data-tamsui-home-record]')){
    const record=document.createElement('a');
    record.dataset.tamsuiHomeRecord='';
    record.className='october-focus-record';
    record.href=activityCopy.url;
    record.innerHTML='<img src="/child-advocacy-site/activity-records/tamsui-fishermans-wharf-advocacy-20261031/images/tamsui-field-original-01-20261102.jpg" alt="" loading="eager"><div><p>'+activityCopy.tag+'</p><h3>'+activityCopy.title+'</h3><span>'+activityCopy.text+'</span><b>'+activityCopy.cta+' →</b></div>';
    focusGrid.append(record);
  }
  const activityCss=document.createElement('style');
  activityCss.textContent='#october-action-focus .october-focus-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(280px,.65fr);gap:16px}.october-focus-record{display:grid;grid-template-columns:1fr;background:#fbf5e9;border:1px solid #c9ae88;color:#29464b;text-decoration:none;overflow:hidden}.october-focus-record img{width:100%;aspect-ratio:16/8;object-fit:cover}.october-focus-record div{padding:18px}.october-focus-record p{margin:0 0 8px;color:#a14e36;font-size:12px;font-weight:850;letter-spacing:.1em}.october-focus-record h3{margin:0 0 9px;font-size:21px;line-height:1.35}.october-focus-record span{display:block;color:#52625f;font-size:14px;line-height:1.65}.october-focus-record b{display:block;margin-top:13px;color:#754333;font-size:14px}@media(max-width:760px){#october-action-focus .october-focus-grid{grid-template-columns:1fr}.october-focus-record{grid-template-columns:92px minmax(0,1fr)}.october-focus-record img{height:100%;aspect-ratio:auto}.october-focus-record div{padding:14px}.october-focus-record h3{font-size:18px}.october-focus-record span{font-size:13px}}';
  document.head.append(activityCss);
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&window.gsap){gsap.from(card.querySelectorAll('.cpa-debate-art,.cpa-debate-copy>*'),{scrollTrigger:window.ScrollTrigger?{trigger:card,start:'top 86%',once:true}:undefined,opacity:0,y:20,stagger:.1,duration:.65,ease:'power3.out'})}
})();
