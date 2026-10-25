(()=>{
  const ROOT='/child-advocacy-site/';
  const copy={
    'zh-Hant':{href:ROOT+'news/digital-youth-mental-health-20261025/',small:'置頂護童快報｜2026.10.25',title:'數位世代的孩子，需要更早被接住',summary:'從數位環境、拒學到社會退縮：求助、校園辨識與家庭支持應接成一條路。',read:'閱讀完整制度追蹤 →',alt:'原創水墨紙藝意象：手機光窗連接校園、家庭與專業支持；非事件現場，無可辨識兒少'},
    'zh-Hans':{href:ROOT+'news/digital-youth-mental-health-20261025/zh-Hans/',small:'置顶护童快报｜2026.10.25',title:'数字时代的孩子，需要更早被接住',summary:'从数字环境、拒学到社会退缩：求助、校园识别与家庭支持应接成一条路。',read:'阅读完整制度追踪 →',alt:'原创水墨纸艺意象：手机光窗连接校园、家庭与专业支持；非事件现场，无可辨识儿童'},
    en:{href:ROOT+'news/digital-youth-mental-health-20261025/en/',small:'PINNED CHILD-PROTECTION BRIEF · 25 OCT 2026',title:'Children in a digital age need to be held earlier',summary:'From digital environments to school refusal and withdrawal: help-seeking, recognition and family support must become one path.',read:'Read the verified brief →',alt:'Original ink-and-paper artwork of a phone-window linking school, home and professional support; not an incident scene, with no identifiable children'},
    ja:{href:ROOT+'news/digital-youth-mental-health-20261025/ja/',small:'固定・子ども保護速報｜2026.10.25',title:'デジタル時代の子どもを、もっと早く受け止める',summary:'デジタル環境、不登校、孤立へ。相談、気づき、家族支援を一つの道につなげます。',read:'確認済みの速報を読む →',alt:'スマホの窓から学校、家庭、専門支援へつながるオリジナル水墨紙作品。現場写真ではなく、識別できる子どもはいません'}
  };
  const locale=()=>document.documentElement.lang==='ja'?'ja':document.documentElement.lang==='en'?'en':document.documentElement.lang==='zh-Hans'?'zh-Hans':'zh-Hant';
  const add=()=>{
    const slider=document.querySelector('[data-gsap-slider]');
    if(!slider||slider.querySelector('[data-home-brief="digital-youth-mental-health-20261025"]'))return;
    const item=copy[locale()],card=document.createElement('a');
    card.href=item.href;card.dataset.homeArticle='';card.dataset.homeBrief='digital-youth-mental-health-20261025';
    card.innerHTML='<img src="'+ROOT+'assets/art/digital-support-network-20261025-hero.webp?v=20261025-1" alt="'+item.alt+'" data-home-thumb><span class="brief-copy"><small>'+item.small+'</small><h2>'+item.title+'</h2><p>'+item.summary+'</p><span class="brief-read">'+item.read+'</span></span>';
    slider.prepend(card);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add,{once:true});else add();
})();
