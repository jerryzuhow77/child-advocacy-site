(()=> {
  const ROOT='/child-advocacy-site/';
  const brief={
    key:'child-protection-public-events-20261028',
    date:'2026-10-28T18:00',
    image:ROOT+'assets/art/dual-city-child-protection-events-20261028-hero.svg',
    copy:{
      'zh-Hant':{
        href:ROOT+'activity-records/child-protection-public-events-20261028/',
        small:'置頂活動指南｜2026.10.28',
        title:'雙北兒少保護公開活動彙整',
        summary:'收錄 10/29 至 11/7 可公開參與或觀看的兒少心理健康、數位安全與保護活動；出發或報名前請再確認主辦公告。',
        read:'查看活動指南 →',
        alt:'雙北兒少保護公開活動彙整主視覺：抽象城市、保護路徑與活動資訊意象，非事件現場。'
      },
      'zh-Hans':{
        href:ROOT+'activity-records/child-protection-public-events-20261028/zh-Hans/',
        small:'置顶活动指南｜2026.10.28',
        title:'双北儿少保护公开活动汇整',
        summary:'收录 10/29 至 11/7 可公开参与或观看的儿童心理健康、数字安全与保护活动；出发或报名前请再次确认主办公告。',
        read:'查看活动指南 →',
        alt:'双北儿少保护公开活动汇整主视觉：抽象城市、保护路径与活动资讯意象，非事件现场。'
      },
      en:{
        href:ROOT+'activity-records/child-protection-public-events-20261028/en/',
        small:'PINNED EVENT GUIDE · 28 OCT 2026',
        title:'Public Child-Protection Events in Taipei & New Taipei',
        summary:'A verified guide to public child mental-health, digital-safety and protection events from 29 October to 7 November. Check each organizer’s notice before attending.',
        read:'View the event guide →',
        alt:'Public child-protection events guide visual: an abstract city, protection pathways and event information; not an incident scene.'
      },
      ja:{
        href:ROOT+'activity-records/child-protection-public-events-20261028/ja/',
        small:'固定・公開イベント案内｜2026.10.28',
        title:'台北・新北 児童保護公開イベント案内',
        summary:'10月29日から11月7日までの、児童のメンタルヘルス、デジタル安全、保護に関する公開参加・視聴可能な活動を整理しました。参加前に主催者の案内をご確認ください。',
        read:'イベント案内を見る →',
        alt:'公開児童保護イベント案内の視覚：抽象的な都市、保護の道筋、活動情報。事件現場ではありません。'
      }
    }
  };
  const locale=()=>document.documentElement.lang==='ja'?'ja':document.documentElement.lang==='en'?'en':document.documentElement.lang==='zh-Hans'?'zh-Hans':'zh-Hant';
  const add=()=>{
    const slider=document.querySelector('[data-gsap-slider]');
    if(!slider||slider.querySelector('[data-home-brief="'+brief.key+'"]'))return;
    const d=brief.copy[locale()],card=document.createElement('a');
    card.href=d.href;
    card.dataset.homeArticle='';
    card.dataset.homeBrief=brief.key;
    card.dataset.homeDate=brief.date;
    card.innerHTML='<img src="'+brief.image+'" alt="'+d.alt+'" data-home-thumb><span class="brief-copy"><small>'+d.small+'</small><h2>'+d.title+'</h2><p>'+d.summary+'</p><span class="brief-read">'+d.read+'</span></span>';
    const first=[...slider.children].find(el=>(el.dataset.homeDate||'')<brief.date);
    slider.insertBefore(card,first||slider.firstChild);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add,{once:true});else add();
})();
