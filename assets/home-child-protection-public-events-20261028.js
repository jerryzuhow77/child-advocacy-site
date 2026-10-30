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

(()=>{
  const root='/child-advocacy-site/';
  const card={
    'zh-Hant':{href:root+'features/social-observation/xuanxuan-duty-and-records-20261028/',meta:'置頂・多元觀察｜2026.10.28',title:'萱萱案的兩條究責線：生母起訴與社工懲戒，不能混成一句話',summary:'誰被起訴？誰遭專業懲戒？把刑事與行政程序分開，才能精準追問保護責任。',read:'閱讀詳細解說 →',alt:'跨縣市兒少保護與訪視紀錄的原創水墨紙藝意象，非事件現場、無可辨識兒少。'},
    'zh-Hans':{href:root+'features/social-observation/xuanxuan-duty-and-records-20261028/zh-Hans/',meta:'置顶・多元观察｜2026.10.28',title:'萱萱案的两条追责线：生母起诉与社工惩戒，不能混成一句话',summary:'谁被起诉？谁遭专业惩戒？把刑事与行政程序分开，才能精准追问保护责任。',read:'阅读详细解说 →',alt:'跨地区儿童保护与走访记录的原创水墨纸艺意象，非事件现场、无可识别儿童。'}
  };
  const add=()=>{
    const grid=document.querySelector('#home-special-features .grid');
    if(!grid||grid.querySelector('[data-xuanxuan-duty]'))return;
    const d=card[document.documentElement.lang==='zh-Hans'?'zh-Hans':'zh-Hant'];
    const item=document.createElement('article');
    item.className='home-card feature-card is-pinned';item.dataset.date='2026-10-28';item.dataset.homePinned='true';item.dataset.xuanxuanDuty='';
    item.innerHTML='<a class="card-link home-media-report-action" data-home-article href="'+d.href+'"><img loading="lazy" decoding="async" width="720" height="405" data-home-thumb src="'+root+'assets/art/xuanxuan-cross-region-records-20261016-refined.webp" alt="'+d.alt+'"><div class="card-copy"><p class="card-meta">'+d.meta+'</p><h3>'+d.title+'</h3><p class="card-summary">'+d.summary+'</p><span class="card-action">'+d.read+'</span></div></a>';
    grid.insertBefore(item,grid.firstChild);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add,{once:true});else add();
})();


(()=>{
  const ROOT='/child-advocacy-site/';
  const pinned={
    key:'xuanxuan-duty-and-records-20261028',
    date:'2026-10-29T00:01',
    image:ROOT+'assets/art/xuanxuan-cross-region-records-20261016-refined.webp',
    copy:{
      'zh-Hant':{href:ROOT+'features/social-observation/xuanxuan-duty-and-records-20261028/',small:'置頂・多元觀察｜2026.10.28',title:'萱萱案的兩條究責線：起訴與懲戒，必須分開讀',summary:'生母涉過失致死遭起訴；台南社工的公開究責是專業懲戒。用一頁拆開程序、責任與可查證資料。',read:'先讀 60 秒結論 →',alt:'跨縣市兒少保護與訪視紀錄的原創水墨紙藝意象，非事件現場、無可辨識兒少。'},
      'zh-Hans':{href:ROOT+'features/social-observation/xuanxuan-duty-and-records-20261028/zh-Hans/',small:'置顶・多元观察｜2026.10.28',title:'萱萱案的两条追责线：起诉与惩戒，必须分开读',summary:'生母涉过失致死遭起诉；台南社工的公开追责是专业惩戒。用一页拆开程序、责任与可查证资料。',read:'先读 60 秒结论 →',alt:'跨地区儿童保护与走访记录的原创水墨纸艺意象，非事件现场、无可识别儿童。'}
    }
  };
  const locale=document.documentElement.lang==='zh-Hans'?'zh-Hans':'zh-Hant';
  const add=()=>{
    const slider=document.querySelector('[data-gsap-slider]');
    const d=pinned.copy[locale];
    if(!slider||!d||slider.querySelector('[data-xuanxuan-pinned]'))return;
    const card=document.createElement('a');
    card.href=d.href;card.dataset.homeArticle='';card.dataset.homeBrief=pinned.key;card.dataset.homeDate=pinned.date;card.dataset.homePinned='true';card.dataset.xuanxuanPinned='';
    card.innerHTML='<img src="'+pinned.image+'" alt="'+d.alt+'" data-home-thumb><span class="brief-copy"><small>'+d.small+'</small><h2>'+d.title+'</h2><p>'+d.summary+'</p><span class="brief-read">'+d.read+'</span></span>';
    const first=[...slider.children].find(el=>(el.dataset.homeDate||'')<pinned.date);
    slider.insertBefore(card,first||slider.firstChild);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add,{once:true});else add();
})();


/* 2026-10-30 — replace only the Tamsui pinned-card thumbnails. */
(()=>{
  const apply=()=>{
    const pair=document.querySelector('#october-action-focus .october-focus-article.rally .october-focus-poster-pair');
    if(!pair||pair.dataset.tamsuiPosterRefresh)return;
    const images=[...pair.querySelectorAll('img')];
    if(images.length!==2)return;
    pair.dataset.tamsuiPosterRefresh='true';
    pair.classList.add('portrait-posters');
    const posters=[
      {src:'./assets/art/tamsui-advocacy-poster-sunset-20261031-thumb.svg',alt:'10月31日淡水漁人碼頭護童宣傳海報，夕陽舉牌版本',hansAlt:'10月31日淡水渔人码头护童宣传海报，夕阳举牌版本'},
      {src:'./assets/art/tamsui-advocacy-poster-blue-20261031-thumb.svg',alt:'10月31日淡水漁人碼頭護童宣傳海報，藍色海港版本',hansAlt:'10月31日淡水渔人码头护童宣传海报，蓝色海港版本'}
    ];
    images.forEach((image,index)=>{
      const poster=posters[index];
      image.src=poster.src;
      image.alt=document.documentElement.lang==='zh-Hans'?poster.hansAlt:poster.alt;
      image.setAttribute('data-hans-alt',poster.hansAlt);
      image.width=360; image.height=640;
      image.style.aspectRatio='9 / 16';
      image.style.objectFit='cover';
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
