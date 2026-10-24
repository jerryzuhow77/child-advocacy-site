(()=> {
  const ROOT='/child-advocacy-site/';
  const briefs=[
    {
      key:'vehicle-safety-20261024',
      copy:{
        'zh-Hant':{href:ROOT+'news/vehicle-safety-check-20261024/',small:'置頂護童快報｜2026.10.24',title:'拖吊前的最後一眼：車內安全確認不能漏掉',summary:'豐原拖吊事件提醒我們：確認車內無人，應成為每次移動車輛前不可省略的安全步驟。',read:'閱讀查證更新 →',alt:'原創水墨紙藝意象：車內安全座椅、車側與安全檢核表；非事件現場，無人物臉孔、無陰影'},
        'zh-Hans':{href:ROOT+'news/vehicle-safety-check-20261024/zh-Hans/',small:'置顶护童快报｜2026.10.24',title:'拖吊前的最后一眼：车内安全确认不能漏掉',summary:'丰原拖吊事件提醒我们：确认车内无人，应成为每次移动车辆前不可省略的安全步骤。',read:'阅读查证更新 →',alt:'原创水墨纸艺意象：车内安全座椅、车侧与安全核对表；非事件现场，无人物脸孔、无阴影'},
        en:{href:ROOT+'news/vehicle-safety-check-20261024/en/',small:'PINNED CHILD-PROTECTION BRIEF · 24 OCT 2026',title:'One last look before towing: never skip the vehicle safety check',summary:'The Fengyuan towing incident is a reminder: confirming that no one is inside must be a non-negotiable step before any vehicle moves.',read:'Read the verified update →',alt:'Original ink-and-paper artwork of a child safety seat, vehicle side and safety checklist; not an incident scene, no identifiable people or shadows'},
        ja:{href:ROOT+'news/vehicle-safety-check-20261024/ja/',small:'固定・子ども保護速報｜2026.10.24',title:'レッカー移動の前に、もう一度：車内確認を省かない',summary:'豊原のレッカー移動事案は、車を動かす前に車内に人がいないことを確かめる手順を省略してはならないと示します。',read:'確認済みの更新を読む →',alt:'チャイルドシート、車側、安全確認表を描くオリジナル水墨紙作品。現場写真ではなく、顔が識別できる人物や影はありません'}
      },
      image:ROOT+'assets/art/vehicle-safety-check-20261024-hero.webp'
    },
    {
      key:'online-safety-20261024',
      copy:{
        'zh-Hant':{href:ROOT+'news/online-safety-help-route-20261024/',small:'今日護童快報｜2026.10.24',title:'孩子在網路遇險，求助不該走迷路',summary:'網路安全不能只靠提醒；求助入口應接起通報、下架、證據保全與支持。',read:'閱讀查證更新 →',alt:'孩子與照顧者走向清楚求助路徑的原創水墨紙藝意象，非事件現場，主視覺無陰影'},
        'zh-Hans':{href:ROOT+'news/online-safety-help-route-20261024/zh-Hans/',small:'今日护童快报｜2026.10.24',title:'孩子在网络遇险，求助不该走迷路',summary:'网络安全不能只靠提醒；求助入口应接起通报、下架、证据保全与支持。',read:'阅读查证更新 →',alt:'孩子与照顾者走向清楚求助路径的原创水墨纸艺意象，非事件现场，主视觉无阴影'},
        en:{href:ROOT+'news/online-safety-help-route-20261024/en/',small:'DAILY BRIEF · 24 OCT 2026',title:'When children face risk online, help should not be a maze',summary:'Online safety needs more than warnings: one clear route should connect reporting, takedown, evidence and support.',read:'Read the verified update →',alt:'Original ink-and-paper illustration of a child and carer following a clear route to help; not an incident scene, with no drop shadows'},
        ja:{href:ROOT+'news/online-safety-help-route-20261024/ja/',small:'今日の護童速報｜2026.10.24',title:'子どもがネットで危険に直面したとき、助けへの道を迷わせない',summary:'注意喚起だけでは不十分です。通報、削除、証拠保全、支援を一つの道につなげます。',read:'確認済みの更新を読む →',alt:'子どもと養育者が明確な支援の道へ向かう、オリジナルの水墨と紙の作品。事件現場ではなく、主視覚に影はありません'}
      },
      image:ROOT+'assets/art/child-online-safety-help-route-20261024-hero.png?v=20261024'
    }
  ];
  const language=()=>document.documentElement.lang==='ja'?'ja':document.documentElement.lang==='en'?'en':document.documentElement.lang==='zh-Hans'?'zh-Hans':'zh-Hant';
  const addBrief=(slider,brief,locale)=>{
    if(slider.querySelector('[data-home-brief="'+brief.key+'"]')) return;
    const data=brief.copy[locale],card=document.createElement('a');
    card.href=data.href;
    card.dataset.homeArticle='';
    card.setAttribute('data-home-brief',brief.key);
    card.innerHTML='<img src="'+brief.image+'" alt="'+data.alt+'" data-home-thumb><span class="brief-copy"><small>'+data.small+'</small><h2>'+data.title+'</h2><p>'+data.summary+'</p><span class="brief-read">'+data.read+'</span></span>';
    slider.prepend(card);
  };
  const init=()=>{
    const slider=document.querySelector('[data-gsap-slider]');
    if(!slider) return;
    slider.id='daily-brief-pair-20261024';
    const locale=language();
    [...briefs].reverse().forEach(brief=>addBrief(slider,brief,locale));
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
