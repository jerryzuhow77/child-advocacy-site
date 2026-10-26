(()=>{
  const ROOT='/child-advocacy-site/';
  const brief={
    key:'taipei-child-protection-report-20261026',date:'2026-10-26T09:02',image:ROOT+'assets/art/child-protection-reporting-route-20261026-hero.webp?v=20261026-hero-1',
    copy:{
      'zh-Hant':{href:ROOT+'news/taipei-child-protection-report-20261026/',small:'今日護童快報｜2026.10.26',title:'看見孩子受傷後：通報不是句點，保護要立刻接手',summary:'北市疑似兒少不當對待事件提醒：通報之後，安全評估、照顧安排與持續追蹤必須接上。',read:'閱讀查證更新 →',alt:'原創水墨紙藝意象：通往安全接待處的保護路徑、泳池建築與台北遠景；非事件現場，無可辨識當事人、主視覺無陰影'},
      'zh-Hans':{href:ROOT+'news/taipei-child-protection-report-20261026/zh-Hans/',small:'今日护童快报｜2026.10.26',title:'看见孩子受伤后：通报不是句点，保护要立刻接手',summary:'台北疑似儿童不当对待事件提醒：通报之后，安全评估、照顾安排与持续跟进必须接上。',read:'阅读核查更新 →',alt:'原创水墨纸艺意象：通往安全接待处的保护路径、泳池建筑与台北远景；非事件现场，无可识别当事人，主视觉无阴影'},
      en:{href:ROOT+'news/taipei-child-protection-report-20261026/en/',small:'DAILY CHILD PROTECTION BRIEF · 26 OCT 2026',title:'After possible harm is seen: a report cannot be the endpoint',summary:'A Taipei report is a reminder that safety assessment, safe care and continuing follow-up must begin after a report.',read:'Read the verified update →',alt:'Original ink-and-paper illustration of a protection pathway, a swimming facility and Taipei skyline; not an incident scene, no identifiable people or drop shadows'},
      ja:{href:ROOT+'news/taipei-child-protection-report-20261026/ja/',small:'今日の護童速報｜2026.10.26',title:'子どもの傷害を見かけた後：通報で保護を終わらせない',summary:'台北で報じられた事案は、通報の後に安全評価、ケア、継続支援をつなぐ必要を示します。',read:'確認済みの更新を読む →',alt:'保護の道、プール施設と台北の遠景を描くオリジナル水墨紙作品。現場写真ではなく、識別可能な人物や影はありません'}
    }
  };
  const locale=()=>document.documentElement.lang==='ja'?'ja':document.documentElement.lang==='en'?'en':document.documentElement.lang==='zh-Hans'?'zh-Hans':'zh-Hant';
  const add=()=>{
    const slider=document.querySelector('[data-gsap-slider]');
    if(!slider||slider.querySelector('[data-home-brief="'+brief.key+'"]'))return;
    const d=brief.copy[locale()],card=document.createElement('a');
    card.href=d.href;card.dataset.homeArticle='';card.dataset.homeBrief=brief.key;card.dataset.homeDate=brief.date;
    card.innerHTML='<img src="'+brief.image+'" alt="'+d.alt+'" data-home-thumb><span class="brief-copy"><small>'+d.small+'</small><h2>'+d.title+'</h2><p>'+d.summary+'</p><span class="brief-read">'+d.read+'</span></span>';
    const first=[...slider.children].find(el=>el.dataset.homeDate<brief.date);
    slider.insertBefore(card,first||slider.firstChild);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add,{once:true});else add();
})();
